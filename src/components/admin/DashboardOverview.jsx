import { useMemo } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Package,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import ProductImage from "@/components/storefront/ProductImage";
import {
  LOW_STOCK_THRESHOLD,
  formatAdminDate,
  getCustomerSegments,
  getCustomers,
  getSalesSeries,
  getTopProducts,
  successfulOrders,
} from "@/lib/adminMetrics";
import { useAdminMoney } from "@/lib/useAdminMoney";

const STAT_TONES = {
  emerald: "bg-emerald-50 text-emerald-600",
  sky: "bg-sky-50 text-sky-600",
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
};

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

const SalesChart = ({ series }) => {
  const width = 640;
  const height = 220;
  const padX = 4;
  const padTop = 12;
  const padBottom = 16;
  const chartHeight = height - padTop - padBottom;
  const max = Math.max(...series.map((entry) => entry.value), 0);
  const stepX = (width - padX * 2) / Math.max(series.length - 1, 1);
  const yFor = (value) => padTop + (1 - value / (max || 1)) * chartHeight;
  const points = series.map((entry, index) => [
    padX + index * stepX,
    yFor(entry.value),
  ]);
  const linePath = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const first = points[0] || [padX, height - padBottom];
  const last = points[points.length - 1] || [padX, height - padBottom];
  const areaPath = `${linePath} L${last[0].toFixed(1)},${height - padBottom} L${first[0].toFixed(1)},${height - padBottom} Z`;

  const labelIndexes = [0, 0.25, 0.5, 0.75, 1]
    .map((ratio) => Math.round((series.length - 1) * ratio))
    .filter((index, position, array) => array.indexOf(index) === position);

  return (
    <>
      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="h-52 w-full"
          role="img"
          aria-label="Paid sales over the last 14 days"
        >
          <defs>
            <linearGradient id="adminSalesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D77C8D" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#D77C8D" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((fraction) => (
            <line
              key={fraction}
              x1="0"
              x2={width}
              y1={padTop + chartHeight * fraction}
              y2={padTop + chartHeight * fraction}
              stroke="#F0DEE2"
              strokeDasharray="4 6"
            />
          ))}

          <path d={areaPath} fill="url(#adminSalesFill)" />
          <path
            d={linePath}
            fill="none"
            stroke="#B85D70"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {max === 0 && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <p className="rounded-full border border-brand-line bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-brand-muted">
              No paid orders in this period yet
            </p>
          </div>
        )}
      </div>

      <div className="mt-1 flex justify-between text-[10px] font-semibold text-brand-muted">
        {labelIndexes.map((index) => (
          <span key={index}>{series[index]?.label}</span>
        ))}
      </div>
    </>
  );
};

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-line bg-brand-cream/40 px-4 py-10 text-center">
    <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-brand-rose-deep shadow-sm">
      <Icon className="h-5 w-5" />
    </span>
    <p className="mt-3 text-xs font-extrabold text-brand-ink">{title}</p>
    <p className="mt-1 max-w-[240px] text-[11px] leading-5 text-brand-muted">{description}</p>
  </div>
);

const DashboardOverview = ({ products = [], orders = [], onNavigate }) => {
  const money = useAdminMoney();
  const paidOrders = useMemo(() => successfulOrders(orders), [orders]);
  const revenue = useMemo(
    () => paidOrders.reduce((total, order) => total + (Number(order.total) || 0), 0),
    [paidOrders],
  );
  const customers = useMemo(() => getCustomers(orders), [orders]);
  const segments = useMemo(() => getCustomerSegments(customers), [customers]);
  const salesSeries = useMemo(() => getSalesSeries(orders), [orders]);
  const topProducts = useMemo(() => getTopProducts(orders, products), [orders, products]);
  const lowStock = useMemo(
    () =>
      products
        .filter((product) => Number(product.stock) <= LOW_STOCK_THRESHOLD)
        .sort((a, b) => Number(a.stock) - Number(b.stock)),
    [products],
  );
  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 5),
    [orders],
  );

  const hasSales = topProducts.some((entry) => entry.quantity > 0);
  const recentWeek = salesSeries.slice(-7).reduce((sum, entry) => sum + entry.value, 0);
  const previousWeek = salesSeries
    .slice(0, 7)
    .reduce((sum, entry) => sum + entry.value, 0);
  const trend =
    previousWeek > 0 ? Math.round(((recentWeek - previousWeek) / previousWeek) * 100) : null;

  const stats = [
    {
      label: "Total revenue",
      value: money(revenue),
      detail: `${paidOrders.length} paid order${paidOrders.length === 1 ? "" : "s"}`,
      icon: CircleDollarSign,
      tone: "emerald",
    },
    {
      label: "Orders",
      value: orders.length,
      detail: `${paidOrders.length} paid`,
      icon: ShoppingBag,
      tone: "sky",
    },
    {
      label: "Customers",
      value: customers.length,
      detail: `${segments.returning} returning`,
      icon: Users,
      tone: "violet",
    },
    {
      label: "Low stock",
      value: lowStock.length,
      detail: lowStock.length ? "Needs restocking" : "All stocked up",
      icon: AlertTriangle,
      tone: "amber",
    },
  ];

  const newPercent = segments.total
    ? Math.round((segments.newCustomers / segments.total) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-brand-line/70 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-muted">
                  {stat.label}
                </p>
                <p className="mt-2 truncate text-2xl font-extrabold tracking-[-0.03em]">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] font-semibold text-brand-muted">
                  {stat.detail}
                </p>
              </div>
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${STAT_TONES[stat.tone]}`}
              >
                <stat.icon className="h-5 w-5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <section className="rounded-2xl border border-brand-line/70 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold">Sales Overview</h2>
              <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
                <p className="text-2xl font-extrabold tracking-[-0.03em]">
                  {money(revenue)}
                </p>
                {trend === null ? (
                  <span className="text-[10px] font-semibold text-brand-muted">
                    No previous period data
                  </span>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                      trend >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {trend >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    {Math.abs(trend)}%
                    <span className="font-semibold text-brand-muted">vs previous 7 days</span>
                  </span>
                )}
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-brand-line bg-white px-2.5 py-1.5 text-[10px] font-bold text-brand-muted">
              <CalendarDays className="h-3.5 w-3.5" />
              Last 14 days
            </span>
          </div>

          <SalesChart series={salesSeries} />
        </section>

        <section className="flex flex-col rounded-2xl border border-brand-line/70 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold">Inventory Alerts</h2>
            <button
              type="button"
              onClick={() => onNavigate?.("products")}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-rose-deep transition hover:text-brand-ink"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 flex-1">
            {lowStock.length ? (
              <ul className="divide-y divide-brand-line/70">
                {lowStock.slice(0, 4).map((product) => (
                  <li key={product.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      className="h-11 w-11 shrink-0 rounded-xl bg-brand-blush"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-extrabold">{product.name}</p>
                      <p className="mt-0.5 text-[10px] text-brand-muted">
                        {Number(product.stock) === 0 ? "Out of stock" : "Stock running low"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-extrabold ${
                        Number(product.stock) === 0
                          ? "bg-rose-50 text-rose-600"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {product.stock} left
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-brand-line bg-brand-cream/40 px-4 py-8 text-center">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <p className="mt-3 text-xs font-extrabold">Stock levels look healthy</p>
                <p className="mt-1 text-[10px] text-brand-muted">
                  No products need restocking right now.
                </p>
              </div>
            )}
          </div>

          <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-muted">
            Alerts below {LOW_STOCK_THRESHOLD + 1} units
          </p>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <section className="rounded-2xl border border-brand-line/70 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold">Recent Orders</h2>
            <button
              type="button"
              onClick={() => onNavigate?.("orders")}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-rose-deep transition hover:text-brand-ink"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {recentOrders.length ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left">
                <thead>
                  <tr className="text-[9px] uppercase tracking-[0.12em] text-brand-muted">
                    <th className="pb-2 pr-3 font-bold">Order</th>
                    <th className="pb-2 pr-3 font-bold">Customer</th>
                    <th className="pb-2 pr-3 font-bold">Date</th>
                    <th className="pb-2 pr-3 font-bold">Amount</th>
                    <th className="pb-2 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-line/70">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="text-[11px]">
                      <td className="py-3 pr-3 font-extrabold">#{order.id}</td>
                      <td className="max-w-[160px] py-3 pr-3 text-brand-muted">
                        <p className="truncate">{order.email || "Guest"}</p>
                        {(order.shipping?.city || order.shipping?.state) && (
                          <p className="truncate text-[9px]">
                            {[order.shipping.city, order.shipping.state]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-3 text-brand-muted">
                        {formatAdminDate(order.date)}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-3 font-extrabold">
                        {money(order.total, 2)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-[9px] font-extrabold ${
                            STATUS_STYLES[order.status] || "bg-brand-blush text-brand-rose-deep"
                          }`}
                        >
                          {STATUS_LABELS[order.status] || order.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                icon={ShoppingBag}
                title="No orders yet"
                description="Orders will appear here after the first successful checkout."
              />
            </div>
          )}
        </section>

        <section className="flex flex-col rounded-2xl border border-brand-line/70 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-extrabold">Customer Segments</h2>

          {segments.total ? (
            <>
              <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-5 sm:flex-row">
                <div className="relative h-36 w-36 shrink-0">
                  <div
                    className="h-full w-full rounded-full"
                    style={{
                      background: `conic-gradient(#D77C8D 0% ${newPercent}%, #E3B778 ${newPercent}% 100%)`,
                    }}
                  />
                  <div className="absolute inset-[18px] grid place-items-center rounded-full bg-white">
                    <div className="text-center">
                      <p className="text-2xl font-extrabold leading-none">
                        {segments.total}
                      </p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-brand-muted">
                        Total
                      </p>
                    </div>
                  </div>
                </div>

                <ul className="w-full space-y-3">
                  <li className="flex items-center gap-2 text-[11px]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D77C8D]" />
                    <span className="flex-1 font-semibold text-brand-muted">New customers</span>
                    <span className="font-extrabold">{segments.newCustomers}</span>
                    <span className="w-8 text-right text-brand-muted">{newPercent}%</span>
                  </li>
                  <li className="flex items-center gap-2 text-[11px]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E3B778]" />
                    <span className="flex-1 font-semibold text-brand-muted">Returning</span>
                    <span className="font-extrabold">{segments.returning}</span>
                    <span className="w-8 text-right text-brand-muted">
                      {100 - newPercent}%
                    </span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="mt-4 flex-1">
              <EmptyState
                icon={Users}
                title="No customers yet"
                description="Customer segments will build up after the first paid order."
              />
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-brand-line/70 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold">Top Products</h2>
            <p className="mt-0.5 text-[10px] text-brand-muted">
              {hasSales ? "Best sellers by units sold." : "Your current catalogue."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.("products")}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-rose-deep transition hover:text-brand-ink"
          >
            View all products
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {topProducts.length ? (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
            {topProducts.map(({ product, quantity, revenue: productRevenue }) => (
              <div key={product.id}>
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="aspect-[4/3] w-full rounded-xl bg-brand-blush"
                  imageClassName="hover:scale-[1.03]"
                />
                <p className="mt-3 truncate text-[11px] font-extrabold">{product.name}</p>
                <p className="mt-0.5 text-[10px] text-brand-muted">
                  {hasSales ? `${quantity} sold` : `${product.stock} in stock`}
                </p>
                <p className="mt-1 text-xs font-extrabold text-brand-rose-deep">
                  {money(hasSales ? productRevenue : product.price, 2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState
              icon={Package}
              title="No products yet"
              description="Add your first product to see it featured here."
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardOverview;
