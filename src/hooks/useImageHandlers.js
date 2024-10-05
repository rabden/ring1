import { toast } from 'sonner'
import { deleteImageCompletely } from '@/integrations/supabase/imageUtils'
import { modelConfigs } from '@/utils/modelConfigs'

export const useImageHandlers = ({
  setActiveTab,
  generateImage,
  images,
  setSelectedImage,
  setFullScreenImageIndex,
  fullScreenImageIndex,
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
  aspectRatios,
  session,
  queryClient,
  activeView,
  setDetailsDialogOpen,
  setActiveView,
}) => {
  const handleGenerateImage = async () => {
    setActiveTab('images')
    setActiveView('myImages')
    await generateImage()
  }

  const handleImageClick = (image, index) => {
    setSelectedImage(image)
    setFullScreenImageIndex(index)
    setFullScreenViewOpen(true)
  }

  const handleFullScreenNavigate = (direction) => {
    if (!images) return
    const newIndex = direction === 'next' 
      ? Math.min(fullScreenImageIndex + 1, images.length - 1) 
      : Math.max(fullScreenImageIndex - 1, 0)
    setFullScreenImageIndex(newIndex)
    setSelectedImage(images[newIndex])
  }

  const handleModelChange = (value) => {
    setModel(value)
    if (modelConfigs[value] && modelConfigs[value].defaultStep) {
      setSteps(modelConfigs[value].defaultStep)
    } else {
      console.warn(`Default step not found for model: ${value}`)
      // Set a fallback default step if needed
      setSteps(30)
    }
  }

  const handlePromptKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerateImage()
    }
  }

  const handleRemix = (image) => {
    setPrompt(image.prompt)
    setSeed(image.seed)
    setRandomizeSeed(false)
    setWidth(image.width)
    setHeight(image.height)
    setSteps(image.steps)
    setModel(image.model)
    setQuality(image.quality)
    setAspectRatio(image.aspect_ratio)
    setUseAspectRatio(image.aspect_ratio in aspectRatios)
    setActiveTab('input')
  }

  const handleDownload = async (imageUrl, prompt) => {
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error('Network response was not ok')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${prompt.slice(0, 20)}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Image downloaded successfully')
    } catch (error) {
      console.error('Error downloading image:', error)
      toast.error('Failed to download image')
    }
  }

  const handleDiscard = async (image) => {
    try {
      await deleteImageCompletely(image.id)
      queryClient.invalidateQueries(['images', session?.user?.id, activeView])
      toast.success('Image discarded successfully')
    } catch (error) {
      console.error('Error discarding image:', error)
      toast.error('Failed to discard image')
    }
  }

  const handleViewDetails = (image) => {
    setSelectedImage(image)
    setDetailsDialogOpen(true)
  }

  return {
    handleGenerateImage,
    handleImageClick,
    handleFullScreenNavigate,
    handleModelChange,
    handlePromptKeyDown,
    handleRemix,
    handleDownload,
    handleDiscard,
    handleViewDetails,
  }
}