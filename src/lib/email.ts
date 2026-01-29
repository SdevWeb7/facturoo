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

interface SendDocumentEmailParams {
  to: string;
  subject: string;
  text: string;
  pdfBuffer: Buffer;
  pdfFilename: string;
}

export async function sendDocumentEmail({
  to,
  subject,
  text,
  pdfBuffer,
  pdfFilename,
}: SendDocumentEmailParams) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@facturoo.fr",
    to,
    subject,
    text,
    attachments: [
      {
        filename: pdfFilename,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
