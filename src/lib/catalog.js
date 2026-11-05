export const CATEGORY_RULES = [
  {
    id: "cleansers",
    label: "Cleansers",
    description: "Fresh, comfortable skin starts here.",
    keywords: ["cleanser", "cleansing", "foam", "wash"],
  },
  {
    id: "moisturizers",
    label: "Moisturizers",
    description: "Cushiony hydration for a soft, supple finish.",
    keywords: ["moisturizer", "cream", "lotion", "butter", "balm"],
  },
  {
    id: "serums",
    label: "Serums",
    description: "Concentrated care for your glowiest skin.",
    keywords: ["serum", "essence", "concentrate", "drops"],
  },
  {
    id: "sunscreen",
    label: "Sunscreen",
    description: "Everyday protection, invisible on skin.",
    keywords: ["spf", "sunscreen", "sun", "uv"],
  },
  {
    id: "body",
    label: "Body Rituals",
    description: "Nourishing body care for slow, soft moments.",
    keywords: ["body", "ritual", "bath"],
  },
];

export const FALLBACK_CATEGORY = {
  id: "essentials",
  label: "Essentials",
  description: "Gentle everyday care for beautiful skin.",
};

export function getProductCategory(product) {
  const words = `${product?.name || ""} ${product?.description || ""}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  const match = CATEGORY_RULES.find((category) =>
    category.keywords.some((keyword) =>
      words.some(
        (word) => word === keyword || word === `${keyword}s` || word === `${keyword}es`,
      ),
    ),
  );
  return match || FALLBACK_CATEGORY;
}

export function getCategoryById(categoryId) {
  return CATEGORY_RULES.find((category) => category.id === categoryId) || FALLBACK_CATEGORY;
}

export function buildCategories(products = []) {
  const categories = CATEGORY_RULES.map((category) => {
    const matches = products.filter((product) => getProductCategory(product).id === category.id);
    return {
      ...category,
      count: matches.length,
      cover: matches[0]?.image || null,
      sample: matches[0] || null,
    };
  }).filter((category) => category.count > 0);

  const fallbackItems = products.filter(
    (product) => getProductCategory(product).id === FALLBACK_CATEGORY.id,
  );
  if (fallbackItems.length) {
    categories.push({
      ...FALLBACK_CATEGORY,
      count: fallbackItems.length,
      cover: fallbackItems[0]?.image || null,
      sample: fallbackItems[0],
    });
  }

  return categories;
}

export function getNewArrivals(products = [], limit = 4) {
  return [...products]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, limit);
}

export function getFeaturedProduct(products = []) {
  const available = products.filter((product) => Number(product.stock) > 0);
  const ritualSet = available.find((product) =>
    /ritual|set/i.test(`${product.name} ${product.description}`),
  );
  const cream = available.find((product) =>
    /cloud cream|moisturizer/i.test(`${product.name} ${product.description}`),
  );

  return (
    ritualSet ||
    cream ||
    [...available].sort((a, b) => Number(a.stock) - Number(b.stock))[0] ||
    products[0] ||
    null
  );
}

export function getHeroProducts(products = []) {
  const selected = [];
  const preferredNames = ["glow dew serum", "cloud cream", "body oil"];

  preferredNames.forEach((keyword) => {
    const match = products.find(
      (product) =>
        `${product.name} ${product.description}`.toLowerCase().includes(keyword) &&
        !selected.some((item) => item.id === product.id),
    );
    if (match) selected.push(match);
  });

  const preferredCategories = ["serums", "moisturizers", "body", "sunscreen", "cleansers"];
  preferredCategories.forEach((categoryId) => {
    const match = products.find(
      (product) =>
        getProductCategory(product).id === categoryId &&
        !selected.some((item) => item.id === product.id),
    );
    if (match && selected.length < 3) selected.push(match);
  });

  products.forEach((product) => {
    if (selected.length < 3 && !selected.some((item) => item.id === product.id)) {
      selected.push(product);
    }
  });

  return selected.slice(0, 3);
}

export function filterProducts(products = [], categoryId = "all") {
  if (!categoryId || categoryId === "all") return products;
  return products.filter((product) => getProductCategory(product).id === categoryId);
}
