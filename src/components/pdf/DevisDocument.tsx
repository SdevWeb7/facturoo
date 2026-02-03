import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { styles } from "./styles";
import { computeTotalsPerLine, formatCurrency } from "@/lib/utils";

interface DevisDocumentProps {
  devis: {
    number: string;
    date: Date;
    status: string;
    items: {
      designation: string;
      quantity: number;
      unitPrice: number;
      tvaRate: number; // centièmes (2000 = 20%)
      order: number;
    }[];
  };
  client: {
    name: string;
    email: string;
    address: string | null;
    addressComplement: string | null;
    postalCode: string | null;
    city: string | null;
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

export function DevisDocument({ devis, client, emitter }: DevisDocumentProps) {
  // Convert tvaRate from centièmes to percentage for computation
  const itemsWithPercentage = devis.items.map((item) => ({
    ...item,
    tvaRate: item.tvaRate / 100, // 2000 -> 20
  }));
  const totals = computeTotalsPerLine(itemsWithPercentage);
  const sortedTvaRates = Object.keys(totals.tvaByRate)
    .map(Number)
    .sort((a, b) => b - a);

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
            {client.addressComplement && (
              <Text style={styles.clientText}>{client.addressComplement}</Text>
            )}
            {(client.postalCode || client.city) && (
              <Text style={styles.clientText}>
                {[client.postalCode, client.city].filter(Boolean).join(" ")}
              </Text>
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
            <Text style={[styles.tableHeaderText, styles.colTva]}>
              TVA
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
                <Text style={[styles.tableCellText, styles.colTva]}>
                  {item.tvaRate / 100}%
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
          {sortedTvaRates.map((rate) => (
            <View style={styles.totalsRow} key={rate}>
              <Text style={styles.totalsLabel}>TVA {rate}%</Text>
              <Text style={styles.totalsValue}>
                {formatCurrency(totals.tvaByRate[rate])}
              </Text>
            </View>
          ))}
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
