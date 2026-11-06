import type { Note } from '../types';

const aiJobsJevonsParadox: Note = {
  slug: 'ai-jobs-jevons-paradox',
  title: 'AI can make more jobs than it destroys',
  teaser: 'why AI is making more jobs than it destroys',
  description:
    'Jevons Paradox explains why cheaper AI can create more work, not less. What radiology and the 2026 software job market show, and why juniors still get hurt.',
  shortAnswer:
    "AI makes work like reading scans and writing code cheaper. When work gets cheaper, people usually ask for more of it. That's Jevons Paradox. It's why radiologists are still in short supply, and why software openings can rise during layoffs. But the new jobs aren't always the same jobs, and juniors are paying for that.",
  published: '2026-11-06',
  updated: '2026-11-06',
  topic: 'AI and work',
  cover: {
    src: '/notes/ai-jobs-jevons-paradox-cover.webp',
    alt: 'A field of dots that starts sparse on the left and gets dense on the right, crossed by a falling cost line and a rising demand line.',
  },
  keywords: [
    'Jevons Paradox',
    'AI jobs',
    'will AI replace developers',
    'AI layoffs 2026',
    'junior developer jobs',
    'radiologists and AI',
  ],
  about: [
    { name: 'Jevons paradox', sameAs: 'https://en.wikipedia.org/wiki/Jevons_paradox' },
    { name: 'Artificial intelligence', sameAs: 'https://en.wikipedia.org/wiki/Artificial_intelligence' },
    { name: 'Software development', sameAs: 'https://en.wikipedia.org/wiki/Software_development' },
  ],
  faq: [
    {
      question: 'What is Jevons Paradox?',
      answer:
        'Jevons Paradox is when making something cheaper or more efficient raises its total use instead of lowering it. William Stanley Jevons described it in 1865, after better steam engines led Britain to burn more coal.',
    },
    {
      question: 'Did AI replace radiologists?',
      answer:
        'No. AI reads some scans very well, but the US still has too few radiologists. Scan volumes keep growing, and someone still has to check results, sign reports and talk to patients.',
    },
    {
      question: 'Will AI replace software developers?',
      answer:
        "Not the whole job, in my view. AI writes more of the code, and cheaper code means more projects. The work moves toward deciding what to build and checking that it's right.",
    },
    {
      question: 'Why are there tech layoffs if software job openings are up?',
      answer:
        'They are different jobs. Openings are growing for senior engineers and AI work, while entry-level postings fall. Companies are also moving money from salaries to AI tools and servers, so they cut and hire together.',
    },
    {
      question: 'Are junior developers hit hardest by AI?',
      answer:
        'So far, yes. A Stanford study found developers aged 22 to 25 had about 20% fewer jobs in July 2025 than at their late 2022 peak, while older workers held up.',
    },
  ],
  sources: [
    {
      label: 'Hinton acknowledges mistake in predicting AI replacement of radiologists',
      publisher: 'AuntMinnie',
      href: 'https://www.auntminnie.com/imaging-informatics/artificial-intelligence/article/15746014/hinton-acknowledges-mistake-in-predicting-ai-replacement-of-radiologists',
    },
    {
      label: 'AI-supported mammography screening in the MASAI trial',
      publisher: 'The Lancet Oncology, via PubMed',
      href: 'https://pubmed.ncbi.nlm.nih.gov/37541274/',
    },
    {
      label: 'Current radiologist shortage projected to persist to 2055',
      publisher: 'HealthDay',
      href: 'https://www.healthday.com/healthpro-news/public-health/current-radiologist-shortage-projected-to-persist-to-2055',
    },
    {
      label: 'AI was supposed to replace radiologists, but now they are in more demand than ever',
      publisher: 'WPVI',
      href: 'https://6abc.com/post/ai-was-supposed-replace-radiologists-now-more-demand-heres/20000210/',
    },
    {
      label: 'Jevons paradox',
      publisher: 'Wikipedia',
      href: 'https://en.wikipedia.org/wiki/Jevons_paradox',
    },
    {
      label: 'March 2026 job cuts report',
      publisher: 'Challenger, Gray & Christmas',
      href: 'https://www.challengergray.com/blog/challenger-report-march-cuts-rise-25-from-february-ai-leads-reasons/',
    },
    {
      label: 'July 2026 job cuts report',
      publisher: 'Challenger, Gray & Christmas',
      href: 'https://www.challengergray.com/blog/challenger-report-layoffs-fall-hiring-picks-up-ai-leads-for-fifth-straight-month/',
    },
    {
      label: 'AI remains top reason for US job cuts in May',
      publisher: 'Fox Business',
      href: 'https://foxbusiness.com/economy/ai-remains-top-reason-us-job-cuts-third-straight-month-employers-axed-97000-workers-may',
    },
    {
      label: "AI isn't killing software jobs: TrueUp openings data",
      publisher: 'Business Insider',
      href: 'https://www.businessinsider.com/ai-isnt-killing-software-coding-jobs-booming-trueup-2026-4',
    },
    {
      label: 'AI and job postings: from destruction to creation?',
      publisher: 'Indeed Hiring Lab',
      href: 'https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/',
    },
    {
      label: 'The labor market is tilting toward seniority',
      publisher: 'Indeed Hiring Lab',
      href: 'https://hiringlab.indeed.com/2026/07/23/the-labor-market-is-tilting-toward-seniority/',
    },
    {
      label: 'Canaries in the Coal Mine? Six facts about the recent employment effects of AI',
      publisher: 'Stanford Digital Economy Lab',
      href: 'https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/',
    },
    {
      label: "Yes, AI is affecting employment. Here's the data",
      publisher: 'ADP Research',
      href: 'https://www.adpresearch.com/yes-ai-is-affecting-employment-heres-the-data',
    },
  ],
};

/** Newest first. To add a note: an entry here, plus src/content/notes/<slug>.mdx. */
export const allNotes: Note[] = [aiJobsJevonsParadox].sort((a, b) => b.published.localeCompare(a.published));

export const latestNote = allNotes[0];

export const getNote = (slug: string) => allNotes.find((note) => note.slug === slug);
