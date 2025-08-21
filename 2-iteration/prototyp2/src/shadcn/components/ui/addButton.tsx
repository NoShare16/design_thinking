import * as React from "react"
import { PlusIcon } from "lucide-react"
import { cn } from "@/shadcn/lib/utils.ts"

function AddButton({
                       className,
                       ...props
                   }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            data-slot="add-button"
            className={cn(
                "inline-flex items-center justify-center rounded-md border border-input bg-background shadow-xs " +
                "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 " +
                "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 " +
                "h-9 w-9",
                className
            )}
            {...props}
        >
            <PlusIcon className="h-4 w-4" />
        </button>
    )
}

export { AddButton }
