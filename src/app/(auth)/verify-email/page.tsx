import Link from "next/link";
import { redirect } from "next/navigation";
import { XCircle } from "lucide-react";
import { verifyEmail } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { VerificationSuccess } from "./VerificationSuccess";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/login");
  }

  const result = await verifyEmail(token);

  if (result.success) {
    return <VerificationSuccess />;
  }

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Lien invalide</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {result.error || "Ce lien de vérification est invalide ou a expiré."}
        </p>
      </div>

      <div className="space-y-3">
        <Button asChild variant="outline" className="w-full">
          <Link href="/verification-pending">Renvoyer un email</Link>
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link href="/login">Retour à la connexion</Link>
        </Button>
      </div>
    </div>
  );
}
