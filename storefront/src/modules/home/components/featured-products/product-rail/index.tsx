import { HttpTypes } from "@medusajs/types"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const { products } = collection

  if (!products) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl mb-2 font-maven uppercase">{collection.title}</h1>
        <InteractiveLink className="h-fit" href={`/collections/${collection.handle}`}>
          Voir tout
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-6 gap-y-8 small:gap-y-8">
        {products &&
          products.map((product) => (
            <li key={product.id}>
              {/* @ts-ignore */}
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
