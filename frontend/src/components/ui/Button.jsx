import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-dark-accent hover:bg-dark-accent-dim text-white shadow-sm",
  secondary:
    "bg-white dark:bg-dark-s2 hover:bg-gray-50 dark:hover:bg-dark-s3 text-gray-800 dark:text-dark-tx1 border border-gray-200 dark:border-dark-border shadow-sm",
  ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-dark-s2 text-gray-700 dark:text-dark-tx2",
  dark: "bg-gray-900 hover:bg-gray-800 text-white shadow-sm",
  outline:
    "bg-transparent border border-gray-800 dark:border-dark-border2 text-gray-800 dark:text-dark-tx1 hover:bg-gray-50 dark:hover:bg-dark-s2",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
  xl: "h-12 px-8 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  loading,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-dark-accent focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}