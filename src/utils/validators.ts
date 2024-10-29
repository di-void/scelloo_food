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

const StringToFloatNum = z
  .string()
  .min(1)
  .transform((val, ctx) => {
    const parsed = parseFloat(val);

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

const OrderStatus = z.enum(["pending", "completed", "cancelled"]);
export type OrderStatusType = z.infer<typeof OrderStatus>;

export const FoodItem = z.object({
  id: z.string().uuid(),
  quantity: z.number().positive().min(1),
});
export type FoodItemType = z.infer<typeof FoodItem>;

export const OrderInput = z.object({
  userId: z.number().positive().min(1),
  items: z.array(FoodItem).nonempty(),
});
export type OrderInputType = z.infer<typeof OrderInput>;

export const Order = z.object({
  id: z.string().uuid(),
  status: OrderStatus,
  totalPrice: StringToFloatNum,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type OrderType = z.infer<typeof Order>;

export const OrderStatusInput = z.object({
  status: OrderStatus,
});
export type OrderStatusInputType = z.infer<typeof OrderStatusInput>;

export const OrderParams = z.object({
  orderId: z.string().uuid(),
});
export type OrderParamsType = z.infer<typeof OrderParams>;
