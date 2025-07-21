"use client"

import { Text, clx } from "@medusajs/ui"
import { useState } from "react"

import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import Counter from "@/components/ui/Counter"

type MobileItemProps = {
  item: HttpTypes.StoreCartLineItem
}

const MobileItem = ({ item }: MobileItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { handle } = item.variant?.product ?? {}

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    const message = await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <div className="flex items-start gap-4 p-4 border-b border-gray-200 bg-white">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <LocalizedClientLink href={`/products/${handle}`}>
          <Thumbnail
            thumbnail={item.variant?.product?.thumbnail}
            images={item.variant?.product?.images}
            size="square"
            className="w-24 h-24 rounded-lg object-cover"
          />
        </LocalizedClientLink>
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        {/* Product Name */}
        <Text className="font-bold text-xl text-gray-900 mb-2">
          {item.product_title}
        </Text>

        {/* Unit Price */}
        <Text className="text-gray-600 text-lg mb-3">
          <LineItemUnitPrice item={item} style="tight" />
        </Text>

        {/* Product Description/Variant Options */}
        <div className="mb-4 text-sm text-gray-600">
          <LineItemOptions variant={item.variant} />
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-3 mb-4">
          <Counter
            value={item.quantity}
            min={1}
            max={maxQuantity}
            onChange={(value) => changeQuantity(value)}
          />
          {updating && <Spinner />}
        </div>

        {/* Remove Item Link */}
        <div className="mb-2">
          <DeleteButton id={item.id} className="text-red-600 hover:text-red-800 text-sm underline">
            Remove item
          </DeleteButton>
        </div>

        {/* Error Message */}
        <ErrorMessage error={error} />
      </div>

      {/* Total Price */}
      <div className="flex-shrink-0 text-right">
        <Text className="font-bold text-2xl text-gray-900">
          <LineItemPrice item={item} style="tight" />
        </Text>
      </div>
    </div>
  )
}

export default MobileItem 