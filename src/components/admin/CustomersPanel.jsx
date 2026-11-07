import { useMemo } from "react";
import { Users } from "lucide-react";
import {
  formatAdminDate,
  getCustomers,
} from "@/lib/adminMetrics";
import { useAdminMoney } from "@/lib/useAdminMoney";

const CustomersPanel = ({ orders = [] }) => {
  const money = useAdminMoney();
  const customers = useMemo(() => getCustomers(orders), [orders]);
  const returning = customers.filter((customer) => customer.orders > 1).length;
  const totalSpent = customers.reduce((total, customer) => total + customer.spent, 0);
  const averageSpend = customers.length ? totalSpent / customers.length : 0;

  const summary = [
    { label: "Total customers", value: customers.length },
    { label: "Returning", value: returning },
    { label: "Average spend", value: money(averageSpend, 2) },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {summary.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-brand-line/70 bg-white p-5 shadow-sm"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-muted">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-brand-line/70 bg-white shadow-sm">
        <div className="border-b border-brand-line/70 px-5 py-4">
          <h2 className="text-sm font-extrabold">Customer list</h2>
          <p className="mt-0.5 text-[10px] text-brand-muted">
            Built from paid orders placed with Glowora.
          </p>
        </div>

        {customers.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[11px]">
              <thead>
                <tr className="border-b border-brand-line/70 bg-brand-cream/40 text-[9px] uppercase tracking-[0.12em] text-brand-muted">
                  <th className="px-5 py-3 font-bold">Customer</th>
                  <th className="px-3 py-3 font-bold">Orders</th>
                  <th className="px-3 py-3 font-bold">Total spent</th>
                  <th className="px-5 py-3 font-bold">Last order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line/60">
                {customers.map((customer) => (
                  <tr key={customer.email} className="transition hover:bg-brand-cream/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-blush text-[10px] font-extrabold text-brand-rose-deep">
                          {customer.email.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="max-w-[240px] truncate font-semibold">
                          {customer.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-brand-muted">{customer.orders}</td>
                    <td className="whitespace-nowrap px-3 py-3.5 font-extrabold">
                      {money(customer.spent, 2)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-brand-muted">
                      {formatAdminDate(customer.lastOrder)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-blush text-brand-rose-deep">
              <Users className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm font-extrabold">No customers yet</p>
            <p className="mt-1 max-w-xs text-[11px] leading-5 text-brand-muted">
              Customers appear as soon as they complete a paid order.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomersPanel;
