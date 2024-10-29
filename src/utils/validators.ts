import * as z from "zod";

export const User = z.object({
  name: z.string().min(1),
  email: z.string().min(1).email(),
});
export type UserType = z.infer<typeof User>;

const StringToNum = z
  .string()
  .min(1)
  .transform((val, ctx) => {
    const parsed = parseInt(val);

    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Not a number",
      });

      return z.NEVER;
    }

    return parsed;
  });

export const UserParams = z.object({
  userId: StringToNum,
});
export type UserParamsType = z.infer<typeof UserParams>;
