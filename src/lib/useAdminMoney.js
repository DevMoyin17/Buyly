import { useCallback } from "react";
import { useStore } from "@/lib/store";
import { formatAdminMoney } from "@/lib/adminMetrics";

export const useAdminMoney = () => {
  const currency = useStore((state) => state.currency);
  const exchangeRates = useStore((state) => state.exchangeRates);

  return useCallback(
    (valueUSD, decimals = 0) =>
      formatAdminMoney(valueUSD, currency, exchangeRates, decimals),
    [currency, exchangeRates],
  );
};
