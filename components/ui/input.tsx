import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full px-6 py-4 text-lg bg-white/80 backdrop-blur-xl border-2 border-purple-200/50 rounded-2xl",
        "text-gray-800 placeholder:text-gray-400",
        "focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50",
        "transition-all duration-300",
        "shadow-sm hover:shadow-md focus:shadow-lg",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export { Input }
