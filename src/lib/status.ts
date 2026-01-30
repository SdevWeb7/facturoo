export const STATUS_BADGE_VARIANT: Record<
  string,
  { label: string; variant: "draft" | "sent" | "invoiced" | "paid" }
> = {
  DRAFT: { label: "Brouillon", variant: "draft" },
  SENT: { label: "Envoyé", variant: "sent" },
  INVOICED: { label: "Facturé", variant: "invoiced" },
  PENDING: { label: "En attente", variant: "sent" },
  PAID: { label: "Encaissée", variant: "paid" },
};
