"use server";

import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-utils";

const MAX_SIZE = 2 * 1024 * 1024; // 2 Mo
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function uploadLogo(formData: FormData): Promise<ActionResult<string>> {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user?.id) {
    return actionError("Non authentifié");
  }

  const file = formData.get("logo") as File | null;
  if (!file || file.size === 0) {
    return actionError("Aucun fichier sélectionné");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return actionError("Format non supporté. Utilisez PNG, JPG ou WebP.");
  }

  if (file.size > MAX_SIZE) {
    return actionError("Le fichier dépasse 2 Mo.");
  }

  // Delete old logo if exists
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  });

  if (user?.image) {
    try {
      await del(user.image);
    } catch {
      // Ignore deletion errors for old blobs
    }
  }

  const blob = await put(`logos/${session.user.id}/${file.name}`, file, {
    access: "public",
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: blob.url },
  });

  return actionSuccess(blob.url);
}

export async function deleteLogo(): Promise<ActionResult> {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user?.id) {
    return actionError("Non authentifié");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  });

  if (user?.image) {
    try {
      await del(user.image);
    } catch {
      // Ignore deletion errors
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: null },
  });

  return actionSuccess();
}
