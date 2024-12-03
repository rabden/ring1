import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useFollows } from '@/hooks/useFollows';

const ITEMS_PER_PAGE = 20;
const NSFW_MODELS = ['nsfwMaster', 'animeNsfw'];

export const useGalleryImages = ({
  userId,
  activeView,
  nsfwEnabled,
  showPrivate,
  activeFilters = {},
  searchQuery = ''
}) => {
  const { following } = useFollows(userId);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['galleryImages', userId, activeView, nsfwEnabled, showPrivate, activeFilters, searchQuery, following],
    queryFn: async ({ pageParam = { page: 0 } }) => {
      if (!userId) return { data: [], nextPage: null };

      let baseQuery = supabase
        .from('user_images')
        .select('*', { count: 'exact' });

      // Handle MyImages view
      if (activeView === 'myImages') {
        // Filter by user's images
        baseQuery = baseQuery.eq('user_id', userId);
        
        // Filter by privacy setting
        baseQuery = baseQuery.eq('is_private', showPrivate);

        // Apply NSFW filter
        if (nsfwEnabled) {
          baseQuery = baseQuery.in('model', NSFW_MODELS);
        } else {
          baseQuery = baseQuery.not('model', 'in', '(' + NSFW_MODELS.join(',') + ')');
        }

        // Apply style and model filters
        if (activeFilters.style) {
          baseQuery = baseQuery.eq('style', activeFilters.style);
        }
        if (activeFilters.model) {
          baseQuery = baseQuery.eq('model', activeFilters.model);
        }

        // Apply search filter
        if (searchQuery) {
          baseQuery = baseQuery.ilike('prompt', `%${searchQuery}%`);
        }

        // Apply pagination
        const start = pageParam.page * ITEMS_PER_PAGE;
        const { data: result, error, count } = await baseQuery
          .order('created_at', { ascending: false })
          .range(start, start + ITEMS_PER_PAGE - 1);

        if (error) throw error;

        return {
          data: result?.map(image => ({
            ...image,
            image_url: supabase.storage
              .from('user-images')
              .getPublicUrl(image.storage_path).data.publicUrl
          })) || [],
          nextPage: (result?.length === ITEMS_PER_PAGE && count > start + ITEMS_PER_PAGE) 
            ? { page: pageParam.page + 1 } 
            : undefined
        };
      }

      // Handle Inspiration view
      if (activeView === 'inspiration') {
        baseQuery = baseQuery
          .neq('user_id', userId)
          .eq('is_private', false);

        if (nsfwEnabled) {
          baseQuery = baseQuery.in('model', NSFW_MODELS);
        } else {
          baseQuery = baseQuery.not('model', 'in', '(' + NSFW_MODELS.join(',') + ')');
        }

        const { data: allImages, error } = await baseQuery;
        
        if (error) throw error;
        if (!allImages) return { data: [], nextPage: null };

        // Sort images based on priority
        const sortByDate = (a, b) => new Date(b.created_at) - new Date(a.created_at);

        // 1. Hot AND Trending images (newest first)
        const hotAndTrending = allImages
          .filter(img => img.is_hot && img.is_trending)
          .sort(sortByDate);

        // 2. Hot images (newest first)
        const hotOnly = allImages
          .filter(img => img.is_hot && !img.is_trending)
          .sort(sortByDate);

        // 3. Trending images (newest first)
        const trendingOnly = allImages
          .filter(img => !img.is_hot && img.is_trending)
          .sort(sortByDate);

        // 4. Images from followed users (newest first)
        const followedUsersImages = allImages
          .filter(img => 
            following?.includes(img.user_id) && 
            !img.is_hot && 
            !img.is_trending
          )
          .sort(sortByDate);

        // 5. Other images (newest first)
        const otherImages = allImages
          .filter(img => 
            !img.is_hot && 
            !img.is_trending && 
            !following?.includes(img.user_id)
          )
          .sort(sortByDate);

        // Combine all sorted arrays
        const sortedImages = [
          ...hotAndTrending,
          ...hotOnly,
          ...trendingOnly,
          ...followedUsersImages,
          ...otherImages
        ];

        // Apply pagination to sorted results
        const start = pageParam.page * ITEMS_PER_PAGE;
        const paginatedImages = sortedImages.slice(start, start + ITEMS_PER_PAGE);

        return {
          data: paginatedImages.map(image => ({
            ...image,
            image_url: supabase.storage
              .from('user-images')
              .getPublicUrl(image.storage_path).data.publicUrl
          })),
          nextPage: paginatedImages.length === ITEMS_PER_PAGE ? { page: pageParam.page + 1 } : undefined
        };
      }

      return { data: [], nextPage: null };
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    initialPageParam: { page: 0 }
  });

  const images = data?.pages?.flatMap(page => page.data) || [];

  return { 
    images, 
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};