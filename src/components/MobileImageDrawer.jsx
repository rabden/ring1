import React from 'react';
import { Drawer } from 'vaul';
import { Button } from "@/components/ui/button";
import { Download, Trash2, Wand2, Copy } from "lucide-react";
import { supabase } from '@/integrations/supabase/supabase';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { styleConfigs } from '@/utils/styleConfigs';
import { modelConfigs } from '@/utils/modelConfigs';
import { toast } from 'sonner';

const MobileImageDrawer = ({ open, onOpenChange, image, showImage, onDownload, onDiscard, onRemix, isOwner }) => {
  if (!image) return null;

  const detailItems = [
    { label: "Model", value: modelConfigs[image.model]?.name || image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio },
    { label: "Style", value: styleConfigs[image.style]?.name || 'General' },
    { label: "Quality", value: image.quality },
  ];

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
      toast.success('Prompt copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy prompt');
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <Drawer.Content className="fixed inset-0 z-[60] bg-background">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 mb-8" />
              <div className="max-w-md mx-auto space-y-4">
                {showImage && (
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={supabase.storage.from('user-images').getPublicUrl(image?.storage_path).data.publicUrl}
                      alt={image?.prompt}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onDownload(supabase.storage.from('user-images').getPublicUrl(image?.storage_path).data.publicUrl, image?.prompt)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  
                  {isOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-destructive"
                      onClick={() => {
                        onDiscard(image);
                        onOpenChange(false);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Discard
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      onRemix(image);
                      onOpenChange(false);
                    }}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Remix
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Prompt</h3>
                      <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground bg-muted/40 p-3 rounded-md">
                      {image.prompt}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {detailItems.map((item, index) => (
                      <div key={index} className="space-y-1.5">
                        <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                        <Badge variant="outline" className="text-xs font-normal w-full justify-center">
                          {item.value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MobileImageDrawer;