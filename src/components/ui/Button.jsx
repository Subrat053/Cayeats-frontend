const variants = {
  primary: {
    background: "#ed7615",
    hover: "#de5a0b",
    color: "#ffffff",
  },
  secondary: {
    background: "#06b6d4",
    hover: "#0891b2",
    color: "#ffffff",
  },
  success: {
    background: "#22c55e",
    hover: "#16a34a",
    color: "#ffffff",
  },
  error: {
    background: "#ef4444",
    hover: "#dc2626",
    color: "#ffffff",
  },
  gray: {
    background: "#6b7280",
    hover: "#4b5563",
    color: "#ffffff",
  },
};

const Button = ({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
  type = "button",
  fullWidth = false,
  size = "md",
  loading = false,
  ...props
}) => {
  const colors = variants[variant] || variants.primary;

  const sizeStyles = {
    sm: { padding: "6px 12px", fontSize: "12px" },
    md: { padding: "10px 20px", fontSize: "14px" },
    lg: { padding: "12px 24px", fontSize: "16px" },
  };

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: colors.background,
    color: colors.color,
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    fontFamily: "inherit",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? "100%" : "auto",
    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
    transition: "background-color 0.2s, transform 0.1s, box-shadow 0.2s",
    ...sizeStyles[size],
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
      className={className}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = colors.hover;
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = colors.background;
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.15)";
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
