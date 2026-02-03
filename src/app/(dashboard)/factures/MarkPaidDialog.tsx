"use client";

import { useState, useTransition } from "react";
import { markFactureAsPaid } from "@/actions/factures";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAYMENT_METHODS = [
  { value: "VIREMENT", label: "Virement bancaire" },
  { value: "CHEQUE", label: "Chèque" },
  { value: "ESPECES", label: "Espèces" },
  { value: "CB", label: "Carte bancaire" },
  { value: "AUTRE", label: "Autre" },
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];

interface MarkPaidDialogProps {
  factureId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarkPaidDialog({ factureId, open, onOpenChange }: MarkPaidDialogProps) {
  const [pending, startTransition] = useTransition();
  const [paymentDate, setPaymentDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await markFactureAsPaid(
        factureId,
        new Date(paymentDate),
        paymentMethod || undefined
      );
      if (result && !result.success) {
        alert(result.error);
      } else {
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marquer comme encaissée</DialogTitle>
          <DialogDescription>
            Renseignez les informations de paiement pour cette facture.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentDate">Date de paiement</Label>
            <Input
              id="paymentDate"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Méthode de paiement (optionnel)</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Sélectionner une méthode" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
