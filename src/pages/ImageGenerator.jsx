import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useQueryClient } from '@tanstack/react-query';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { usePromptImprovement } from '@/hooks/usePromptImprovement';
import AuthOverlay from '@/components/AuthOverlay';
import BottomNavbar from '@/components/BottomNavbar';
import ImageGeneratorSettings from '@/components/ImageGeneratorSettings';
import ImageGallery from '@/components/ImageGallery';
import ImageDetailsDialog from '@/components/ImageDetailsDialog';
import FullScreenImageView from '@/components/FullScreenImageView';
import DesktopHeader from '@/components/header/DesktopHeader';
import MobileHeader from '@/components/header/MobileHeader';
import MobileNotificationsMenu from '@/components/MobileNotificationsMenu';
import MobileProfileMenu from '@/components/MobileProfileMenu';
import { useImageGeneratorState } from '@/hooks/useImageGeneratorState';
import { useImageHandlers } from '@/hooks/useImageHandlers';
import { useProUser } from '@/hooks/useProUser';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import Feed from '@/components/Feed';

const ImageGenerator = () => {
  const { imageId } = useParams();
  const location = useLocation();
  const isRemixRoute = location.pathname.startsWith('/remix/');
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    isImproving,
    setIsImproving,
    improvedPrompt,
    setImprovedPrompt,
    improveCurrentPrompt
  } = usePromptImprovement();

  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const isHeaderVisible = useScrollDirection();
  const { session } = useSupabaseAuth();
  const { credits, bonusCredits, updateCredits } = useUserCredits(session?.user?.id);
  const { data: isPro } = useProUser(session?.user?.id);
  const { data: modelConfigs } = useModelConfigs();
  const queryClient = useQueryClient();

  const {
    prompt, setPrompt, seed, setSeed, randomizeSeed, setRandomizeSeed,
    width, setWidth, height, setHeight, steps, setSteps,
    model, setModel, activeTab, setActiveTab, aspectRatio, setAspectRatio,
    useAspectRatio, setUseAspectRatio, quality, setQuality,
    selectedImage, setSelectedImage,
    detailsDialogOpen, setDetailsDialogOpen, fullScreenViewOpen, setFullScreenViewOpen,
    fullScreenImageIndex, setFullScreenImageIndex, generatingImages, setGeneratingImages,
    activeView, setActiveView, nsfwEnabled, setNsfwEnabled, style, setStyle,
    imageCount, setImageCount
  } = useImageGeneratorState();

  const [showPrivate, setShowPrivate] = useState(false);

  const { generateImage } = useImageGeneration({
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
    style,
    modelConfigs,
    steps,
    imageCount
  });

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    if (!session) {
      toast.error('Please sign in to generate images');
      return;
    }

    setIsGenerating(true);
    try {
      let finalPrompt = prompt;
      
      if (isImproving) {
        const improved = await improveCurrentPrompt(prompt);
        if (!improved) {
          setIsGenerating(false);
          return;
        }
        finalPrompt = improved;
        setPrompt(improved); // Update the prompt in the UI
      }

      await generateImage(isPrivate, finalPrompt);
    } catch (error) {
      toast.error('Failed to generate image');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageClick = (image) => {
    // Handle image click logic
  };

  const handleModelChange = (model) => {
    setModel(model);
  };

  const handlePromptKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleGenerateImage();
    }
  };

  const handleRemix = (image) => {
    // Handle remix logic
  };

  const handleDownload = (imageUrl, prompt) => {
    // Handle download logic
  };

  const handleDiscard = (image) => {
    // Handle discard logic
  };

  const handleViewDetails = (image) => {
    setSelectedImage(image);
    setDetailsDialogOpen(true);
  };

  const handleFilterChange = (type, value) => {
    setActiveFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleRemoveFilter = (type) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[type];
      return newFilters;
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const { data: remixImage } = useQuery({
    queryKey: ['remixImage', imageId],
    queryFn: async () => {
      if (!imageId) return null;
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('id', imageId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!imageId && isRemixRoute,
  });

  useEffect(() => {
    if (remixImage && isRemixRoute) {
      setPrompt(remixImage.prompt);
      setSeed(remixImage.seed);
      setRandomizeSeed(false);
      setWidth(remixImage.width);
      setHeight(remixImage.height);
      setModel(remixImage.model);
      setQuality(remixImage.quality);
      setStyle(remixImage.style);
      if (remixImage.aspect_ratio) {
        setAspectRatio(remixImage.aspect_ratio);
        setUseAspectRatio(true);
      }
    }
  }, [remixImage, isRemixRoute]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className={`flex-grow p-2 md:p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        {session && (
          <>
            <DesktopHeader
              user={session.user}
              credits={credits}
              bonusCredits={bonusCredits}
              activeView={activeView}
              setActiveView={setActiveView}
              generatingImages={generatingImages}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onRemoveFilter={handleRemoveFilter}
              onSearch={handleSearch}
              nsfwEnabled={nsfwEnabled}
              showPrivate={showPrivate}
              onTogglePrivate={() => setShowPrivate(!showPrivate)}
            />
            <MobileHeader
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onRemoveFilter={handleRemoveFilter}
              onSearch={handleSearch}
              isVisible={isHeaderVisible}
              nsfwEnabled={nsfwEnabled}
              showPrivate={showPrivate}
              onTogglePrivate={() => setShowPrivate(!showPrivate)}
              activeView={activeView}
            />
          </>
        )}

        <div className="md:mt-16 mt-12">
          {activeView === 'feed' ? (
            <Feed
              userId={session?.user?.id}
              onImageClick={handleImageClick}
              onDownload={handleDownload}
              onRemix={handleRemix}
              onViewDetails={handleViewDetails}
            />
          ) : (
            <ImageGallery
              userId={session?.user?.id}
              onImageClick={handleImageClick}
              onDownload={handleDownload}
              onDiscard={handleDiscard}
              onRemix={handleRemix}
              onViewDetails={handleViewDetails}
              activeView={activeView}
              generatingImages={generatingImages}
              nsfwEnabled={nsfwEnabled}
              modelConfigs={modelConfigs}
              activeFilters={activeFilters}
              searchQuery={searchQuery}
              setActiveTab={setActiveTab}
              setStyle={setStyle}
              showPrivate={showPrivate}
            />
          )}
        </div>
      </div>

      <div className={`w-full md:w-[350px] bg-card text-card-foreground p-4 md:p-6 overflow-y-auto ${activeTab === 'input' ? 'block' : 'hidden md:block'} md:fixed md:right-0 md:top-0 md:bottom-0 max-h-[calc(100vh-56px)] md:max-h-screen relative`}>
        {!session && (
          <div className="absolute inset-0 z-10">
            <AuthOverlay />
          </div>
        )}
        <ImageGeneratorSettings
          prompt={prompt}
          setPrompt={setPrompt}
          handlePromptKeyDown={handlePromptKeyDown}
          generateImage={handleGenerateImage}
          model={model}
          setModel={handleModelChange}
          seed={seed}
          setSeed={setSeed}
          randomizeSeed={randomizeSeed}
          setRandomizeSeed={setRandomizeSeed}
          quality={quality}
          setQuality={setQuality}
          useAspectRatio={useAspectRatio}
          setUseAspectRatio={setUseAspectRatio}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          width={width}
          setWidth={setWidth}
          height={height}
          setHeight={setHeight}
          session={session}
          credits={credits}
          bonusCredits={bonusCredits}
          nsfwEnabled={nsfwEnabled}
          setNsfwEnabled={setNsfwEnabled}
          style={style}
          setStyle={setStyle}
          steps={steps}
          setSteps={setSteps}
          proMode={isPro}
          modelConfigs={modelConfigs}
          isPrivate={isPrivate}
          setIsPrivate={setIsPrivate}
          imageCount={imageCount}
          setImageCount={setImageCount}
          isImproving={isImproving}
          setIsImproving={setIsImproving}
          isGenerating={isGenerating}
        />
      </div>

      <MobileNotificationsMenu activeTab={activeTab} />
      <MobileProfileMenu 
        user={session?.user}
        credits={credits}
        bonusCredits={bonusCredits}
        activeTab={activeTab}
      />

      <BottomNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        session={session} 
        credits={credits}
        bonusCredits={bonusCredits}
        activeView={activeView}
        setActiveView={setActiveView}
        generatingImages={generatingImages}
      />
      
      <ImageDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        image={selectedImage}
      />
      <FullScreenImageView
        image={selectedImage}
        isOpen={fullScreenViewOpen}
        onClose={() => setFullScreenViewOpen(false)}
        onDownload={handleDownload}
        onDiscard={handleDiscard}
        onRemix={handleRemix}
        isOwner={selectedImage?.user_id === session?.user?.id}
        setStyle={setStyle}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default ImageGenerator;
