import React, { useEffect, useRef, useState } from 'react'
import { Lock, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

const DimensionVisualizer = ({ ratio = "1:1", isPremium, quality, onQualityToggle }) => {
  const [width, height] = (ratio || "1:1").split(':').map(Number)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const baseHeight = isMobile ? 300 : 250 // Responsive base height
  
  // Calculate dimensions
  let finalWidth, finalHeight;
  const aspectRatio = width / height;
  
  if (width === height) {
    // 1:1 ratio - full width and height equal
    finalWidth = baseHeight
    finalHeight = baseHeight
  } else if (width > height) {
    // Landscape - keep width at base height, decrease height proportionally
    finalWidth = baseHeight
    finalHeight = baseHeight * (height / width)
  } else {
    // Portrait - keep height at base height, decrease width proportionally
    finalHeight = baseHeight
    finalWidth = baseHeight * (width / height)
  }
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-full h-auto aspect-square">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative">
            {/* Quality Badge */}
            <span 
              role="button"
              tabIndex={0}
              onClick={onQualityToggle}
              onKeyDown={(e) => e.key === 'Enter' && onQualityToggle()}
              className="absolute left-1/2 top-0 -translate-x-1/2 translate-y-1/2 cursor-pointer z-10"
            >
              <span 
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                  "border-transparent bg-primary text-primary-foreground",
                  "hover:bg-primary/90 shadow-sm",
                  "flex items-center gap-0.2 px-1 py-0.2"
                )}
              >
                {quality}
                {quality === "HD" ? <ChevronUp className="h-2.5 w-2.5" /> : <ChevronDown className="h-2.5 w-2.5" />}
              </span>
            </span>

            <div 
              className={cn(
                "relative overflow-hidden",
                "border-2 border-border/80",
                "bg-accent/10",
                "rounded-lg",
                "flex items-center justify-center",
                "transition-all duration-200 ease-in-out",
                "mt-4",
                isPremium && "ring-2 ring-primary/40 border-primary/40"
              )}
              style={{
                width: `${finalWidth}px`,
                height: `${finalHeight}px`,
              }}
            >
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                {[...Array(9)].map((_, i) => (
                  <div 
                    key={i} 
                    className="border border-border/40 hover:border-border/60 transition-colors duration-200"
                  />
                ))}
              </div>
              
              {/* Center lines */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[2px] bg-border/40" />
                <div className="absolute h-full w-[2px] bg-border/40" />
              </div>

              {/* Helper lines */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/3 w-[2px] h-2 border-border/40" />
                <div className="absolute top-0 right-1/3 w-[2px] h-2 border-border/40" />
                <div className="absolute bottom-0 left-1/3 w-[2px] h-2 border-border/40" />
                <div className="absolute bottom-0 right-1/3 w-[2px] h-2 border-border/40" />
                <div className="absolute left-0 top-1/3 h-[2px] w-2 border-border/40" />
                <div className="absolute left-0 bottom-1/3 h-[2px] w-2 border-border/40" />
                <div className="absolute right-0 top-1/3 h-[2px] w-2 border-border/40" />
                <div className="absolute right-0 bottom-1/3 h-[2px] w-2 border-border/40" />
              </div>

              {/* Aspect ratio text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={cn(
                  "flex items-center gap-2 px-2 py-1 rounded-lg",
                  "bg-background/50 backdrop-blur-sm"
                )}>
                  <span className="text-sm font-medium">
                    {ratio}
                  </span>
                  {isPremium && (
                    <Lock className="h-3.5 w-3.5 text-primary opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CustomSlider = ({ value, onChange, min, max }) => {
  const sliderRef = useRef(null);
  const progressRef = useRef(null);

  const updateSliderProgress = (value) => {
    if (!sliderRef.current || !progressRef.current) return;
    
    // Calculate the percentage from center
    const range = max - min;
    const center = (max + min) / 2;
    
    const progress = progressRef.current;
    if (value < center) {
      // Left side of center
      const percentage = ((value - min) / (center - min)) * 50;
      progress.style.left = `${percentage}%`;
      progress.style.right = '50%';
    } else {
      // Right side of center
      const percentage = ((value - center) / (max - center)) * 50;
      progress.style.left = '50%';
      progress.style.right = `${50 - percentage}%`;
    }
  };

  useEffect(() => {
    updateSliderProgress(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
    updateSliderProgress(newValue);
  };

  return (
    <div className="relative w-full h-8 flex items-center">
      <div className="absolute w-full h-2 bg-muted rounded-full">
        <div 
          ref={progressRef}
          className="absolute h-full bg-primary rounded-full transition-all duration-150"
          style={{ left: '50%', right: '50%' }}
        />
      </div>
      <input
        ref={sliderRef}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className={cn(
          "absolute w-full h-2",
          "appearance-none bg-transparent cursor-pointer",
          // Thumb styles
          "[&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
          "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary",
          "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background",
          "[&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-all",
          "[&::-webkit-slider-thumb]:hover:bg-primary/90",
          // Firefox thumb styles
          "[&::-moz-range-thumb]:appearance-none",
          "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4",
          "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary",
          "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background",
          "[&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:transition-all",
          "[&::-moz-range-thumb]:hover:bg-primary/90"
        )}
      />
    </div>
  );
};

const DimensionChooser = ({ 
  aspectRatio = "1:1", 
  setAspectRatio, 
  quality = "HD",
  setQuality,
  proMode 
}) => {
  const premiumRatios = ['9:21', '21:9', '3:2', '2:3', '4:5', '5:4', '10:16', '16:10'];
  
  // Reorder ratios from most extreme portrait to most extreme landscape
  const ratios = [
    "9:21",  // Most extreme portrait
    "1:2",
    "9:16",
    "2:3",
    "3:4",
    "4:5",
    "1:1",   // Center - largest state
    "5:4",
    "4:3",
    "3:2",
    "16:9",
    "2:1",
    "21:9"   // Most extreme landscape
  ].filter(ratio => proMode || !premiumRatios.includes(ratio));

  useEffect(() => {
    if (!proMode && premiumRatios.includes(aspectRatio)) {
      setAspectRatio("1:1");
    }
  }, [aspectRatio, proMode, setAspectRatio]);

  const handleQualityToggle = () => {
    setQuality(quality === "HD" ? "HD+" : "HD");
  };

  const handleSliderChange = (value) => {
    const centerIndex = ratios.indexOf("1:1");
    
    if (Math.abs(value) < 1) {
      setAspectRatio("1:1");
      return;
    }
    
    let index;
    if (value < 0) {
      // Portrait side - decrease width
      const beforeCenterSteps = centerIndex;
      const normalizedValue = ((value + 50) / 50) * beforeCenterSteps;
      index = Math.round(normalizedValue);
    } else {
      // Landscape side - decrease height
      const afterCenterSteps = ratios.length - 1 - centerIndex;
      const normalizedValue = (value / 50) * afterCenterSteps;
      index = centerIndex + Math.round(normalizedValue);
    }
    
    setAspectRatio(ratios[Math.max(0, Math.min(ratios.length - 1, index))] || "1:1");
  }

  const getCurrentRatioIndex = () => {
    const centerIndex = ratios.indexOf("1:1");
    const currentIndex = ratios.indexOf(aspectRatio);
    
    if (currentIndex === centerIndex || !ratios.includes(aspectRatio)) return 0;
    
    if (currentIndex < centerIndex) {
      // Portrait side - calculate position based on width reduction
      const percentage = currentIndex / centerIndex;
      return -50 * (1 - percentage);
    } else {
      // Landscape side - calculate position based on height reduction
      const stepsAfterCenter = currentIndex - centerIndex;
      const totalStepsAfterCenter = ratios.length - 1 - centerIndex;
      return (stepsAfterCenter / totalStepsAfterCenter) * 50;
    }
  }

  return (
    <div className="space-y-1">
      <DimensionVisualizer 
        ratio={aspectRatio} 
        isPremium={!proMode && premiumRatios.includes(aspectRatio)}
        quality={quality}
        onQualityToggle={handleQualityToggle}
      />
      <div className="relative">
        <CustomSlider
          value={getCurrentRatioIndex()}
          onChange={handleSliderChange}
          min={-50}
          max={50}
        />
      </div>
    </div>
  )
}

export default DimensionChooser 