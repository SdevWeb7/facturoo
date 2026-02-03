"use client";

import { useActionState } from "react";
import { updateProfile } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";
import { LogoUpload } from "@/components/forms/LogoUpload";

interface ProfileFormProps {
  defaultValues: {
    name: string;
    email: string;
    company: string;
    siret: string;
    address: string;
    phone: string;
    businessEmail: string;
  };
  logoUrl: string | null;
}

export function ProfileForm({ defaultValues, logoUrl }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="space-y-4">
      <LogoUpload logoUrl={logoUrl} />
      {state?.success === false && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state?.success === true && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertDescription>Profil mis à jour avec succès.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={defaultValues.name}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email de connexion</Label>
          <Input
            id="email"
            type="email"
            value={defaultValues.email}
            disabled
            className="opacity-60"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessEmail">Email sur les documents</Label>
          <Input
            id="businessEmail"
            name="businessEmail"
            type="email"
            placeholder={defaultValues.email}
            defaultValue={defaultValues.businessEmail}
          />
          <p className="text-xs text-muted-foreground">
            Laissez vide pour utiliser l&apos;email de connexion
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Entreprise</Label>
          <Input
            id="company"
            name="company"
            type="text"
            defaultValue={defaultValues.company}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="siret">SIRET</Label>
          <Input
            id="siret"
            name="siret"
            type="text"
            defaultValue={defaultValues.siret}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            name="address"
            type="text"
            defaultValue={defaultValues.address}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={defaultValues.phone}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
