import { z } from 'zod';

export type FormJump = {
  notes: string;
  canopy: number;
  locale: string;
  time: `${number}:${number}`;
  date: `20${number}-${number}-${number}`;
};

export type ActionJump = {
  status: string;
  errors?: Partial<Record<keyof FormJump, Array<string>>>;
} & Partial<FormJump>;

export const JumpSchema = z.object({
  notes: z.string().optional(),
  locale: z.string({
    required_error: 'O local é obrigatório',
  }),
  canopy: z
    .string({
      required_error: 'O código é obrigatório.',
    })
    .min(2, 'Não existe velame nesse tamanho')
    .max(3, 'Não existe velame nesse tamanho')
    .regex(/^\d+$/, 'O tamanho deve ser um número')
    .transform(Number),
  time: z
    .string({
      required_error: 'A hora é obrigatória.',
    })
    .regex(/^\d{2,2}\:\d{2,2}$/, 'O formato da hora deve ser HH:MM'),
  date: z
    .string({
      required_error: 'A data é obrigatória.',
    })
    .regex(
      /^\d{2,2}\/\d{2,2}\/\d{4,4}$/,
      'O formato da data deve ser DD/MM/AAAA'
    ),
});

export function useSaveJump() {
  const handler = async (
    {}: ActionJump,
    formData: FormData
  ): Promise<ActionJump> => {
    const fields = JumpSchema.safeParse(Object.fromEntries(formData.entries()));

    console.log(Object.fromEntries(formData.entries()));

    if (!fields.success)
      return {
        status: 'error',
        errors: fields.error.flatten().fieldErrors,
        ...(fields.data ?? Object.fromEntries(formData.entries())),
      };

    const response = await fetch(`/saltos/api`, {
      body: JSON.stringify(fields.data),
      method: 'POST',
    });

    const payload = response.text();

    console.log(payload);

    return { status: 'success' };
  };

  return handler;
}
