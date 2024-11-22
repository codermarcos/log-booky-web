import { z } from 'zod';

export const LoginSchema = z.object({
    email: z
        .string({
            required_error: "Email é obrigatório."
        })
        .email('Email invalido'),
    password: z
        .string({
            required_error: "Senha é obrigatória"
        })
        .min(6, 'Senha deve conter no minimo 6 caracteres')
        .regex(/(?=.*[a-z])(?=.*[A-Z])/, 'Senha deve conter letras maiuscolas e minuscolas')
        .regex(/(?=.*[0-9])/, 'Senha deve conter ao menos um numero')
});