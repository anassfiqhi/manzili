import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonFeaturedProducts = () => {
  return (
    <>
      {/* Section heading and description skeleton */}
      <div className="content-container">
        <div className="mb-8 text-center">
          <div className="h-10 w-64 bg-gray-100 animate-pulse mx-auto mb-4"></div>
          <div className="h-6 w-96 bg-gray-100 animate-pulse mx-auto"></div>
        </div>
      </div>
      
      {/* Render skeleton for multiple collections */}
      {Array.from({ length: 2 }).map((_, collectionIndex) => (
        <li key={collectionIndex}>
          <div className="content-container py-12 small:py-24">
            <div className="flex justify-between items-center mb-8">
              {/* Collection title skeleton */}
              <div className="h-8 w-48 bg-gray-100 animate-pulse"></div>
              {/* View all link skeleton */}
              <div className="h-6 w-16 bg-gray-100 animate-pulse"></div>
            </div>
            {/* Product grid skeleton */}
            <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-6 gap-y-8 small:gap-y-8">
              {Array.from({ length: 4 }).map((_, productIndex) => (
                <li key={productIndex}>
                  <SkeletonProductPreview />
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </>
  )
}

export default SkeletonFeaturedProducts