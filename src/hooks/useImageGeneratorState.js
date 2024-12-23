import { useState, useEffect } from 'react';
import { useModelConfigs } from './useModelConfigs';

const STORAGE_KEY = 'imageGeneratorState';

export const useImageGeneratorState = () => {
  const { data: modelConfigs } = useModelConfigs();
  
  // Load initial state from localStorage or use default values
  const getInitialState = () => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Only restore specific fields that should persist
      return {
        prompt: '',
        seed: 0,
        randomizeSeed: true,
        width: 1024,
        height: 1024,
        model: 'flux',
        activeTab: 'images',
        aspectRatio: '1:1',
        useAspectRatio: true,
        quality: 'HD',
        modelSidebarOpen: false,
        selectedImage: null,
        detailsDialogOpen: false,
        fullScreenViewOpen: false,
        fullScreenImageIndex: 0,
        generatingImages: parsedState.generatingImages || [],
        activeView: 'myImages',
        nsfwEnabled: parsedState.nsfwEnabled ?? false,
        style: null,
        imageCount: 1,
        isPrivate: false
      };
    }
    return {
      prompt: '',
      seed: 0,
      randomizeSeed: true,
      width: 1024,
      height: 1024,
      model: 'flux',
      activeTab: 'images',
      aspectRatio: '1:1',
      useAspectRatio: true,
      quality: 'HD',
      modelSidebarOpen: false,
      selectedImage: null,
      detailsDialogOpen: false,
      fullScreenViewOpen: false,
      fullScreenImageIndex: 0,
      generatingImages: [],
      activeView: 'myImages',
      nsfwEnabled: false,
      style: null,
      imageCount: 1,
      isPrivate: false
    };
  };

  const [state, setState] = useState(getInitialState);

  // Save relevant state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      generatingImages: state.generatingImages,
      nsfwEnabled: state.nsfwEnabled
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [state.generatingImages, state.nsfwEnabled]);

  const setGeneratingImages = (value) => {
    setState(prev => {
      const newGeneratingImages = Array.isArray(value) 
        ? value 
        : typeof value === 'function' 
          ? value(prev.generatingImages) 
          : [];
      
      return {
        ...prev,
        generatingImages: newGeneratingImages
      };
    });
  };

  // Create setters for each state property
  const setters = {
    setPrompt: (value) => setState(prev => ({ ...prev, prompt: value })),
    setSeed: (value) => setState(prev => ({ ...prev, seed: value })),
    setRandomizeSeed: (value) => setState(prev => ({ ...prev, randomizeSeed: value })),
    setWidth: (value) => setState(prev => ({ ...prev, width: value })),
    setHeight: (value) => setState(prev => ({ ...prev, height: value })),
    setModel: (value) => setState(prev => ({ ...prev, model: value })),
    setActiveTab: (value) => setState(prev => ({ ...prev, activeTab: value })),
    setAspectRatio: (value) => setState(prev => ({ ...prev, aspectRatio: value })),
    setUseAspectRatio: (value) => setState(prev => ({ ...prev, useAspectRatio: value })),
    setQuality: (value) => setState(prev => ({ ...prev, quality: value })),
    setModelSidebarOpen: (value) => setState(prev => ({ ...prev, modelSidebarOpen: value })),
    setSelectedImage: (value) => setState(prev => ({ ...prev, selectedImage: value })),
    setDetailsDialogOpen: (value) => setState(prev => ({ ...prev, detailsDialogOpen: value })),
    setFullScreenViewOpen: (value) => setState(prev => ({ ...prev, fullScreenViewOpen: value })),
    setFullScreenImageIndex: (value) => setState(prev => ({ ...prev, fullScreenImageIndex: value })),
    setGeneratingImages,
    setActiveView: (value) => setState(prev => ({ ...prev, activeView: value })),
    setNsfwEnabled: (value) => setState(prev => ({ ...prev, nsfwEnabled: value })),
    setStyle: (value) => setState(prev => ({ ...prev, style: value })),
    setImageCount: (value) => setState(prev => ({ ...prev, imageCount: value })),
    setIsPrivate: (value) => setState(prev => ({ ...prev, isPrivate: value }))
  };

  return {
    ...state,
    ...setters
  };
};