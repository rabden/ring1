import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useQueryClient } from '@tanstack/react-query';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import AuthOverlay from '@/components/AuthOverlay';
import BottomNavbar from '@/components/BottomNavbar';
import ImageGeneratorContainer from '@/components/ImageGeneratorContainer';
import ImageDetailsDialog from '@/components/ImageDetailsDialog';
import FullScreenImageView from '@/components/FullScreenImageView';
import MobileGeneratingStatus from '@/components/MobileGeneratingStatus';
import MobileNotificationsMenu from '@/components/MobileNotificationsMenu';
import MobileProfileMenu from '@/components/MobileProfileMenu';
import GeneratorHeader from '@/components/image-generator/GeneratorHeader';
import GeneratorGallery from '@/components/image-generator/GeneratorGallery';
import { useImageGeneratorState } from '@/hooks/useImageGeneratorState';
import { useImageHandlers } from '@/hooks/useImageHandlers';
import { useProUser } from '@/hooks/useProUser';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import GeneratingImagesDropdown from '@/components/GeneratingImagesDropdown';

const ImageGenerator = () => {
  const { imageId } = useParams();
  const location = useLocation();
  const isRemixRoute = location.pathname.startsWith('/remix/');

  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrivate, setShowPrivate] = useState(false);
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
    imageCount, setImageCount, isPrivate, setIsPrivate
  } = useImageGeneratorState();

  const [completedImages, setCompletedImages] = useState([]);

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
    await generateImage();
  };

  const {
    handleImageClick,
    handleModelChange,
    handlePromptKeyDown,
    handleRemix,
    handleDownload,
    handleDiscard,
    handleViewDetails,
  } = useImageHandlers({
    generateImage: handleGenerateImage,
    setSelectedImage,
    setFullScreenViewOpen,
    setModel,
    setSteps,
    setPrompt,
    setSeed,
    setRandomizeSeed,
    setWidth,
    setHeight,
    setQuality,
    setAspectRatio,
    setUseAspectRatio,
    aspectRatios: [],
    session,
    queryClient,
    activeView,
    setDetailsDialogOpen,
    setActiveView,
  });

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

  useEffect(() => {
    const checkCompletedImages = async () => {
      const completed = [];
      for (const img of generatingImages) {
        try {
          const { data } = await supabase
            .from('user_images')
            .select('*')
            .eq('id', img.id)
            .single();
          
          if (data && data.storage_path) {
            completed.push(data);
            setGeneratingImages(prev => prev.filter(i => i.id !== img.id));
          }
        } catch (error) {
          console.error('Error checking image status:', error);
        }
      }
      if (completed.length > 0) {
        setCompletedImages(prev => [...completed, ...prev]);
      }
    };

    if (generatingImages.length > 0) {
      const interval = setInterval(checkCompletedImages, 2000);
      return () => clearInterval(interval);
    }
  }, [generatingImages]);

  useEffect(() => {
    setCompletedImages([]);
  }, [activeTab, activeView]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className={`flex-grow p-2 md:p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        <GeneratorHeader
          session={session}
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
          isHeaderVisible={isHeaderVisible}
        />

        <GeneratorGallery
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
      </div>

      <ImageGeneratorContainer
        session={session}
        credits={credits}
        bonusCredits={bonusCredits}
        generatingImages={generatingImages}
        completedImages={completedImages}
        prompt={prompt}
        setPrompt={setPrompt}
        handlePromptKeyDown={handlePromptKeyDown}
        generateImage={handleGenerateImage}
        model={model}
        setModel={setModel}
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
        steps={steps}
        setSteps={setSteps}
        proMode={isPro}
        modelConfigs={modelConfigs}
        isPrivate={isPrivate}
        setIsPrivate={setIsPrivate}
        imageCount={imageCount}
        setImageCount={setImageCount}
      />

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
      {generatingImages.length > 0 && (
        <MobileGeneratingStatus generatingImages={generatingImages} />
      )}
    </div>
  );
};

export default ImageGenerator;