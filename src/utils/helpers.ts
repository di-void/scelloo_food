import * as z from "zod";

export function formatZodError<T>(error: z.ZodError<T>) {
  return error.issues.map(({ message, path }) => ({ message, path }));
}
