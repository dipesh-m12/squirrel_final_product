export const Spinner = ({ className }: { className?: string }) => (
  <div
    className={`h-5 w-5 border-2 border-t-transparent rounded-full animate-spin ${className}`}
  />
);
