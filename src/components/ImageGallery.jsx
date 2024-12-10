import React, { useRef, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import SkeletonImageCard from './SkeletonImageCard';
import ImageCard from './ImageCard';
import { useLikes } from '@/hooks/useLikes';
import NoResults from './NoResults';
import { useGalleryImages } from '@/hooks/useGalleryImages';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday, isThisWeek, isThisMonth, parseISO, subWeeks, isAfter } from 'date-fns';

const getBreakpointColumns = () => ({
  default: 5,
  1600: 5,
  1200: 4,
  700: 2,
  500: 2
});

const groupImagesByDate = (images) => {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    lastWeek: [],
    thisMonth: [],
    lastMonth: [],
    earlier: []
  };

  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const twoWeeksAgo = subWeeks(now, 2);

  images?.forEach(image => {
    const date = parseISO(image.created_at);
    if (isToday(date)) {
      groups.today.push(image);
    } else if (isYesterday(date)) {
      groups.yesterday.push(image);
    } else if (isThisWeek(date)) {
      groups.thisWeek.push(image);
    } else if (isAfter(date, twoWeeksAgo) && !isAfter(date, oneWeekAgo)) {
      groups.lastWeek.push(image);
    } else if (isThisMonth(date)) {
      groups.thisMonth.push(image);
    } else if (isAfter(date, subWeeks(now, 6))) {
      groups.lastMonth.push(image);
    } else {
      groups.earlier.push(image);
    }
  });

  return groups;
};

const DateHeader = ({ children }) => (
  <div className="flex items-center gap-3 px-2 mb-6">
    <h2 className="text-sm font-medium text-muted-foreground">{children}</h2>
    <div className="h-px flex-grow bg-border/30" />
  </div>
);

const ImageGallery = ({ 
  userId, 
  onImageClick, 
  onDownload, 
  onDiscard, 
  onRemix, 
  onViewDetails, 
  activeView, 
  generatingImages = [], 
  nsfwEnabled,
  activeFilters = {},
  searchQuery = '',
  setActiveTab,
  showPrivate,
  profileUserId,
  className,
  setStyle,
  style,
  showFollowing,
  showTop,
  following
}) => {
  const { userLikes, toggleLike } = useLikes(userId);
  const isMobile = window.innerWidth <= 768;
  const breakpointColumnsObj = getBreakpointColumns();
  
  const { 
    images, 
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage 
  } = useGalleryImages({
    userId: profileUserId || userId,
    activeView,
    nsfwEnabled,
    showPrivate,
    activeFilters,
    searchQuery,
    showFollowing,
    showTop,
    following
  });

  const observer = useRef();
  const lastImageRef = useCallback(node => {
    if (isLoading || isFetchingNextPage) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleMobileMoreClick = (image) => {
    if (isMobile) {
      onViewDetails(image);
    }
  };

  if (isLoading && !images.length) {
    return (
      <div className={cn("w-full h-full md:px-0 md:pt-0 pt-12", className)}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto md:px-2 -mx-1 md:mx-0"
          columnClassName="bg-clip-padding px-1 md:px-2"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonImageCard key={`loading-${index}`} width={512} height={512} />
          ))}
        </Masonry>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return <NoResults />;
  }

  // Filter images based on privacy setting
  const filteredImages = images.filter(img => {
    if (activeView === 'myImages') {
      return showPrivate ? img.is_private : !img.is_private;
    }
    return !img.is_private;
  });

  // Use date grouping for My Images view
  if (activeView === 'myImages' && !profileUserId) {
    const groupedImages = groupImagesByDate(filteredImages);
    const nonEmptyGroups = Object.entries(groupedImages)
      .filter(([_, images]) => images.length > 0);

    return (
      <div className={cn("w-full h-full md:px-0 md:pt-0 pt-12 space-y-12", className)}>
        {nonEmptyGroups.map(([groupName, groupImages], groupIndex) => (
          <div key={groupName}>
            <DateHeader>
              {groupName === 'today' && 'Today'}
              {groupName === 'yesterday' && 'Yesterday'}
              {groupName === 'thisWeek' && 'This Week'}
              {groupName === 'lastWeek' && 'Last Week'}
              {groupName === 'thisMonth' && 'This Month'}
              {groupName === 'lastMonth' && 'Last Month'}
              {groupName === 'earlier' && 'Earlier'}
            </DateHeader>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-auto md:px-2 -mx-1 md:mx-0"
              columnClassName="bg-clip-padding px-1 md:px-2 space-y-6"
            >
              {groupImages.map((image, index) => (
                <div
                  key={image.id}
                  ref={groupIndex === nonEmptyGroups.length - 1 && index === groupImages.length - 1 ? lastImageRef : null}
                  className="mb-6"
                >
                  <ImageCard
                    image={image}
                    onImageClick={() => onImageClick(image)}
                    onDownload={onDownload}
                    onDiscard={onDiscard}
                    onRemix={onRemix}
                    onViewDetails={onViewDetails}
                    onMoreClick={handleMobileMoreClick}
                    userId={userId}
                    isMobile={isMobile}
                    isLiked={userLikes.includes(image.id)}
                    onToggleLike={toggleLike}
                    setActiveTab={setActiveTab}
                    setStyle={setStyle}
                    style={style}
                  />
                </div>
              ))}
            </Masonry>
          </div>
        ))}
        {isFetchingNextPage && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    );
  }

  // Regular masonry grid for other views
  return (
    <div className={cn("w-full h-full md:px-0 md:pt-0 pt-12", className)}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto md:px-2 -mx-1 md:mx-0"
        columnClassName="bg-clip-padding px-1 md:px-2"
      >
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            ref={index === filteredImages.length - 1 ? lastImageRef : null}
          >
            <ImageCard
              image={image}
              onImageClick={() => onImageClick(image)}
              onDownload={onDownload}
              onDiscard={onDiscard}
              onRemix={onRemix}
              onViewDetails={onViewDetails}
              onMoreClick={handleMobileMoreClick}
              userId={userId}
              isMobile={isMobile}
              isLiked={userLikes.includes(image.id)}
              onToggleLike={toggleLike}
              setActiveTab={setActiveTab}
              setStyle={setStyle}
              style={style}
            />
          </div>
        ))}
      </Masonry>
      {isFetchingNextPage && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;