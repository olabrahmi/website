import type { VariantProps } from 'class-variance-authority';

import type { textareaVariants } from './textarea';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {}
