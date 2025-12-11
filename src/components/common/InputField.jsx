import React, { forwardRef, useId } from 'react';

const InputField = forwardRef(({
    label,
    name,
    type = "text",
    error,
    icon,
    className = "",
    classNames,
    value,
    variant = "default",
    isRequired = false,
    helperText,
    as = "input",
    autoComplete,
    onChange, // Destructured to check for existence
    readOnly, // Destructured to check for existence
    ...props
}, ref) => {
    const id = useId();
    const inputId = props.id || id;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const Component = as === "textarea" ? "textarea" : "input";

    const radiusClass = as === "textarea" ? "rounded-xl" : "rounded-full";

    const baseStyles = `block w-full ${radiusClass} border-0 py-2 px-4 text-gray-900 text-sm shadow-sm 
    ring-1 ring-inset transition-all duration-200 ease-in-out placeholder:text-gray-400 focus:ring-2 
    focus:ring-inset sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-gray-50`;

    const variantStyles = {
        default: "bg-white ring-gray-300 focus:ring-indigo-600",
        filled: "bg-gray-100 ring-transparent focus:bg-white focus:ring-indigo-600",
    };

    const stateStyles = error
        ? "bg-white ring-red-300 text-red-900 placeholder-red-300 focus:ring-red-500"
        : variantStyles[variant] || variantStyles.default;

    const inputClasses = `${baseStyles} ${stateStyles} ${icon ? 'pr-11' : ''} ${as === 'textarea' ? 'resize-y' : ''} 
    ${className} ${classNames || ""}`;

    const ariaDescribedBy = [];
    if (error) ariaDescribedBy.push(errorId);
    if (helperText && !error) ariaDescribedBy.push(helperId);

    const safeValue = value === null ? "" : value;
    
    // Fix: Convert boolean true to "on" to prevent React warning
    const safeAutoComplete = autoComplete === true ? "on" : autoComplete;

    // Fix: Handle case where value is provided without onChange (avoids read-only warning)
    // If value exists but no onChange/readOnly, we treat it as defaultValue (uncontrolled) 
    // to allow typing.
    const isReadOnly = readOnly || props.disabled;
    const isMissingHandler = (safeValue !== undefined) && !onChange && !isReadOnly;

    return (
        <div className="w-full">
            {label && (
                <label 
                    htmlFor={inputId} 
                    className="block text-sm font-semibold leading-6 text-gray-900 mb-2"
                >
                    {label}
                    {isRequired && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
                </label>
            )}

            <div className="relative">
                <Component
                    ref={ref}
                    id={inputId}
                    name={name}
                    type={type}
                    // If handler is missing, use defaultValue to keep field editable. 
                    // Otherwise use standard controlled value.
                    {...(isMissingHandler ? { defaultValue: safeValue } : { value: safeValue })}
                    onChange={onChange}
                    readOnly={readOnly}
                    required={isRequired}
                    className={inputClasses}
                    autoComplete={safeAutoComplete}
                    aria-invalid={!!error}
                    aria-describedby={ariaDescribedBy.length > 0 ? ariaDescribedBy.join(' ') : undefined}
                    rows={as === "textarea" ? (props.rows || 4) : undefined}
                    {...props}
                />

                {icon && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 
                    text-gray-400 peer-focus:text-gray-600">
                        {icon}
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1" id={errorId} role="alert">
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p className="mt-2 text-sm text-gray-500" id={helperId}>
                    {helperText}
                </p>
            )}
        </div>
    );
});

InputField.displayName = "InputField";

export default InputField;