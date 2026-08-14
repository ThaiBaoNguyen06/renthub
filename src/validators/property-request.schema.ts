import {z} from "zod";

export const createPropertyRequestSchema = z.object({
    transactionType: z.enum(["rent"]),

    propertyType: z.enum([
    "apartment",
    "house",
    "villa",
    "studio",
    "office",
    "shop",
    "room",
    "townhouse",
  ]),

  title: z
    .string()
    .min(5, "Title must contain at least 5 characters")
    .max(160, "Title must not exceed 160 characters"),

    description: z.string().optional(),

    addressLine: z
        .string()
        .min(3, "Address is required"),

    ward: z.string().optional(),

    district: z
        .string()
        .min(1, "District is required"),

    city: z
        .string()
        .min(1, "City is required"),

    expectedPrice: z
        .number()
        .int()
        .positive("Expected price must be greater than 0"),

    pricePeriod: z
        .enum(["month"])
        .optional(),

    bedrooms: z
        .number()
        .int()
        .nonnegative()
        .optional(),

    bathrooms: z
        .number()
        .int()
        .nonnegative()
        .optional(),

    areaSqm: z
        .number()
        .int()
        .positive()
        .optional(),

    hostNotes: z.string().optional(),
})

export type CreatePropertyRequestInput = z.infer<typeof createPropertyRequestSchema>;