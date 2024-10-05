import { useState } from 'react'
import { modelConfigs } from '@/utils/imageConfigs'

export const useImageGeneratorState = () => {
  const [prompt, setPrompt] = useState('')
  const [seed, setSeed] = useState(0)
  const [randomizeSeed, setRandomizeSeed] = useState(true)
  const [width, setWidth] = useState(1024)
  const [height, setHeight] = useState(1024)
  const [steps, setSteps] = useState(modelConfigs.flux.defaultStep)
  const [model, setModel] = useState('flux')
  const [activeTab, setActiveTab] = useState('images')
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [useAspectRatio, setUseAspectRatio] = useState(true)
  const [quality, setQuality] = useState("HD")
  const [modelSidebarOpen, setModelSidebarOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [fullScreenViewOpen, setFullScreenViewOpen] = useState(false)
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0)
  const [generatingImages, setGeneratingImages] = useState([])
  const [activeView, setActiveView] = useState('myImages')

  return {
    prompt, setPrompt,
    seed, setSeed,
    randomizeSeed, setRandomizeSeed,
    width, setWidth,
    height, setHeight,
    steps, setSteps,
    model, setModel,
    activeTab, setActiveTab,
    aspectRatio, setAspectRatio,
    useAspectRatio, setUseAspectRatio,
    quality, setQuality,
    modelSidebarOpen, setModelSidebarOpen,
    selectedImage, setSelectedImage,
    detailsDialogOpen, setDetailsDialogOpen,
    fullScreenViewOpen, setFullScreenViewOpen,
    fullScreenImageIndex, setFullScreenImageIndex,
    generatingImages, setGeneratingImages,
    activeView, setActiveView
  }
}