import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Trash2, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { styleConfigs } from '@/utils/styleConfigs';
import { toast } from 'sonner';

const FullScreenImageView = ({ image, isOpen, onClose, onDownload, onDiscard, onRemix, isOwner = false }) => {
  if (!isOpen || !image) {
    return null;
  }

  const detailItems = [
    { label: "Model", value: image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio },
    { label: "Style", value: styleConfigs[image.style]?.name || 'General' },
    { label: "Quality", value: image.quality },
  ];

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    toast.success('Prompt copied to clipboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-background">
        <div className="flex h-full">
          {/* Left side - Image */}
          <div className="flex-1 relative">
            <img
              src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
              alt={image.prompt}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Right side - Details Card */}
          <div className="w-[350px] border-l bg-card">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => onDownload(supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl, image.prompt)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => onRemix(image)}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Remix
                  </Button>
                  {isOwner && (
                    <Button
                      variant="destructive"
                      className="w-full col-span-2"
                      onClick={() => onDiscard(image)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Discard
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Prompt</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={handleCopyPrompt}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg">
                      {image.prompt}
                    </p>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="grid grid-cols-2 gap-4">
                    {detailItems.map((item, index) => (
                      <div key={index} className="space-y-1.5">
                        <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                        <Badge variant="secondary" className="text-sm font-normal">
                          {item.value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImageView;