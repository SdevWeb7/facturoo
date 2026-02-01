"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  BookOpen,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Periode = "mois" | "trimestre" | "annee" | "custom";

const PERIODE_OPTIONS: { value: Periode; label: string }[] = [
  { value: "mois", label: "Ce mois" },
  { value: "trimestre", label: "Ce trimestre" },
  { value: "annee", label: "Cette année" },
  { value: "custom", label: "Personnalisé" },
];

function getDateRange(periode: Periode, customFrom: string, customTo: string) {
  const now = new Date();
  let from: Date;
  let to: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  switch (periode) {
    case "mois":
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "trimestre": {
      const q = Math.floor(now.getMonth() / 3) * 3;
      from = new Date(now.getFullYear(), q, 1);
      break;
    }
    case "annee":
      from = new Date(now.getFullYear(), 0, 1);
      break;
    case "custom":
      from = customFrom ? new Date(customFrom) : new Date(now.getFullYear(), 0, 1);
      to = customTo ? new Date(customTo + "T23:59:59") : to;
      break;
  }

  return {
    from: from!.toISOString(),
    to: to.toISOString(),
  };
}

const exports = [
  {
    id: "csv-factures",
    title: "CSV Factures",
    description: "Toutes vos factures au format CSV (Excel)",
    icon: FileSpreadsheet,
    path: "/api/export/csv-factures",
    downloadLabel: "Télécharger le CSV factures",
  },
  {
    id: "csv-devis",
    title: "CSV Devis",
    description: "Tous vos devis au format CSV (Excel)",
    icon: FileSpreadsheet,
    path: "/api/export/csv-devis",
    downloadLabel: "Télécharger le CSV devis",
  },
  {
    id: "recap-pdf",
    title: "Récap mensuel PDF",
    description: "Récapitulatif avec tableau et totaux",
    icon: FileText,
    path: "/api/export/recap-pdf",
    downloadLabel: "Télécharger le récap PDF",
  },
  {
    id: "journal-pdf",
    title: "Journal des ventes PDF",
    description: "Factures payées classées par trimestre",
    icon: BookOpen,
    path: "/api/export/journal-pdf",
    downloadLabel: "Télécharger le journal PDF",
  },
];

export function ExportPanel() {
  const [periode, setPeriode] = useState<Periode>("mois");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  function handleDownload(path: string) {
    const { from, to } = getDateRange(periode, customFrom, customTo);
    window.open(`${path}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, "_blank");
  }

  return (
    <div>
      {/* Period selector */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {PERIODE_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={periode === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriode(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {periode === "custom" && (
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Du</label>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Au</label>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      {/* Export cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {exports.map((exp) => (
          <Card key={exp.id} className="card-hover">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  <exp.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{exp.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {exp.description}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => handleDownload(exp.path)}
              >
                <Download className="h-4 w-4" />
                {exp.downloadLabel}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
