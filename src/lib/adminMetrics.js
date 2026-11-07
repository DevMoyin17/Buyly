export const LOW_STOCK_THRESHOLD = 12;

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export const successfulOrders = (orders = []) =>
  orders.filter((order) => order?.status === "success");

export const formatAdminMoney = (value, decimals = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(toNumber(value));

export const formatAdminDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const dayKey = (date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

export const getSalesSeries = (orders = [], days = 14) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const series = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    series.push({
      key: dayKey(date),
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: 0,
    });
  }

  const buckets = new Map(series.map((entry) => [entry.key, entry]));

  successfulOrders(orders).forEach((order) => {
    if (!order.date) return;
    const date = new Date(order.date);
    if (Number.isNaN(date.getTime())) return;
    const bucket = buckets.get(dayKey(date));
    if (bucket) bucket.value += toNumber(order.total);
  });

  return series;
};

export const getCustomers = (orders = []) => {
  const customers = new Map();

  successfulOrders(orders).forEach((order) => {
    const email = String(order.email || "").trim().toLowerCase();
    if (!email) return;

    const entry = customers.get(email) || {
      email,
      orders: 0,
      spent: 0,
      lastOrder: null,
    };

    entry.orders += 1;
    entry.spent += toNumber(order.total);

    const date = order.date ? new Date(order.date) : null;
    if (date && !Number.isNaN(date.getTime()) && (!entry.lastOrder || date > entry.lastOrder)) {
      entry.lastOrder = date;
    }

    customers.set(email, entry);
  });

  return [...customers.values()].sort((a, b) => b.spent - a.spent);
};

export const getCustomerSegments = (customers = []) => {
  const returning = customers.filter((customer) => customer.orders > 1).length;
  return {
    newCustomers: customers.length - returning,
    returning,
    total: customers.length,
  };
};

export const getTopProducts = (orders = [], products = [], limit = 5) => {
  const tally = new Map();

  successfulOrders(orders).forEach((order) => {
    (order.items || []).forEach((item) => {
      const key = item?.id != null ? String(item.id) : item?.name;
      if (!key) return;

      const entry = tally.get(key) || {
        key,
        name: item.name,
        quantity: 0,
        revenue: 0,
      };

      const quantity = toNumber(item.quantity);
      entry.quantity += quantity;
      entry.revenue += toNumber(item.price) * quantity;
      tally.set(key, entry);
    });
  });

  const sold = [...tally.values()]
    .map((entry) => {
      const product =
        products.find((item) => String(item.id) === entry.key) ||
        products.find((item) => item.name === entry.name);
      return product ? { ...entry, product } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.quantity - a.quantity);

  if (sold.length) return sold.slice(0, limit);

  return products.slice(0, limit).map((product) => ({
    product,
    quantity: 0,
    revenue: 0,
  }));
};

export const getMonthlyStats = (orders = []) => {
  const now = new Date();
  const paid = successfulOrders(orders).filter((order) => {
    if (!order.date) return false;
    const date = new Date(order.date);
    return (
      !Number.isNaN(date.getTime()) &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  return {
    revenue: paid.reduce((total, order) => total + toNumber(order.total), 0),
    count: paid.length,
  };
};
