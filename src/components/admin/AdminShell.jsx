import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Store,
  Users,
  X,
} from "lucide-react";
import BrandLogo from "@/components/storefront/BrandLogo";
import { formatAdminMoney } from "@/lib/adminMetrics";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "products", label: "Products", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
];

const TAB_META = {
  overview: {
    title: "Overview",
    subtitle: "Sales, orders and products at a glance.",
    range: "Last 14 days",
  },
  orders: {
    title: "Orders",
    subtitle: "Every payment and customer order in one place.",
    range: "All time",
  },
  products: {
    title: "Products",
    subtitle: "Manage the Glowora catalogue and stock levels.",
    range: "Live catalogue",
  },
  customers: {
    title: "Customers",
    subtitle: "The people shopping with Glowora.",
    range: "All time",
  },
};

const SidebarContent = ({
  activeTab,
  onTabChange,
  onLogout,
  orderCount,
  monthRevenue,
  monthOrders,
  onNavigate,
}) => (
  <div className="flex h-full flex-col overflow-y-auto">
    <div className="flex items-center px-5 py-5">
      <BrandLogo />
    </div>

    <div className="px-3">
      <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-brand-muted">
        Manage
      </p>
      <nav className="space-y-1" aria-label="Admin sections">
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onTabChange(item.id);
                onNavigate?.();
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition ${
                active
                  ? "bg-brand-blush text-brand-rose-deep"
                  : "text-brand-muted hover:bg-brand-cream hover:text-brand-ink"
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              <span className="flex-1">{item.label}</span>
              {item.id === "orders" && orderCount > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    active
                      ? "bg-white text-brand-rose-deep"
                      : "bg-brand-blush text-brand-rose-deep"
                  }`}
                >
                  {orderCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>

    <div className="mt-6 px-3">
      <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-brand-muted">
        Store
      </p>
      <Link
        to="/"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-brand-muted transition hover:bg-brand-cream hover:text-brand-ink"
      >
        <Store className="h-[18px] w-[18px]" />
        <span className="flex-1">View storefront</span>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>

    <div className="mt-auto px-4 pb-4 pt-8">
      <div className="rounded-2xl border border-brand-line bg-gradient-to-br from-brand-blush to-brand-cream p-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-rose-deep">
          Total revenue
        </p>
        <p className="mt-1 text-[10px] font-semibold text-brand-muted">This month</p>
        <p className="mt-2 text-xl font-extrabold text-brand-ink">
          {formatAdminMoney(monthRevenue)}
        </p>
        <p className="mt-1 text-[10px] text-brand-muted">
          {monthOrders} paid order{monthOrders === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-brand-line bg-white p-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-ink text-[10px] font-extrabold text-white">
          SA
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-extrabold text-brand-ink">Store Admin</p>
          <p className="truncate text-[10px] text-brand-muted">Glowora admin</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          title="Sign out"
          aria-label="Sign out"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-brand-muted transition hover:bg-brand-blush hover:text-brand-rose-deep"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

const AdminShell = ({
  activeTab,
  onTabChange,
  onLogout,
  orderCount = 0,
  monthRevenue = 0,
  monthOrders = 0,
  children,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = TAB_META[activeTab] || TAB_META.overview;
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-brand-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-brand-line/80 bg-white lg:block">
        <SidebarContent
          activeTab={activeTab}
          onTabChange={onTabChange}
          onLogout={onLogout}
          orderCount={orderCount}
          monthRevenue={monthRevenue}
          monthOrders={monthOrders}
        />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm"
            onClick={closeMobile}
            aria-label="Close menu"
          />
          <aside className="relative z-10 h-full w-[280px] bg-white shadow-soft">
            <button
              type="button"
              onClick={closeMobile}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-brand-muted transition hover:bg-brand-blush hover:text-brand-ink"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent
              activeTab={activeTab}
              onTabChange={onTabChange}
              onLogout={onLogout}
              orderCount={orderCount}
              monthRevenue={monthRevenue}
              monthOrders={monthOrders}
              onNavigate={closeMobile}
            />
          </aside>
        </div>
      )}

      <div className="lg:pl-[250px]">
        <header className="sticky top-0 z-30 border-b border-brand-line/70 bg-white/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-brand-line text-brand-ink lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                {meta.title}
              </h1>
              <p className="hidden truncate text-[11px] text-brand-muted sm:block">
                {meta.subtitle}
              </p>
            </div>

            <span className="hidden items-center gap-1.5 rounded-lg border border-brand-line bg-white px-2.5 py-1.5 text-[10px] font-bold text-brand-muted sm:inline-flex">
              <CalendarDays className="h-3.5 w-3.5" />
              {meta.range}
            </span>

            <button
              type="button"
              className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-brand-line bg-white text-brand-muted transition hover:text-brand-ink"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-rose" />
            </button>

            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-blush text-[10px] font-extrabold text-brand-rose-deep">
                SA
              </span>
              <div className="hidden text-left sm:block">
                <p className="text-[11px] font-extrabold leading-tight">Store Admin</p>
                <p className="text-[9px] text-brand-muted">Glowora</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminShell;
