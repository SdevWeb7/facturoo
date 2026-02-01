import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { formatCurrency } from "@/lib/utils";

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a" },
  header: { marginBottom: 24 },
  companyName: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  headerText: { fontSize: 9, color: "#555", marginBottom: 2 },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#555", marginBottom: 20 },
  quarterTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    marginTop: 16,
    color: "#333",
  },
  table: { marginTop: 4 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  thText: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", color: "#6b7280" },
  tdText: { fontSize: 9 },
  colNum: { flex: 2 },
  colDate: { flex: 1.5 },
  colClient: { flex: 3 },
  colHT: { flex: 1.5, textAlign: "right" },
  colTVA: { flex: 1.5, textAlign: "right" },
  colTTC: { flex: 1.5, textAlign: "right" },
  subtotalRow: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  subtotalLabel: { flex: 6.5, fontSize: 9, fontFamily: "Helvetica-Bold", color: "#555" },
  subtotalValue: { flex: 1.5, fontSize: 9, fontFamily: "Helvetica-Bold", textAlign: "right" },
  totalsContainer: { marginTop: 24, alignItems: "flex-end" },
  totalsRow: { flexDirection: "row", width: 250, justifyContent: "space-between", paddingVertical: 4 },
  totalsLabel: { fontSize: 10, color: "#555" },
  totalsValue: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  totalsTTCRow: {
    flexDirection: "row",
    width: 250,
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
    marginTop: 4,
  },
  totalsTTCLabel: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  totalsTTCValue: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
  },
  emptyText: { fontSize: 11, color: "#888", textAlign: "center", marginTop: 40 },
});

interface FactureRow {
  number: string;
  date: Date;
  clientName: string;
  tvaRate: number;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
}

interface JournalVentesDocumentProps {
  companyName: string;
  siret: string | null;
  from: Date;
  to: Date;
  factures: FactureRow[];
}

function getQuarterLabel(date: Date): string {
  const q = Math.floor(new Date(date).getMonth() / 3) + 1;
  return `T${q} ${new Date(date).getFullYear()}`;
}

function groupByQuarter(factures: FactureRow[]): Map<string, FactureRow[]> {
  const map = new Map<string, FactureRow[]>();
  for (const f of factures) {
    const key = getQuarterLabel(f.date);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(f);
  }
  return map;
}

export function JournalVentesDocument({
  companyName,
  siret,
  from,
  to,
  factures,
}: JournalVentesDocumentProps) {
  const quarters = groupByQuarter(factures);
  const grandTotalHT = factures.reduce((sum, f) => sum + f.totalHT, 0);
  const grandTotalTVA = factures.reduce((sum, f) => sum + f.totalTVA, 0);
  const grandTotalTTC = factures.reduce((sum, f) => sum + f.totalTTC, 0);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.companyName}>{companyName}</Text>
          {siret && <Text style={s.headerText}>SIRET : {siret}</Text>}
        </View>

        <Text style={s.title}>Journal des ventes</Text>
        <Text style={s.subtitle}>
          Période : {new Date(from).toLocaleDateString("fr-FR")} —{" "}
          {new Date(to).toLocaleDateString("fr-FR")}
          {" "}({factures.length} facture{factures.length > 1 ? "s" : ""} payée{factures.length > 1 ? "s" : ""})
        </Text>

        {factures.length === 0 ? (
          <Text style={s.emptyText}>Aucune facture payée sur cette période.</Text>
        ) : (
          <>
            {Array.from(quarters.entries()).map(([quarter, items]) => {
              const qHT = items.reduce((sum, f) => sum + f.totalHT, 0);
              const qTVA = items.reduce((sum, f) => sum + f.totalTVA, 0);
              const qTTC = items.reduce((sum, f) => sum + f.totalTTC, 0);
              return (
                <View key={quarter} wrap={false}>
                  <Text style={s.quarterTitle}>{quarter}</Text>
                  <View style={s.table}>
                    <View style={s.tableHeader}>
                      <Text style={[s.thText, s.colNum]}>Numéro</Text>
                      <Text style={[s.thText, s.colDate]}>Date</Text>
                      <Text style={[s.thText, s.colClient]}>Client</Text>
                      <Text style={[s.thText, s.colHT]}>HT</Text>
                      <Text style={[s.thText, s.colTVA]}>TVA</Text>
                      <Text style={[s.thText, s.colTTC]}>TTC</Text>
                    </View>
                    {items.map((f, idx) => (
                      <View style={s.tableRow} key={idx}>
                        <Text style={[s.tdText, s.colNum]}>{f.number}</Text>
                        <Text style={[s.tdText, s.colDate]}>
                          {new Date(f.date).toLocaleDateString("fr-FR")}
                        </Text>
                        <Text style={[s.tdText, s.colClient]}>{f.clientName}</Text>
                        <Text style={[s.tdText, s.colHT]}>{formatCurrency(f.totalHT)}</Text>
                        <Text style={[s.tdText, s.colTVA]}>{formatCurrency(f.totalTVA)}</Text>
                        <Text style={[s.tdText, s.colTTC]}>{formatCurrency(f.totalTTC)}</Text>
                      </View>
                    ))}
                    <View style={s.subtotalRow}>
                      <Text style={s.subtotalLabel}>Sous-total {quarter}</Text>
                      <Text style={s.subtotalValue}>{formatCurrency(qTTC)}</Text>
                    </View>
                  </View>
                </View>
              );
            })}

            <View style={s.totalsContainer}>
              <View style={s.totalsRow}>
                <Text style={s.totalsLabel}>Total HT</Text>
                <Text style={s.totalsValue}>{formatCurrency(grandTotalHT)}</Text>
              </View>
              <View style={s.totalsRow}>
                <Text style={s.totalsLabel}>Total TVA</Text>
                <Text style={s.totalsValue}>{formatCurrency(grandTotalTVA)}</Text>
              </View>
              <View style={s.totalsTTCRow}>
                <Text style={s.totalsTTCLabel}>Total TTC</Text>
                <Text style={s.totalsTTCValue}>{formatCurrency(grandTotalTTC)}</Text>
              </View>
            </View>
          </>
        )}

        <Text style={s.footer}>
          {companyName} — Journal des ventes — Généré par Facturoo
        </Text>
      </Page>
    </Document>
  );
}
