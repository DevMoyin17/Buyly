export const createCurrencySlice = (set, get) => ({
  currency: "USD",
  exchangeRates: null,
  ratesError: null,

  setCurrency: (newCurrency) => {
    set({ currency: newCurrency });
    if (newCurrency !== "USD" && !get().exchangeRates) {
      get().fetchExchangeRates();
    }
  },

  convertPrice: (priceUSD) => {
    const { currency, exchangeRates } = get();
    if (currency === "USD") return priceUSD;
    if (!exchangeRates) return null;

    const rate = Number(exchangeRates[currency]);
    if (!Number.isFinite(rate) || rate <= 0) return null;
    return priceUSD * rate;
  },

  fetchExchangeRates: async () => {
    try {
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      if (!response.ok) throw new Error("Exchange rates unavailable");
      const data = await response.json();
      set({ exchangeRates: data.rates, ratesError: null });
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
      set({ ratesError: "Exchange rates are unavailable right now." });
    }
  },
});
