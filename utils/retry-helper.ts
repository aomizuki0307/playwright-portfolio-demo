export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; delayMs?: number; label?: string } = {},
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000, label = 'operation' } = options;
  let lastError: Error = new Error('No attempts made');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `[Retry] ${label} failed (attempt ${attempt}/${maxRetries}): ${lastError.message}`,
      );
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError;
}
