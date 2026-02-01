import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { styles } from "./styles";
import { computeTotals, formatCurrency } from "@/lib/utils";

interface FactureDocumentProps {
  facture: {
    number: string;
    date: Date;
    tvaRate: number;
    items: {
      designation: string;
      quantity: number;
      unitPrice: number;
      order: number;
    }[];
  };
  client: {
    name: string;
    email: string;
    address: string | null;
  };
  emitter: {
    name: string | null;
    company: string | null;
    siret: string | null;
    address: string | null;
    phone: string | null;
    email: string;
    logoUrl?: string | null;
  };
}

export function FactureDocument({
  facture,
  client,
  emitter,
}: FactureDocumentProps) {
  const totals = computeTotals(facture.items, facture.tvaRate);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header: Emitter + Client */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {emitter.logoUrl && (
              <Image src={emitter.logoUrl} style={styles.logo} />
            )}
            <Text style={styles.companyName}>
              {emitter.company || emitter.name || "—"}
            </Text>
            {emitter.siret && (
              <Text style={styles.headerText}>SIRET : {emitter.siret}</Text>
            )}
            {emitter.address && (
              <Text style={styles.headerText}>{emitter.address}</Text>
            )}
            {emitter.phone && (
              <Text style={styles.headerText}>{emitter.phone}</Text>
            )}
            <Text style={styles.headerText}>{emitter.email}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.sectionTitle}>Client</Text>
            <Text style={styles.clientName}>{client.name}</Text>
            <Text style={styles.clientText}>{client.email}</Text>
            {client.address && (
              <Text style={styles.clientText}>{client.address}</Text>
            )}
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Facture {facture.number}</Text>
        <Text style={styles.subtitle}>
          Date : {new Date(facture.date).toLocaleDateString("fr-FR")}
        </Text>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDesignation]}>
              Désignation
            </Text>
            <Text style={[styles.tableHeaderText, styles.colQuantity]}>
              Qté
            </Text>
            <Text style={[styles.tableHeaderText, styles.colUnitPrice]}>
              P.U. HT
            </Text>
            <Text style={[styles.tableHeaderText, styles.colTotal]}>
              Total HT
            </Text>
          </View>
          {facture.items
            .sort((a, b) => a.order - b.order)
            .map((item, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={[styles.tableCellText, styles.colDesignation]}>
                  {item.designation}
                </Text>
                <Text style={[styles.tableCellText, styles.colQuantity]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCellText, styles.colUnitPrice]}>
                  {formatCurrency(item.unitPrice)}
                </Text>
                <Text style={[styles.tableCellText, styles.colTotal]}>
                  {formatCurrency(Math.round(item.quantity * item.unitPrice))}
                </Text>
              </View>
            ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Total HT</Text>
            <Text style={styles.totalsValue}>
              {formatCurrency(totals.totalHT)}
            </Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>TVA ({facture.tvaRate}%)</Text>
            <Text style={styles.totalsValue}>
              {formatCurrency(totals.totalTVA)}
            </Text>
          </View>
          <View style={styles.totalsTTCRow}>
            <Text style={styles.totalsTTCLabel}>Total TTC</Text>
            <Text style={styles.totalsTTCValue}>
              {formatCurrency(totals.totalTTC)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {emitter.company || emitter.name} — Facture {facture.number} — Généré
          par Facturoo
        </Text>
      </Page>
    </Document>
  );
}
