import { z } from "zod";

export const createUserSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(30),
        password: z.string().min(8).max(50)
    })
});

export const updateUserSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(30).optional(),
    }),
    params: z.object({
        id: z.string()
    })
});