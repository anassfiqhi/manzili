import React from "react"

export const formatCurrency = (amount: number, currency: string): React.ReactElement => {
  // Round to 2 decimal places like convertToLocale
  const roundedAmount = Math.round(amount * 100) / 100
  
  // Format to always show 2 decimal places
  const formattedAmount = roundedAmount.toFixed(2)
  
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

  return React.createElement(React.Fragment, null, 
    React.createElement('span', null, formattedAmount),
    React.createElement('span', null, '\u00A0'),
    React.createElement('span', null, displayCurrency)
  );
} 