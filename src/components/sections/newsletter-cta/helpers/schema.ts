import { z } from 'zod';

import type { NewsletterFormSchema } from '../newsletter-cta.types';

export const newsletterFormSchema = z.object({
  email: z.email({ error: 'Invalid email' }),
});

export const newsletterDefaultValues: NewsletterFormSchema = {
  email: '',
};
