import { z } from "zod";

export const EnquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[0-9+-\s]{10,}$/, "Invalid phone number"), // Basic validation
  trip_id: z.string().uuid("Please select a trip"),
  group_type: z.enum(["solo", "friends", "couple", "family"]),
  preferred_month: z.string().min(1, "Required"),
  message: z.string().min(10, "Please tell us a bit more"),
});

export type EnquiryFormValues = z.infer<typeof EnquirySchema>;
