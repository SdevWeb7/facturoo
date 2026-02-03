"use client";

import { useActionState, useState } from "react";
import type { ActionResult } from "@/lib/action-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

function formatPhone(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");
  // Format with space every 2 digits
  const parts = digits.match(/.{1,2}/g) || [];
  return parts.join(" ");
}

function PhoneInput({ defaultValue }: { defaultValue?: string }) {
  const [value, setValue] = useState(() => formatPhone(defaultValue || ""));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value);
    // Limit to 14 characters (10 digits + 4 spaces)
    setValue(formatted.slice(0, 14));
  }

  return (
    <Input
      id="phone"
      name="phone"
      type="tel"
      value={value}
      onChange={handleChange}
      placeholder="06 12 34 56 78"
    />
  );
}

interface ClientFormProps {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  defaultValues?: {
    name?: string;
    email?: string;
    address?: string;
    addressComplement?: string;
    postalCode?: string;
    city?: string;
    phone?: string;
    description?: string;
  };
  submitLabel: string;
}

export function ClientForm({ action, defaultValues, submitLabel }: ClientFormProps) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-5">
      {state?.success === false && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nom complet *</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Prénom Nom"
          defaultValue={defaultValues?.name}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={defaultValues?.email}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          name="address"
          type="text"
          placeholder="Numéro et rue"
          defaultValue={defaultValues?.address}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressComplement">Complément d&apos;adresse</Label>
        <Input
          id="addressComplement"
          name="addressComplement"
          type="text"
          placeholder="Apt, étage, bâtiment..."
          defaultValue={defaultValues?.addressComplement}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Code postal</Label>
          <Input
            id="postalCode"
            name="postalCode"
            type="text"
            defaultValue={defaultValues?.postalCode}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            name="city"
            type="text"
            defaultValue={defaultValues?.city}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <PhoneInput defaultValue={defaultValues?.phone} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Notes / Description</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Informations supplémentaires sur ce client..."
          defaultValue={defaultValues?.description}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
