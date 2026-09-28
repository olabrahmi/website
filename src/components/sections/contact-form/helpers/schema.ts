import { z } from 'zod';

import type { ContactFormSchema } from '../contact-form.types';

export const contactFormSchema = z.object({
  name: z.string().min(3, { error: 'Name is too short' }).max(32, { error: 'Name is too long' }),
  email: z.email({ error: 'Invalid email' }),
  subject: z.string().min(5, { error: 'Subject is too short' }).max(64, { error: 'Subject is too long' }),
  message: z.string().min(10, { error: 'Message is too short' }).max(512, { error: 'Message is too long' }),
});

export const contactDefaultValues: ContactFormSchema = {
  name: '',
  email: '',
  subject: '',
  message: '',
};
