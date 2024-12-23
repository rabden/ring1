import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { qualityOptions } from '@/utils/imageConfigs';
import { calculateDimensions, getModifiedPrompt } from '@/utils/imageUtils';
import { handleApiResponse, initRetryCount, getRetryCount } from '@/utils/retryUtils';
import { useState, useRef, useCallback, useEffect } from 'react';

const MAX_RETRIES = 5;
const STORAGE_KEY = 'imageGeneratorState';

export const useImageGeneration = ({
  session,
  prompt,
  seed,
  randomizeSeed,
  width,
  height,
  model,
  quality,
  useAspectRatio,
  aspectRatio,
  updateCredits,
  setGeneratingImages,
  modelConfigs,
  imageCount = 1,
  negativePrompt
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const processingTimeoutRef = useRef(null);

  // Simplified cancel handler
  const handleCancel = useCallback((imageId) => {
    setGeneratingImages((prevImages) => {
      const image = prevImages.find((img) => img.id === imageId);
      if (!image) return prevImages;

      // If the image is processing or pending, refund the credits
      if (image.status === 'processing' || image.status === 'pending') {
        updateCredits({ quality: image.quality, imageCount: 1, isRefund: true });
      }

      // Remove the image from the state
      const updatedImages = prevImages.filter((img) => img.id !== imageId);
      
      // Save the updated state to localStorage
      localStorage.setItem('generatingImages', JSON.stringify(updatedImages));
      
      // If we just cancelled the processing image, start processing the next one
      const wasProcessing = image.status === 'processing';
      if (wasProcessing) {
        setIsProcessing(false);
        const nextPending = updatedImages.find((img) => img.status === 'pending');
        if (nextPending) {
          processQueue();
        }
      }

      return updatedImages;
    });
  }, [setGeneratingImages, updateCredits, quality]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  // Simplified queue processing
  const processQueue = useCallback(async () => {
    if (isProcessing) return;

    // Get the current state of generating images
    const currentImages = JSON.parse(localStorage.getItem('generatingImages') || '[]');
    
    // Find the first pending generation that hasn't been processed yet
    const pendingGeneration = currentImages.find(img => 
      img.status === 'pending' && 
      !img.storage_path // Make sure it hasn't been completed
    );
    
    if (!pendingGeneration) {
      setIsProcessing(false);
      return;
    }

    // Double check there's no processing image
    const hasProcessing = currentImages.some(img => img.status === 'processing');
    if (hasProcessing) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);

    // Update the status to processing
    const updatedImages = currentImages.map(img =>
      img.id === pendingGeneration.id ? { 
        ...img, 
        status: 'processing',
        retryCount: img.retryCount || 0
      } : img
    );
    setGeneratingImages(updatedImages);
    localStorage.setItem('generatingImages', JSON.stringify(updatedImages));

    // Set timeout for generation
    processingTimeoutRef.current = setTimeout(() => {
      if (isProcessing) {
        handleCancel(pendingGeneration.id);
        toast.error('Generation timed out');
      }
    }, 300000); // 5 minutes timeout

    const makeRequest = async (retryCount = 0) => {
      try {
        // Make the API request
        const { data: apiKeyData, error: apiKeyError } = await supabase
          .from('huggingface_api_keys')
          .select('api_key')
          .eq('is_active', true)
          .order('last_used_at', { ascending: true })
          .limit(1)
          .single();

        if (apiKeyError || !apiKeyData) {
          throw new Error(apiKeyError?.message || 'No active API key available');
        }

        // Update key usage timestamp
        await supabase
          .from('huggingface_api_keys')
          .update({ last_used_at: new Date().toISOString() })
          .eq('api_key', apiKeyData.api_key);

        const modelConfig = modelConfigs[pendingGeneration.model];
        
        // Make the generation request
        const response = await fetch(modelConfig?.apiUrl, {
          headers: {
            Authorization: `Bearer ${apiKeyData.api_key}`,
            "Content-Type": "application/json",
            "x-wait-for-model": "true"
          },
          method: "POST",
          body: JSON.stringify({
            inputs: pendingGeneration.prompt,
            parameters: {
              seed: pendingGeneration.seed,
              width: pendingGeneration.width,
              height: pendingGeneration.height,
              ...(modelConfig.steps && { num_inference_steps: parseInt(modelConfig.steps) }),
              ...(modelConfig.use_guidance && { guidance_scale: modelConfig.defaultguidance }),
              ...(modelConfig.use_negative_prompt && modelConfig.default_negative_prompt && { 
                negative_prompt: pendingGeneration.negativePrompt || modelConfig.default_negative_prompt 
              })
            }
          }),
        });

        // Handle response with retries
        const imageBlob = await handleApiResponse(response, pendingGeneration.id, async () => {
          if (retryCount >= MAX_RETRIES) {
            throw new Error('Max retries reached');
          }

          // Update retry count in UI
          setGeneratingImages(prev => prev.map(img =>
            img.id === pendingGeneration.id
              ? {
                  ...img,
                  retryCount: retryCount + 1,
                  retryReason: response.status === 429 ? 'Rate limit reached' : 'Server error'
                }
              : img
          ));

          await new Promise(resolve => setTimeout(resolve, 1000));
          return makeRequest(retryCount + 1);
        });

        if (!imageBlob || imageBlob.size === 0) {
          throw new Error('Generated image is invalid');
        }

        // Upload the image
        const timestamp = Date.now();
        const filePath = `${session.user.id}/${timestamp}.png`;
        
        const { error: uploadError } = await supabase.storage
          .from('user-images')
          .upload(filePath, imageBlob);
          
        if (uploadError) throw uploadError;

        // Save to database
        const { error: insertError } = await supabase
          .from('user_images')
          .insert([{
            user_id: session.user.id,
            storage_path: filePath,
            prompt: pendingGeneration.prompt,
            seed: pendingGeneration.seed,
            width: pendingGeneration.width,
            height: pendingGeneration.height,
            model: pendingGeneration.model,
            quality: pendingGeneration.quality,
            aspect_ratio: pendingGeneration.aspectRatio || '1:1',
            is_private: pendingGeneration.isPrivate
          }])
          .select()
          .single();

        if (insertError) throw insertError;

        // Update the status to completed and save the result
        const completedImages = currentImages.map(img =>
          img.id === pendingGeneration.id
            ? { 
                ...img, 
                status: 'completed',
                storage_path: filePath,
                retryCount: retryCount
              }
            : img
        );
        setGeneratingImages(completedImages);
        localStorage.setItem('generatingImages', JSON.stringify(completedImages));

        toast.success(`Image generated successfully! (${pendingGeneration.isPrivate ? 'Private' : 'Public'})`);

        // Clear timeout and process next
        clearTimeout(processingTimeoutRef.current);
        setIsProcessing(false);
        processQueue();
      } catch (error) {
        console.error('Generation failed:', error);

        // Update the status to failed
        const failedImages = currentImages.map(img =>
          img.id === pendingGeneration.id
            ? { 
                ...img, 
                status: 'failed', 
                error: error.message,
                retryCount: retryCount
              }
            : img
        );
        setGeneratingImages(failedImages);
        localStorage.setItem('generatingImages', JSON.stringify(failedImages));

        // Clear timeout and process next
        clearTimeout(processingTimeoutRef.current);
        setIsProcessing(false);
        processQueue();
      }
    };

    await makeRequest(0);
  }, [isProcessing, setGeneratingImages, session, modelConfigs, handleCancel]);

  // Add new generations to queue
  const generateImage = async (isPrivate = false, finalPrompt = null) => {
    if (!session || !prompt || !modelConfigs) {
      !session && toast.error('Please sign in to generate images');
      !prompt && toast.error('Please enter a prompt');
      !modelConfigs && console.error('Model configs not loaded');
      return;
    }

    const modelConfig = modelConfigs[model];
    if (!modelConfig) {
      toast.error('Invalid model selected');
      return;
    }

    try {
      const result = await updateCredits({ quality, imageCount });
      if (result === -1) {
        toast.error('Insufficient credits');
        return;
      }

      for (let i = 0; i < imageCount; i++) {
        const actualSeed = randomizeSeed ? Math.floor(Math.random() * 1000000) : seed + i;
        const generationId = Date.now().toString() + i;
        const modifiedPrompt = await getModifiedPrompt(finalPrompt || prompt, model, modelConfigs);
        const maxDimension = qualityOptions[quality];
        const { width: finalWidth, height: finalHeight, aspectRatio: finalAspectRatio } = calculateDimensions(
          useAspectRatio, 
          aspectRatio || '1:1',
          width, 
          height, 
          maxDimension
        );

        // Add to UI state
        setGeneratingImages(prev => [...prev, { 
          id: generationId, 
          width: finalWidth, 
          height: finalHeight,
          prompt: modifiedPrompt,
          model,
          quality,
          seed: actualSeed,
          isPrivate,
          status: 'pending',
          aspectRatio: finalAspectRatio || '1:1',
          created_at: new Date().toISOString()
        }]);
      }

      if (!isProcessing) {
        processQueue();
      }
    } catch (error) {
      console.error('Error starting generation:', error);
      toast.error('Failed to start generation');
    }
  };

  return { generateImage, handleCancel };
};