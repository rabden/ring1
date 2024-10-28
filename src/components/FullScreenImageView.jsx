import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Download, Trash2, RefreshCw, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const FullScreenImageView = ({ 
  image, 
  isOpen, 
  onClose,
  onDownload,
  onDiscard,
  onRemix,
  onViewDetails,
  isOwner 
}) => {
  if (!isOpen || !image) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 bg-background">
        <div className="flex h-full">
          {/* Left side - Image */}
          <div className="flex-1 relative flex items-center justify-center bg-black/10 dark:bg-black/30">
            <img
              src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
              alt={image.prompt}
              className="max-w-full max-h-[100vh] object-contain"
            />
          </div>

          {/* Right side - Details and Actions */}
          <div className="w-[350px] border-l">
            <ScrollArea className="h-[100vh]">
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Image Details</h3>
                  <p className="text-sm text-muted-foreground">{image.prompt}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Settings</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Model:</div>
                    <div className="text-muted-foreground">{image.model}</div>
                    <div>Quality:</div>
                    <div className="text-muted-foreground">{image.quality}</div>
                    <div>Size:</div>
                    <div className="text-muted-foreground">{image.width}x{image.height}</div>
                    <div>Seed:</div>
                    <div className="text-muted-foreground">{image.seed}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Actions</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      onClick={() => onDownload(supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl, image.prompt)}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    {isOwner && (
                      <Button 
                        onClick={() => onDiscard(image)}
                        className="w-full"
                        variant="destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Discard
                      </Button>
                    )}
                    <Button 
                      onClick={() => onRemix(image)}
                      className="w-full"
                      variant="outline"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Remix
                    </Button>
                    <Button 
                      onClick={() => onViewDetails(image)}
                      className="w-full"
                      variant="outline"
                    >
                      <Info className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
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