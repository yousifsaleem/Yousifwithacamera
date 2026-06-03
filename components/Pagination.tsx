type PaginationProps = {
  current: number;
  total: number;
  isHidden?: boolean;
};

export function Pagination({ current, total, isHidden = false }: PaginationProps) {
  return (
    <div
      className={`flex items-center justify-end gap-7 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--ink)] tabular-nums transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-12 md:text-[13px] ${
        isHidden ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <span>{String(current).padStart(2, "0")}</span>
      <span className="text-[var(--muted)]">{String(total).padStart(2, "0")}</span>
      <span>YS</span>
    </div>
  );
}
