import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"
import { formatCurrency } from "@lib/util/format-currency"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && (
        <Text
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          {formatCurrency(price.original_price_number, price.currency_code)}
        </Text>
      )}
      <Text
        className={clx("text-ui-fg-muted", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {formatCurrency(price.calculated_price_number, price.currency_code)}
      </Text>
    </>
  )
}
