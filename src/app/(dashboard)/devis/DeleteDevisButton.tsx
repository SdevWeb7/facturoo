"use client";

import { deleteDevis } from "@/actions/devis";
import { useTransition } from "react";

export function DeleteDevisButton({ devisId }: { devisId: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Supprimer ce devis ?")) return;
    startTransition(() => {
      deleteDevis(devisId);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="ml-4 font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
    >
      {pending ? "..." : "Supprimer"}
    </button>
  );
}
