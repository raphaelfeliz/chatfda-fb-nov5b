/*
*file-summary*
PATH: src/components/header/breadcrumb.tsx
PURPOSE: Display a breadcrumb trail showing the user’s navigation or decision path.
SUMMARY: Iterates through a history array, separating items with a ChevronRight icon.
         Highlights the last item as the current step, with responsive and theme-aware styling.
IMPORTS: React, ChevronRight (lucide-react)
EXPORTS: Breadcrumb (React functional component)
*/


import { ChevronRight } from "lucide-react";

type BreadcrumbProps = {
  history: string[];
}

export function Breadcrumb({ history }: BreadcrumbProps) {
    return (
        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground flex-wrap">
        {history.length > 0 &&
            history.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                <span
                className={
                    index === history.length - 1
                    ? "font-medium text-foreground"
                    : ""
                }
                >
                {item}
                </span>
            </div>
            ))}
        </div>
    );
}
