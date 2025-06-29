import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionsList } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@medusajs/ui"

export const dynamic = 'force-dynamic'

type Props = {
  params: { countryCode: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Collections | Manzili Store",
    description: "Browse all product collections available in our store.",
    alternates: {
      canonical: "/collections",
    },
  }
}

export default async function CollectionsPage({ params }: Props) {
  const { collections } = await getCollectionsList()

  if (!collections) {
    notFound()
  }

  return (
    <div className="flex flex-col py-6 content-container">
      <div className="mb-8">
        <h1 className="text-2xl-semi mb-2" data-testid="collections-page-title">
          All Collections
        </h1>
        <p className="text-base-regular text-ui-fg-subtle">
          Discover our curated collections of products
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="border border-ui-border-base rounded-lg p-6 hover:border-ui-border-interactive transition-colors"
            data-testid="collection-card"
          >
            <div className="mb-4">
              <h2 className="text-lg-semi mb-2">{collection.title}</h2>
            </div>

            <LocalizedClientLink
              href={`/collections/${collection.handle}`}
              className="text-small-regular text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-colors"
              data-testid="collection-link"
            >
              View Collection →
            </LocalizedClientLink>
          </div>
        ))}
      </div>

      {collections.length === 0 && (
        <div className="text-center py-12">
          <Text className="text-large-regular text-ui-fg-subtle">
            No collections available at the moment.
          </Text>
        </div>
      )}
    </div>
  )
} 