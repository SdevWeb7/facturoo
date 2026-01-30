import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyRequestPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-primary/10 p-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Vérifiez votre boîte mail</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Un lien de connexion a été envoyé à votre adresse email.
          Cliquez sur le lien pour vous connecter.
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        Si vous ne recevez pas l&apos;email, vérifiez votre dossier spam.
      </p>

      <Button variant="outline" asChild className="w-full">
        <Link href="/login">Retour à la connexion</Link>
      </Button>
    </div>
  );
}
