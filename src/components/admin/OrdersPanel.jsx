import { useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { formatAdminDate } from "@/lib/adminMetrics";
import { useAdminMoney } from "@/lib/useAdminMoney";

const FILTERS = [
  { id: "all", label: "All orders" },
  { id: "success", label: "Paid" },
  { id: "pending", label: "Pending" },
  { id: "failed", label: "Failed" },
];

const STATUS_STYLES = {
  success: "bg-emerald-50 text-emerald-700",
  failed: "bg-rose-50 text-rose-600",
  pending: "bg-amber-50 text-amber-700",
};

const STATUS_LABELS = {
  success: "Paid",
  failed: "Failed",
  pending: "Pending",
};

const OrdersPanel = ({ orders = [] }) => {
  const money = useAdminMoney();
  const [filter, setFilter] = useState("all");

  const counts = useMemo(() => {
    const result = { all: orders.length, success: 0, failed: 0, pending: 0 };
    orders.forEach((order) => {
      if (result[order.status] != null) result[order.status] += 1;
    });
    return result;
  }, [orders]);

  const visibleOrders = useMemo(() => {
    const filtered =
      filter === "all" ? orders : orders.filter((order) => order.status === filter);
    return [...filtered].sort(
      (a, b) => new Date(b.date || 0) - new Date(a.date || 0),
    );
  }, [orders, filter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-bold transition ${
                active
                  ? "border-brand-ink bg-brand-ink text-white"
                  : "border-brand-line bg-white text-brand-muted hover:border-brand-rose/40 hover:text-brand-ink"
              }`}
            >
              {item.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${
                  active ? "bg-white/15 text-white" : "bg-brand-blush text-brand-rose-deep"
                }`}
              >
                {counts[item.id] || 0}
              </span>
            </button>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-brand-line/70 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-brand-line/70 px-5 py-4">
          <div>
            <h2 className="text-sm font-extrabold">Order history</h2>
            <p className="mt-0.5 text-[10px] text-brand-muted">
              {visibleOrders.length} order{visibleOrders.length === 1 ? "" : "s"} shown
            </p>
          </div>
          <span className="rounded-full bg-brand-blush px-3 py-1 text-[10px] font-extrabold text-brand-rose-deep">
            {money(
              visibleOrders.reduce((total, order) => total + (Number(order.total) || 0), 0),
              2,
            )}
          </span>
        </div>

        {visibleOrders.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[11px]">
              <thead>
                <tr className="border-b border-brand-line/70 bg-brand-cream/40 text-[9px] uppercase tracking-[0.12em] text-brand-muted">
                  <th className="px-5 py-3 font-bold">Order</th>
                  <th className="px-3 py-3 font-bold">Customer</th>
                  <th className="px-3 py-3 font-bold">Date</th>
                  <th className="px-3 py-3 font-bold">Items</th>
                  <th className="px-3 py-3 font-bold">Total</th>
                  <th className="px-3 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line/60">
                {visibleOrders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-brand-cream/40">
                    <td className="px-5 py-3.5 font-extrabold">#{order.id}</td>
                    <td className="max-w-[190px] truncate px-3 py-3.5 text-brand-muted">
                      {order.email || "Guest"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-brand-muted">
                      {formatAdminDate(order.date)}
                    </td>
                    <td className="px-3 py-3.5 text-brand-muted">
                      {order.items?.length || 0}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 font-extrabold">
                      {money(order.total, 2)}
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-[9px] font-extrabold ${
                          STATUS_STYLES[order.status] || "bg-brand-blush text-brand-rose-deep"
                        }`}
                      >
                        {STATUS_LABELS[order.status] || order.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[10px] text-brand-muted">
                      {order.paymentReference || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-blush text-brand-rose-deep">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm font-extrabold">No orders here yet</p>
            <p className="mt-1 max-w-xs text-[11px] leading-5 text-brand-muted">
              {filter === "all"
                ? "Orders will show up as soon as a customer completes checkout."
                : "There are no orders with this payment status."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default OrdersPanel;
