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
