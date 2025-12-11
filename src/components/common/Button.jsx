import React from "react";

const Button = ({
    type = "button",
    disabled = false,
    isLoading = false,
    loadingText = "Processing...",
    children,
    className = "",
    icon = null,
    iconPosition = "left",
    ...props
    }) => {
        const baseClasses = "text-white bg-primary-light py-2 px-3 rounded-full cursor-pointer flex items-center justify-center gap-2";
        const disabledClasses = "disabled:opacity-70 disabled:cursor-not-allowed";

        return (
            <button
            type={type}
            disabled={disabled}
            className={`${baseClasses} ${disabledClasses} ${className}`}
            {...props}
            >
            {isLoading ? (
                loadingText
            ) : (
                <>
                    {icon && iconPosition === "left" && <span>{icon}</span>}
                    {children}
                    {icon && iconPosition === "right" && <span>{icon}</span>}
                </>
            )}
            </button>
        );
};

export default Button;
