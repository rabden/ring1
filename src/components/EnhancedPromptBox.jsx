import React, { useRef, useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { Send, Wand2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const EnhancedPromptBox = ({ 
  value, 
  onChange,
  onSubmit,
  onKeyDown,
  className,
  placeholder = "Imagine...",
  disabled = false
}) => {
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const updateLayout = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    updateLayout();
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
      // Remove the onKeyDown prop call to prevent double submission
      return;
    }
    // Only call onKeyDown for non-Enter key presses
    if (e.key !== 'Enter') {
      onKeyDown?.(e);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  const handleEnhance = () => {
    if (onChange && value.trim()) {
      const enhancedPrompt = `${value.trim()}, 8k, uhd, professional, masterpiece, high-quality, detailed`;
      onChange({ target: { value: enhancedPrompt } });
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-[900px] mx-auto">
        <div 
          className={cn(
            "bg-card border-border",
            "border rounded-lg p-3",
            "min-h-[48px] max-h-[300px]",
            "transition-all duration-200 ease-out",
            "flex flex-col gap-2",
            (isFocused || value) && "min-h-[24px]",
            className
          )}
        >
          <div className="relative w-full">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "w-full bg-transparent border-0 outline-none resize-none p-0 m-0",
                "text-sm leading-relaxed placeholder:text-muted-foreground",
                "scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent"
              )}
              style={{ height: '24px' }}
            />
          </div>
          
          <div 
            className={cn(
              "flex justify-end h-6 transition-all duration-200 gap-2",
              value ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              disabled={!value.trim() || disabled}
              className="h-6 w-6"
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEnhance}
              disabled={!value.trim() || disabled}
              className="h-6 w-6"
            >
              <Wand2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSubmit}
              disabled={!value.trim() || disabled}
              className="h-6 w-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPromptBox;