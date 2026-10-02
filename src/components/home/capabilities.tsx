import { CapabilityStack } from '@/components/motion';
import { TextLink } from '@/components/ui';
import { getProject } from '@/content/projects';
import { capabilities } from '@/content/site';

import SectionHeading from './section-heading';

function resolveProof(slugs: string[]) {
  return slugs.map((slug) => {
    const project = getProject(slug);

    if (!project) throw new Error(`capabilities: unknown project slug "${slug}"`);

    return { slug, name: project.name };
  });
}

export default function Capabilities() {
  const items = capabilities.items.map((item) => ({ ...item, proof: resolveProof(item.proof) }));

  return (
    <CapabilityStack
      data={items.map((item) => ({ title: item.title, proof: item.proof.map(({ name }) => name) }))}
      heading={
        <SectionHeading
          id="capabilities-heading"
          eyebrow={capabilities.eyebrow}
          intro={capabilities.intro}
          introClassName="transition-colors duration-300 group-data-[locked]/caps:text-ink"
        >
          {capabilities.heading}
        </SectionHeading>
      }
    >
      <ul className="mt-8 grid gap-3 group-data-[stack=on]/caps:mt-5 group-data-[stack=on]/caps:grid-cols-1 group-data-[stack=on]/caps:gap-1.5 sm:grid-cols-2">
        {items.map((item, index) => (
          <li
            key={item.title}
            data-cap={index}
            className="border-rule bg-surface group/item ease-out-strong flex flex-col gap-1.5 rounded-xl border p-4 transition-[opacity,border-color] duration-300 group-data-[stack=on]/caps:gap-1 group-data-[stack=on]/caps:p-3 data-[active]:border-[color-mix(in_oklch,var(--accent)_35%,var(--rule))] data-[dim]:opacity-55"
          >
            <h3 className="font-display text-ink text-[1.0625rem] font-bold tracking-[-0.045em] group-data-[stack=on]/caps:text-base">
              {item.title}
            </h3>
            <p className="text-ink-muted text-[0.9375rem] leading-snug group-data-[stack=on]/caps:text-sm">
              {item.body}
            </p>
            <p className="text-ink-muted mt-1.5 text-sm group-data-[stack=on]/caps:mt-0.5 group-data-[stack=on]/caps:text-[0.8125rem]">
              {item.proof.map(({ slug, name }, proofIndex) => (
                <span key={slug}>
                  {proofIndex > 0 && ', '}
                  <TextLink
                    href={`/work/${slug}`}
                    className="group-data-[lit]/item:text-accent group-data-[lit]/item:decoration-accent"
                  >
                    {name}
                  </TextLink>
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </CapabilityStack>
  );
}
