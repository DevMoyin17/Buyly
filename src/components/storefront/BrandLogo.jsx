import { Link } from "react-router-dom";

const BrandLogo = ({ className = "" }) => {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2 ${className}`}
      aria-label="Glowora home"
    >
      <svg
        viewBox="0 0 36 36"
        className="h-7 w-7 shrink-0 text-brand-ink transition duration-300 group-hover:rotate-[8deg]"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M18 17.4c-3.2-1.4-5.1-4.5-4.4-7.6 3.2-.4 6.3 1.6 7.4 4.7 1.1-3.1 4.2-5.1 7.4-4.7.7 3.1-1.2 6.2-4.4 7.6 3.2 1.4 5.1 4.5 4.4 7.6-3.2.4-6.3-1.6-7.4-4.7-1.1 3.1-4.2 5.1-7.4 4.7-.7-3.1 1.2-6.2 4.4-7.6Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="17.4" r="2.2" fill="#D77C8D" />
      </svg>
      <span className="font-display text-[29px] font-semibold leading-none tracking-[-0.055em] text-brand-ink transition group-hover:text-brand-rose-deep">
        Glowora
      </span>
    </Link>
  );
};

export default BrandLogo;
