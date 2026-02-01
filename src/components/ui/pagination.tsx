"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export function Pagination({ currentPage, totalPages, basePath, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      {currentPage > 1 ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildHref(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </Button>
      )}

      <span className="text-sm text-muted-foreground">
        Page {currentPage} sur {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildHref(currentPage + 1)}>
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
