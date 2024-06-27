import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`${className ?? ""} flex h-10 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-base ring-offset-background 
        file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-[#0084d7]
        disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800`}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
