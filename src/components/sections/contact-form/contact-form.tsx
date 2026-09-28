import ActualForm from './components/actual-form';
import type { ContactFormProps } from './contact-form.types';

export default function ContactFormSection({ title, ...formProps }: ContactFormProps) {
  return (
    <section className="relative container">
      {title && <h1 className="mb-4 font-sans text-2xl md:text-4xl">{title}</h1>}
      <ActualForm {...formProps} />
    </section>
  );
}
