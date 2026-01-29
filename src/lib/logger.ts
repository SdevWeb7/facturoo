export function logAction(
  action: string,
  userId: string,
  meta?: Record<string, unknown>
) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      action,
      userId,
      ...meta,
    })
  );
}
