import { allProjects } from '@/content/projects';
import { capabilities, description, faq, person, siteUrl, socials } from '@/content/site';

export const dynamic = 'force-static';

export function GET() {
  const lines = [
    `# ${person.name}`,
    '',
    `> ${description}`,
    '',
    `Based in ${person.location}. Email: ${person.email}. Open to full-time roles and freelance projects, remote.`,
    '',
    '## What I do',
    ...capabilities.items.map((item) => `- ${item.title}: ${item.body}`),
    '',
    '## Case studies',
    ...allProjects.map((project) => `- [${project.title}](${siteUrl}/work/${project.slug}): ${project.card.summary}`),
    '',
    '## Questions',
    ...faq.items.flatMap((item) => [`### ${item.question}`, item.answer, '']),
    '## Profiles',
    ...socials.map((social) => `- [${social.label}](${social.href})`),
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
