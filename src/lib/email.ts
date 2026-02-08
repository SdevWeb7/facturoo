import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(options: nodemailer.SendMailOptions) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM || "Facturoo <support@facturoo.app>",
    ...options,
  });
}

interface SendDocumentEmailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
  pdfBuffer: Buffer;
  pdfFilename: string;
}

export async function sendDocumentEmail({
  to,
  subject,
  text,
  html,
  pdfBuffer,
  pdfFilename,
}: SendDocumentEmailParams) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "Facturoo <support@facturoo.app>",
    to,
    subject,
    text,
    html,
    attachments: [
      {
        filename: pdfFilename,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}

export function buildDocumentEmailHtml({
  clientName,
  documentType,
  documentNumber,
  senderName,
}: {
  clientName: string;
  documentType: "devis" | "facture";
  documentNumber: string;
  senderName: string;
}) {
  const article = documentType === "devis" ? "le devis" : "la facture";
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="background:#ffffff;border-radius:8px;padding:32px;border:1px solid #e4e4e7;">
      <h2 style="color:#18181b;margin:0 0 24px;font-size:22px;">Facturoo</h2>
      <p style="color:#27272a;font-size:15px;line-height:1.6;margin:0 0 16px;">Bonjour ${clientName},</p>
      <p style="color:#27272a;font-size:15px;line-height:1.6;margin:0 0 16px;">Veuillez trouver ci-joint ${article} <strong>${documentNumber}</strong>.</p>
      <p style="color:#27272a;font-size:15px;line-height:1.6;margin:0 0 16px;">N'hésitez pas à nous contacter pour toute question.</p>
      <p style="color:#27272a;font-size:15px;line-height:1.6;margin:0;">Cordialement,<br/><strong>${senderName}</strong></p>
    </div>
    <p style="text-align:center;color:#a1a1aa;font-size:12px;margin:24px 0 0;">Envoyé via <a href="https://facturoo.app" style="color:#a1a1aa;text-decoration:underline;">Facturoo</a></p>
  </div>
</body>
</html>`;
}
