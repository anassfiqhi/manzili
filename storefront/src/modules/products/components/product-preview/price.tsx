import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  const formatPrice = (amount: number, currency: string) => {
    // Transform currency codes to display characters
    let displayCurrency = currency;
    if (currency) {
      const currencyCode = currency.toUpperCase();
      switch (currencyCode) {
        case 'MAD':
          displayCurrency = 'DH';
          break;
        case 'USD':
          displayCurrency = '$';
          break;
        case 'EUR':
          displayCurrency = '€';
          break;
        case 'GBP':
          displayCurrency = '£';
          break;
        case 'JPY':
          displayCurrency = '¥';
          break;
        case 'CAD':
          displayCurrency = 'C$';
          break;
        case 'AUD':
          displayCurrency = 'A$';
          break;
        default:
          displayCurrency = currency;
      }
    }

    return <><span>{amount}</span>&nbsp;<span>{displayCurrency}</span></>;
  };

  return (
    <>
      {price.price_type === "sale" && (
        <Text
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          {formatPrice(price.original_price_number, price.currency_code)}
        </Text>
      )}
      <Text
        className={clx("text-ui-fg-muted", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {formatPrice(price.calculated_price_number, price.currency_code)}
      </Text>
    </>
  )
}
