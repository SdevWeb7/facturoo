"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/action-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        <Label htmlFor="name">Nom *</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
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
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={defaultValues?.phone}
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
