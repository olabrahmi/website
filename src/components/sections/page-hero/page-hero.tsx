import { Button } from '@/components/elements/button';

import type { PageHeroProps } from './page-hero.types';

export default function PageHero({ title, description, buttons }: PageHeroProps) {
  return (
    <section className="relative w-full pt-32 pb-4 md:pt-40">
      <div className="container">
        <h1 className="gradient-title text-3xl max-md:mb-2 md:text-4xl md:leading-[75px]">{title}</h1>
        <p className="text-sm font-light text-zinc-300 md:max-w-[80%]">{description}</p>
        {Array.isArray(buttons) && (
          <div className="mt-4 flex w-full items-center gap-2 md:mt-6">
            {buttons.map((button, index) => (
              <Button key={index} {...button} />
            ))}
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute -top-20 right-0 bottom-0 left-0 z-[-1] rotate-180 bg-[linear-gradient(to_right,#fafafa_1px,transparent_1px),linear-gradient(to_bottom,#fafafa_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:4.03rem_4.1rem] opacity-5" />
    </section>
  );
}
