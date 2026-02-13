import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Title & Subtitle Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Actions Skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Tab Bar Skeleton */}
      <div className="border-b border-gray-200 pb-3">
        <div className="flex space-x-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      {/* Content Card Skeleton */}
      <div className="border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Steps Skeletons */}
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="space-y-3">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            {step > 2 && (
              <>
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
