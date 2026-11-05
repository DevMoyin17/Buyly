# Glowora

Glowora is a soft-blush skincare storefront built with React, Vite, Tailwind, shadcn/ui and Zustand. The frontend is paired with a local JSON Server backend and uses the supplied skincare photography throughout the storefront.

## Experience

- Editorial blush hero with Playfair Display headlines and a product-led composition
- Shop By Categories with skincare collections, counts and real product photography
- A Little Care, Every Single Day featured edit
- Our Bestsellers with wishlist and quick-add actions
- Full collection grid with search, category filters, sorting and wishlist filtering
- Product detail pages with quantity selection, add to cart, features and related products
- Cart drawer with quantity controls, currency-aware totals and stock-restoring clear action
- Checkout with Paystack and guarded exchange-rate handling
- Styled Glowora account pages
- Lightly themed admin dashboard and product/order management
- Soft reveal-on-scroll animations, floating hero cards, hover motion and reduced-motion support
- Currency conversion through live exchange rates with no silent USD fallbacks

## Brand and catalogue

The storefront is branded **Glowora**. The catalogue is skincare-only and covers cleansers, moisturizers, serums, sunscreen and body rituals. Product images are stored locally in `public/images/`, and the catalogue itself lives in `backend/db.json`.

No fabricated discounts, countdowns or ratings are used. Product pricing, stock and imagery come from the local backend and supplied assets.

## Project structure

```text
Glowora/
  public/images/           Skincare photography
  src/
    components/
      storefront/          Hero, header, categories, promo, newsletter, reveal motion
      admin/               Admin product and auth UI
      ui/                  shadcn primitives
    lib/
      api.js               API client with environment-aware API URL
      catalog.js           Skincare category inference and catalogue helpers
      format.js            Currency conversion and formatting
      slices/              Zustand cart, product, order, currency and wishlist state
    pages/                 Home, product details, checkout, auth and admin
  backend/                 JSON Server backend (separate repository)
```

## Local setup

### 1. Backend

```powershell
cd backend
npm install
# Create backend/.env with:
# PORT=3000
# ADMIN_PIN=your-local-pin
npm start
```

The API runs at `http://localhost:3000/api`.

### 2. Frontend

From the repository root:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173`.

Use the `localhost` URL rather than `127.0.0.1`, because the backend CORS configuration allows `http://localhost:5173`. Add your production origin to the backend CORS list when deploying.

On this Windows machine, use `npm.cmd` if PowerShell blocks the `npm` wrapper:

```powershell
npm.cmd run dev
```

The frontend uses `http://localhost:3000/api` by default. For a deployed backend, set:

```text
VITE_API_URL=https://your-backend.example.com/api
```

## Admin

The admin area is not linked from the shopper navigation. Visit `/admin/login` and use the PIN defined in `backend/.env`.

## Scripts

```sh
npm run dev       # frontend dev server
npm run api       # start the nested backend
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build
```

## Notes

- Product data, order history and stock live in `backend/db.json`.
- The auth forms retain the project's existing external auth endpoints; the UI has been rebuilt for Glowora, but the auth provider is not part of this pass.
- Newsletter signup is currently a local, visual-only experience until a mailing provider is connected.
- Checkout uses the existing Paystack test public key. Exchange rates must be available before payment is enabled.
