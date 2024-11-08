import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useImageHandlers } from '@/hooks/useImageHandlers';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import FullScreenImageView from '@/components/FullScreenImageView';
import MobileImageDrawer from '@/components/MobileImageDrawer';

const ImagePage = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const { data: image, isLoading } = useQuery({
    queryKey: ['singleImage', imageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('id', imageId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handlers = useImageHandlers({
    session,
    queryClient: null, // We don't need queryClient for these operations
  });

  const isOwner = session?.user?.id === image?.user_id;

  if (isLoading || !image) return null;

  return isMobile ? (
    <MobileImageDrawer
      open={true}
      onOpenChange={() => navigate(-1)}
      image={image}
      onDownload={() => handlers.handleDownload(image)}
      onDiscard={() => handlers.handleDiscard(image)}
      onRemix={() => handlers.handleRemix(image)}
      isOwner={isOwner}
      showFullImage={true}
    />
  ) : (
    <FullScreenImageView
      image={image}
      isOpen={true}
      onClose={() => navigate(-1)}
      onDownload={() => handlers.handleDownload(image)}
      onDiscard={() => handlers.handleDiscard(image)}
      onRemix={() => handlers.handleRemix(image)}
      isOwner={isOwner}
    />
  );
};

export default ImagePage;