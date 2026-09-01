export function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tap-target w-full rounded-2xl border px-6 py-5 text-left text-base font-medium transition-all duration-150 active:scale-[0.98] sm:text-lg ${
        selected
          ? "border-stelle-primary bg-stelle-primary-light text-stelle-primary-dark"
          : "border-stelle-border bg-white text-stelle-ink hover:border-stelle-primary hover:bg-stelle-surface"
      }`}
    >
      {label}
    </button>
  );
}
