import { useCurrency } from "../../context/CurrencyContext";

/**
 * CurrencyDisplay Component
 * Displays prices with the global currency symbol
 *
 * Usage:
 * <CurrencyDisplay price={99.99} />
 * <CurrencyDisplay price={product.price} />
 */
const CurrencyDisplay = ({ price, className = "" }) => {
  const { currencySymbol, loading } = useCurrency();

  if (loading) return <span className={className}>...</span>;
  if (price === undefined || price === null)
    return <span className={className}>-</span>;

  return (
    <span className={className}>
      {currencySymbol}
      {Number(price).toFixed(2)}
    </span>
  );
};

export default CurrencyDisplay;
