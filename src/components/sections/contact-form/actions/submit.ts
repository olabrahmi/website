'use server';

import { sendContactEmail } from '@/services/resend';

import { contactFormSchema } from '../helpers/schema';

export async function submitContactForm(formData: FormData): Promise<{ error: string | null }> {
  try {
    const validation = contactFormSchema.safeParse(Object.fromEntries(formData));

    if (!validation.success) return { error: validation.error.issues[0]?.message || 'Validation error' };

    const mail = await sendContactEmail(validation.data);

    if (mail.error) return { error: mail.error.message };

    return { error: null };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { error: 'Server error. Please try again later.' };
  }
}
