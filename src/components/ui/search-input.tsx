"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useRef, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchInput({
  placeholder = "Rechercher…",
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const currentQuery = searchParams.get("q") ?? "";

  const updateURL = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => updateURL(value), 300);
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = "";
    if (timerRef.current) clearTimeout(timerRef.current);
    updateURL("");
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      <Search className="text-muted-foreground/60 pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        defaultValue={currentQuery}
        onChange={handleChange}
        className="placeholder:text-muted-foreground/60 border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 h-11 w-full rounded-lg border bg-white pl-9 pr-9 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm"
      />
      {currentQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
        >
          <X className="size-4" />
          <span className="sr-only">Effacer la recherche</span>
        </button>
      )}
    </div>
  );
}
