export const createCurrencySlice = (set, get) => ({
    currency: "USD",
    exchangeRates: null,
    setCurrency: (newCurrency) => set({ currency: newCurrency }),
    
    convertPrice: (priceUSD) => {
      const { currency, exchangeRates } = get();
      if (!exchangeRates || currency === "USD") return priceUSD;
      return priceUSD * exchangeRates[currency];
    },
    
    fetchExchangeRates: async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/USD`
        );
        const data = await response.json();
        set({ exchangeRates: data.rates });
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      }
    },
  });