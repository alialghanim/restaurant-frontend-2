// src/components/ui/textarea.tsx
import * as React from "react";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={`border rounded-md p-2 w-full resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    {...props}
  />
));
Textarea.displayName = "Textarea";
