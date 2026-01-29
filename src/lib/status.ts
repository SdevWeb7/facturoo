export const STATUS_BADGE_VARIANT: Record<
  string,
  { label: string; variant: "draft" | "sent" | "invoiced" }
> = {
  DRAFT: { label: "Brouillon", variant: "draft" },
  SENT: { label: "Envoyé", variant: "sent" },
  INVOICED: { label: "Facturé", variant: "invoiced" },
};
