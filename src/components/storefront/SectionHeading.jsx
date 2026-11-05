import { useMemo } from "react";

const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className = "",
}) => {
  const alignment = useMemo(
    () => ({
      left: "items-start text-left",
      center: "items-center text-center",
    }),
    [],
  );

  const isCenter = align === "center";

  return (
    <div
      className={`flex flex-col gap-4 ${
        isCenter ? "items-center" : "sm:flex-row sm:items-end sm:justify-between"
      } ${className}`}
    >
      <div className={`flex flex-col ${alignment[align] || alignment.left}`}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 max-w-2xl font-display text-[30px] font-medium leading-[1.08] text-brand-ink sm:text-[40px]">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-xl text-sm leading-6 text-brand-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default SectionHeading;
