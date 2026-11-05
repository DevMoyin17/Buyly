export const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "NGN", symbol: "₦" },
];

export function convertPrice(amountUSD, currency = "USD", exchangeRates = null) {
  const amount = Number(amountUSD);
  if (!Number.isFinite(amount)) return null;
  if (currency === "USD") return amount;
  if (!exchangeRates) return null;

  const rate = Number(exchangeRates[currency]);
  if (!Number.isFinite(rate) || rate <= 0) return null;
  return amount * rate;
}

export function formatCurrency(amount, currency = "USD", options = {}) {
  if (amount === null || amount === undefined || amount === "") return "—";
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: options.maximumFractionDigits ?? (currency === "NGN" ? 0 : 2),
      minimumFractionDigits: options.minimumFractionDigits ?? 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function formatMoney(amountUSD, currency = "USD", exchangeRates = null, options = {}) {
  return formatCurrency(convertPrice(amountUSD, currency, exchangeRates), currency, options);
}

export function formatCompactNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
}
