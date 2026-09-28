'use server';

import { sendContactEmail } from '@/services/resend';

import { newsletterFormSchema } from '../helpers/schema';

export async function submitNewsletterForm(formData: FormData): Promise<{ error: string | null }> {
  try {
    const validation = newsletterFormSchema.safeParse(Object.fromEntries(formData));

    if (!validation.success) return { error: validation.error.issues[0]?.message || 'Validation error' };

    // i should use the `addNewsletterSubscriber` function here
    // but that requires paid plan in resend and im broke :)
    const mail = await sendContactEmail({
      ...validation.data,
      name: 'Newsletter Subscriber :)',
      subject: 'Newsletter Subscription',
      message: `This email subscribes to the newsletter.`,
    });

    if (mail.error) return { error: mail.error.message };

    return { error: null };
  } catch (error) {
    console.error('Error submitting newsletter form:', error);
    return { error: 'Server error. Please try again later.' };
  }
}
