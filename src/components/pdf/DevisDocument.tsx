import { Document, Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import { computeTotals, formatCurrency } from "@/lib/utils";

interface DevisDocumentProps {
  devis: {
    number: string;
    date: Date;
    tvaRate: number;
    status: string;
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
  };
}

export function DevisDocument({ devis, client, emitter }: DevisDocumentProps) {
  const totals = computeTotals(devis.items, devis.tvaRate);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header: Emitter + Client */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
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
        <Text style={styles.title}>Devis {devis.number}</Text>
        <Text style={styles.subtitle}>
          Date : {new Date(devis.date).toLocaleDateString("fr-FR")}
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
          {devis.items
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
            <Text style={styles.totalsLabel}>TVA ({devis.tvaRate}%)</Text>
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
          {emitter.company || emitter.name} — Devis {devis.number} — Généré par
          Facturoo
        </Text>
      </Page>
    </Document>
  );
}
