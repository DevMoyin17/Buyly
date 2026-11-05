import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const CurrencySelector = ({ className = "" }) => {
  const currency = useStore((state) => state.currency);
  const setCurrency = useStore((state) => state.setCurrency);

  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger
        className={cn("h-9 w-[92px] border-brand-line bg-white/70 text-[11px]", className)}
        aria-label="Choose currency"
      >
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent align="end">
        {CURRENCIES.map((item) => (
          <SelectItem key={item.code} value={item.code}>
            <span className="mr-2 text-brand-tangerine">{item.symbol}</span>
            {item.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
