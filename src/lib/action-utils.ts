import type { ZodError } from "zod";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export function actionError(message: string): ActionResult<never> {
  return { success: false, error: message };
}

export function actionSuccess<T = void>(data?: T): ActionResult<T> {
  return { success: true, data: data as T };
}

export function zodErrorMessage(error: ZodError): string {
  try {
    const issues = JSON.parse(error.message) as { message: string }[];
    return issues[0]?.message ?? "Données invalides";
  } catch {
    return error.message || "Données invalides";
  }
}
