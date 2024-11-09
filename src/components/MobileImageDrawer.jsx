import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { getCleanPrompt } from '@/utils/promptUtils';
import TruncatablePrompt from './TruncatablePrompt';
import { handleImageDiscard } from '@/utils/discardUtils';
import { useImageRemix } from '@/hooks/useImageRemix';
import ImageDetailsSection from './image-view/ImageDetailsSection';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import HeartAnimation from './animations/HeartAnimation';
import ImageHeader from './image-view/ImageHeader';
import MobileImageActions from './mobile/MobileImageActions';
import { useLikes } from '@/hooks/useLikes';

const MobileImageDrawer = ({ 
  open, 
  onOpenChange, 
  image, 
  onDownload, 
  onDiscard, 
  onRemix, 
  isOwner,
  setActiveTab,
  setStyle,
  showFullImage = false
}) => {
  const { session } = useSupabaseAuth();
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const [copyIcon, setCopyIcon] = useState('copy');
  const [shareIcon, setShareIcon] = useState('share');
  const [isAnimating, setIsAnimating] = useState(false);
  const { handleRemix } = useImageRemix(session, onRemix, setStyle, setActiveTab, () => onOpenChange(false));
  const queryClient = useQueryClient();
  const { userLikes, toggleLike } = useLikes(session?.user?.id);

  const { data: owner } = useQuery({
    queryKey: ['user', image?.user_id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', image.user_id)
        .single();
      return data;
    },
    enabled: !!image?.user_id
  });

  const { data: likeCount = 0 } = useQuery({
    queryKey: ['likes', image?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('user_image_likes')
        .select('*', { count: 'exact' })
        .eq('image_id', image.id);
      return count;
    },
    enabled: !!image?.id
  });

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(getCleanPrompt(image.user_prompt || image.prompt, image.style));
    setCopyIcon('check');
    toast.success('Prompt copied to clipboard');
    setTimeout(() => setCopyIcon('copy'), 1500);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/image/${image.id}`);
    setShareIcon('check');
    toast.success('Share link copied to clipboard');
    setTimeout(() => setShareIcon('share'), 1500);
  };

  const handleDiscard = async () => {
    try {
      await handleImageDiscard(image, queryClient);
      onOpenChange(false);
      if (onDiscard) {
        onDiscard(image.id);
      }
    } catch (error) {
      console.error('Error in handleDiscard:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userLikes?.includes(image.id)) {
      setIsAnimating(true);
      toggleLike(image.id);
      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    }
  };

  const detailItems = [
    { label: 'Model', value: modelConfigs?.[image.model]?.name || image.model },
    { label: 'Style', value: styleConfigs?.[image.style]?.name || 'General' },
    { label: 'Size', value: `${image.width}x${image.height}` },
    { label: 'Quality', value: image.quality },
    { label: 'Seed', value: image.seed },
    { label: 'Aspect Ratio', value: image.aspect_ratio }
  ];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[100vh] bg-background">
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mt-4 mb-2" />
        <ScrollArea className="h-[calc(96vh-32px)] px-4">
          {showFullImage && (
            <div className="relative rounded-lg overflow-hidden mb-6">
              <img
                src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                alt={image.prompt}
                className="w-full h-auto"
                onDoubleClick={handleDoubleClick}
              />
              <HeartAnimation isAnimating={isAnimating} />
            </div>
          )}

          <ImageHeader 
            owner={owner}
            image={image}
            isOwner={isOwner}
            userLikes={userLikes}
            toggleLike={toggleLike}
            likeCount={likeCount}
          />

          <MobileImageActions 
            session={session}
            onDownload={onDownload}
            isOwner={isOwner}
            onDiscard={handleDiscard}
            onRemix={() => handleRemix(image)}
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Prompt</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
                  {copyIcon === 'copy' ? <Copy className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  {shareIcon === 'share' ? <Share2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <TruncatablePrompt prompt={getCleanPrompt(image.user_prompt || image.prompt, image.style)} />
          </div>

          <div className="mt-4">
            <ImageDetailsSection detailItems={detailItems} />
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileImageDrawer;
