import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import Masonry from 'react-masonry-css'
import SkeletonImageCard from './SkeletonImageCard'
import MobileImageDrawer from './MobileImageDrawer'
import ImageCard from './ImageCard'
import { useLikes } from '@/hooks/useLikes'
import { useImageLoadManager } from '@/hooks/useImageLoadManager'
import { useModelConfigs } from '@/hooks/useModelConfigs'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
}

const ImageGallery = ({ 
  userId, 
  onImageClick, 
  onDownload, 
  onDiscard, 
  onRemix, 
  onViewDetails, 
  activeView, 
  generatingImages = [], 
  nsfwEnabled 
}) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showImageInDrawer, setShowImageInDrawer] = useState(false)
  const { userLikes, toggleLike } = useLikes(userId)
  const { data: modelConfigs } = useModelConfigs()
  const { handleImageLoad: handleImageLoadInternal } = useImageLoadManager(5) // 5MB limit
  const [unloadedImages, setUnloadedImages] = useState(new Set())

  const { data: images, isLoading } = useQuery({
    queryKey: ['images', userId, activeView, nsfwEnabled],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const filteredData = data.filter(img => {
        const isNsfw = modelConfigs?.[img.model]?.category === "NSFW";
        
        if (activeView === 'myImages') {
          if (nsfwEnabled) {
            return img.user_id === userId && isNsfw;
          } else {
            return img.user_id === userId && !isNsfw;
          }
        } else if (activeView === 'inspiration') {
          if (nsfwEnabled) {
            return img.user_id !== userId && isNsfw;
          } else {
            return img.user_id !== userId && !isNsfw;
          }
        }
        return false;
      });

      return filteredData;
    },
    enabled: !!userId && !!modelConfigs,
  })

  const handleImageLoadAndUnload = async (imageId, size) => {
    const imagesToUnload = await handleImageLoadInternal(imageId, size)
    setUnloadedImages(new Set(imagesToUnload))
  }

  const handleImageClick = (image) => {
    if (window.innerWidth <= 768) {
      setSelectedImage(image)
      setShowImageInDrawer(true)
      setDrawerOpen(true)
    } else {
      onImageClick(image)
    }
  }

  const handleMoreClick = (image, e) => {
    e.stopPropagation()
    if (window.innerWidth <= 768) {
      setSelectedImage(image)
      setShowImageInDrawer(false)
      setDrawerOpen(true)
    }
  }

  const renderContent = () => {
    const content = []

    if (activeView === 'myImages' && generatingImages && generatingImages.length > 0) {
      content.push(...generatingImages.map((img) => (
        <SkeletonImageCard key={img.id} width={img.width} height={img.height} />
      )))
    }

    if (isLoading) {
      content.push(...Array.from({ length: 8 }).map((_, index) => (
        <SkeletonImageCard key={`loading-${index}`} width={512} height={512} />
      )))
    } else if (images && images.length > 0) {
      content.push(...images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onImageClick={() => handleImageClick(image)}
          onMoreClick={handleMoreClick}
          onDownload={onDownload}
          onDiscard={onDiscard}
          onRemix={onRemix}
          onViewDetails={onViewDetails}
          userId={userId}
          isMobile={window.innerWidth <= 768}
          isLiked={userLikes.includes(image.id)}
          onToggleLike={toggleLike}
          onImageLoad={handleImageLoadAndUnload}
          isUnloaded={unloadedImages.has(image.id)}
          setIsUnloaded={(value) => {
            if (!value) {
              setUnloadedImages(prev => {
                const newSet = new Set(prev)
                newSet.delete(image.id)
                return newSet
              })
            }
          }}
        />
      )))
    }

    return content
  }

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto md:px-2 -mx-1 md:mx-0"
        columnClassName="bg-clip-padding px-1 md:px-2"
      >
        {renderContent()}
      </Masonry>

      <MobileImageDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        image={selectedImage}
        showImage={showImageInDrawer}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        isOwner={selectedImage?.user_id === userId}
      />
    </>
  )
}

export default ImageGallery