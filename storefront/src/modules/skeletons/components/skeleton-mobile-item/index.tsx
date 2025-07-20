const SkeletonMobileItem = () => {
  return (
    <div className="flex items-start gap-4 p-4 border-b border-gray-200 bg-white">
      {/* Product Image Skeleton */}
      <div className="flex-shrink-0">
        <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-lg" />
      </div>

      {/* Product Details Skeleton */}
      <div className="flex-1 min-w-0">
        {/* Product Name Skeleton */}
        <div className="w-48 h-6 bg-gray-200 animate-pulse mb-2" />
        
        {/* Unit Price Skeleton */}
        <div className="w-20 h-5 bg-gray-200 animate-pulse mb-3" />
        
        {/* Product Description Skeleton */}
        <div className="w-64 h-4 bg-gray-200 animate-pulse mb-4" />
        
        {/* Quantity Selector Skeleton */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-full" />
        </div>
        
        {/* Remove Item Link Skeleton */}
        <div className="w-24 h-4 bg-gray-200 animate-pulse mb-2" />
      </div>

      {/* Total Price Skeleton */}
      <div className="flex-shrink-0 text-right">
        <div className="w-20 h-7 bg-gray-200 animate-pulse" />
      </div>
    </div>
  )
}

export default SkeletonMobileItem 