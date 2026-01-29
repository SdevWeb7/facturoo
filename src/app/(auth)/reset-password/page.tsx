"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { resetPassword } from "@/actions/auth";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, action, pending] = useActionState(resetPassword, null);

  if (state?.success) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold">Mot de passe modifié</h1>
        <p className="text-sm text-gray-600">
          Votre mot de passe a été réinitialisé avec succès.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold">Lien invalide</h1>
        <p className="text-sm text-gray-600">
          Ce lien de réinitialisation est invalide ou a expiré.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Nouveau mot de passe</h1>
        <p className="mt-2 text-sm text-gray-600">
          Choisissez votre nouveau mot de passe
        </p>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="token" value={token} />

        {state?.success === false && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </p>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Nouveau mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">8 caractères minimum</p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {pending ? "Modification..." : "Modifier le mot de passe"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center text-sm text-gray-500">Chargement...</div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
