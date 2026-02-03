import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: "contain",
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  headerText: {
    fontSize: 9,
    color: "#555",
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#555",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  clientName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  clientText: {
    fontSize: 9,
    color: "#555",
    marginBottom: 2,
  },
  // Table
  table: {
    marginTop: 10,
  },
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
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  colDesignation: {
    flex: 4,
  },
  colQuantity: {
    flex: 1,
    textAlign: "right",
  },
  colUnitPrice: {
    flex: 2,
    textAlign: "right",
  },
  colTva: {
    flex: 1,
    textAlign: "right",
  },
  colTotal: {
    flex: 2,
    textAlign: "right",
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#6b7280",
  },
  tableCellText: {
    fontSize: 9,
  },
  // Totals
  totalsContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalsRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalsLabel: {
    fontSize: 10,
    color: "#555",
  },
  totalsValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  totalsTTCRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
    marginTop: 4,
  },
  totalsTTCLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  totalsTTCValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
  },
});
