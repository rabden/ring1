import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const SkeletonImageCard = ({ width, height }) => {
  const aspectRatio = (height / width) * 100

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative" style={{ paddingTop: `${aspectRatio}%`, width: `${width}px`, maxWidth: '100%' }}>
        <Skeleton className="absolute inset-0 w-full h-full" />
      </CardContent>
      <div className="mt-2 flex items-center justify-between">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </Card>
  )
}

export default SkeletonImageCard