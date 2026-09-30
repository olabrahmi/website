"""Builds oussama-labrahmi-cv.pdf (ReportLab, same library and layout as the original).

    pip3 install --user reportlab
    python3 private/cv/build_cv.py

Content mirrors the website (src/content): every project, number and keyword on the case study pages is here.
Edit the text below, run the script, and the PDF in this folder is replaced. /api/cv serves it.
"""

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer

OUT = Path(__file__).with_name('oussama-labrahmi-cv.pdf')

INK = HexColor('#1a1a1a')
BLUE = HexColor('#1f4fd1')
GREY = HexColor('#555555')
RULE = HexColor('#d0d7e6')
MARGIN = 51.4

name_style = ParagraphStyle('name', fontName='Helvetica-Bold', fontSize=20, leading=24, textColor=INK, spaceAfter=2)
role_style = ParagraphStyle('role', fontName='Helvetica', fontSize=11, leading=14, textColor=BLUE, spaceAfter=3.9)
contact_style = ParagraphStyle('contact', fontName='Helvetica', fontSize=8.5, leading=11, textColor=GREY)
section_style = ParagraphStyle('section', fontName='Helvetica-Bold', fontSize=10.5, leading=13, textColor=BLUE, spaceBefore=10, spaceAfter=2.5)
body_style = ParagraphStyle('body', fontName='Helvetica', fontSize=9, leading=12.2, textColor=INK)
job_style = ParagraphStyle('job', fontName='Helvetica-Bold', fontSize=9.8, leading=12.5, textColor=INK, spaceBefore=4, spaceAfter=0)
meta_style = ParagraphStyle('meta', fontName='Helvetica', fontSize=8.5, leading=12.5, textColor=GREY, spaceAfter=0)
bullet_style = ParagraphStyle(
    'bullet', parent=body_style, leftIndent=10, bulletIndent=0, bulletFontName='ZapfDingbats', bulletFontSize=7,
    spaceAfter=0,
)


def link(url, text):
    return f'<a href="{url}" color="#1f4fd1"><u>{text}</u></a>'


def bullet(text):
    return Paragraph(text, bullet_style, bulletText='\u25cf')


def section(title):
    return [Paragraph(title, section_style), HRFlowable(width='100%', thickness=0.6, color=RULE, spaceBefore=1, spaceAfter=3.5)]


story = []

# ── Header ────────────────────────────────────────────────────────────────────
story += [
    Paragraph('Oussama Labrahmi', name_style),
    Paragraph('Senior Product Engineer · Web platforms and AI agent workflows', role_style),
    Paragraph(
        'Remote, CET hours · Casablanca Metropolitan Area, Morocco · oussama@labrahmi.me · +212 6 91 04 14 74 · '
        + link('https://www.linkedin.com/in/olabrahmi/', 'linkedin.com/in/olabrahmi')
        + ' · '
        + link('https://www.labrahmi.me/', 'labrahmi.me'),
        contact_style,
    ),
]

# ── Summary ───────────────────────────────────────────────────────────────────
story += section('SUMMARY')
story.append(
    Paragraph(
        'Six years shipping production web platforms for enterprise and startup clients, including PAYBACK, Takeda and '
        'Descope. Self-taught since age 10, and I grew my skills and network at 1337 in Khouribga. I own features end to '
        'end: architecture, tests, monitoring and on-call. Now building AI agents that answer hotel guests and open '
        'tested pull requests, with the same rules: guardrails, human review, and measured results. Open to Applied AI '
        'and senior product roles, remote (CET).',
        body_style,
    )
)

# ── AI work ───────────────────────────────────────────────────────────────────
story += section('AI WORK')
blocks = [
    (
        'Shaza · AI booking agent for hotels',
        '2026 · Own product, sold to hotels · Solo, end to end',
        [
            'AI agent that answers hotel guests on WhatsApp, Booking.com, Airbnb and email, checks live availability '
            "with the hotel's channel manager, and books the room. <b>20+</b> confirmed reservations, <b>81%</b> "
            'conversation-to-booking rate, <b>3</b> hotels in Morocco.',
            "Self-hosted n8n workflow: messages in from every channel, tool calls to the channel manager, reply and "
            'reservation out. A system prompt per hotel encodes rooms, prices, policies, what to confirm before booking '
            'and when to hand off to staff.',
            'Split models for cost: Claude Sonnet for reasoning and tool calls, Claude Haiku for guest-facing replies. '
            'Availability always comes from the channel manager, never from the model.',
            'Next.js admin dashboard for hotel staff (Drizzle, Neon Postgres).',
        ],
    ),
    (
        'Maya · coding agent pipeline',
        '2026 · Personal project · Solo',
        [
            'Turns Linear tickets into tested pull requests: Linear webhook into a BullMQ queue on Redis (one job per '
            'ticket), a fresh git worktree per ticket, headless Claude Code as the agent, a lint and test retry loop, '
            'PR via GitHub CLI. Run on <b>50+</b> real tickets.',
            'Human approval built in: the agent can open PRs but never merge. Linear status updates, and Telegram '
            'reports of completion, failures and cost on every run.',
            'Runs Claude Code and local models (Qwen on Ollama) as a cheaper option on the same pipeline.',
        ],
    ),
]
for title, meta, items in blocks:
    story.append(KeepTogether([Paragraph(title, job_style), Paragraph(meta, meta_style), Spacer(1, 0.6), bullet(items[0])]))
    story += [bullet(i) for i in items[1:]]

# ── Experience ────────────────────────────────────────────────────────────────
story += section('EXPERIENCE')

story.append(
    KeepTogether(
        [
            Paragraph('Senior Frontend Developer · iMedia24, client PAYBACK', job_style),
            Paragraph('Aug 2025 – Present · Remote · Team across Germany, Poland and Morocco', meta_style),
            Spacer(1, 0.6),
            bullet(
                'Frontend owner of '
                + link('https://www.payback.de', 'PAYBACK')
                + "'s enrollment (sign-up) flow, a priority 1 feature used by <b>1.1M+</b> visitors a month and relied on "
                'by partners including American Express, dm, EDEKA and Aral. Designed and coded it from scratch with the '
                'team in Next.js and MUI.'
            ),
        ]
    )
)
story += [
    bullet(
        "Members pick their card and partners in one flow. Emails are validated against other teams' services and "
        "addresses before submit. The request goes to my team's backend, with error handling and circuit breakers so a "
        'failing service cannot take sign-up down.'
    ),
    bullet(
        'Micro-frontends: each team owns its slice in its own NX monorepo. Content in PayloadCMS, infra on GCP with '
        'Terraform.'
    ),
    bullet(
        '<b>100%</b> test coverage: Playwright end-to-end tests on every path, Vitest for logic, strict code review. '
        'Datadog SLOs and synthetic checks on login and sign-up.'
    ),
    bullet(
        '24/7 on-call one week every month: I respond to production incidents at any hour. Coach backend teammates so '
        'they ship frontend changes too.'
    ),
]

story.append(
    KeepTogether(
        [
            Paragraph('Frontend Developer · Bejamas', job_style),
            Paragraph('Jan 2023 – Jul 2025 · Remote (Warsaw)', meta_style),
            Spacer(1, 0.6),
            bullet(
                '<b>Descope</b> (led the frontend, 2023–2025): four sites, all static and editable by marketing without a '
                'developer. '
                + link('https://www.descope.com', 'descope.com')
                + ': full redesign and move to a headless CMS (Next.js, CSS Modules, Contentful, Vercel), content migrated '
                'with SEO intact, Core Web Vitals passing on mobile and desktop. '
                + link('https://docs.descope.com', 'docs.descope.com')
                + ': <b>1,500+</b> static pages on Fumadocs covering <b>20+</b> SDKs. '
                + link('https://globalmcphackathon.com', 'globalmcphackathon.com')
                + ': global MCP hackathon for AI developers (San Francisco and Tel Aviv), live within weeks on fixed '
                'dates, CMS reused for later editions. '
                + link('https://www.descope.ai', 'descope.ai')
                + ': Next.js, Contentful, Tailwind and Lottie, green on PageSpeed Insights.'
            ),
        ]
    )
)
story += [
    bullet(
        '<b>Charm Industrial</b> (led the frontend, 2023–2025): rewrote '
        + link('https://charmindustrial.com', 'charmindustrial.com')
        + ' from Gatsby to Next.js (Tailwind, Framer Motion, Storyblok, Vercel): <b>3X</b> faster page loads, <b>+86%</b> '
        'performance, <b>30%</b> lift in conversions. <b>100k+</b> monthly visitors, <b>99.9%</b> uptime, hundreds of '
        'thousands of dollars a month through Stripe. Built a private factory dashboard streaming live Verkada camera '
        'feeds (Next.js, Express on Render, HLS).'
    ),
    bullet(
        '<b>Takeda</b> (Mar 2023 – Jan 2025): one of <b>30+</b> engineers rebuilding '
        + link('https://www.takeda.com', 'takeda.com')
        + ' (<b>2M+</b> monthly visitors) from PHP to Next.js, Tailwind and Sanity on Vercel, with <b>100+</b> reusable '
        'sections that editors assemble pages from.'
    ),
    bullet(
        '<b>o1Labs</b> (Feb 2024 – Apr 2025): rebuilt '
        + link('https://www.o1labs.org', 'o1labs.org')
        + ' as a page builder on Next.js, Sanity, Algolia and Vercel: <b>50+</b> reusable sections with live preview, '
        'product pages, the blog moved off Medium with Algolia search, and on-demand revalidation so publishing is '
        'instant. <b>0</b> dev tickets to publish a page.'
    ),
    bullet('Wrote documentation for the components and sections I built on every project.'),
]

story.append(
    KeepTogether(
        [
            Paragraph('Stakeholder and Technical Advisor · Dali', job_style),
            Paragraph('2026 – Present', meta_style),
            Spacer(1, 0.6),
            bullet(
                'Stakeholder and technical advisor on a toolkit for content creators: AI content ideas, contract and '
                'invoice generation, and brand payments (Next.js, PostgreSQL, Prisma).'
            ),
        ]
    )
)

story.append(
    KeepTogether(
        [
            Paragraph('Freelance · Akasec, 1337 Khouribga', job_style),
            Paragraph('2023 – 2025 · Solo, full stack · 3 editions', meta_style),
            Spacer(1, 0.6),
            bullet(
                "Build the site for Cyber Odyssey, Morocco's largest yearly cybersecurity event, from scratch every year: "
                '<b>3</b> editions, <b>3,000+</b> attendees across all editions. '
                + link('https://cyberodyssey.akasec.ma', 'cyberodyssey.akasec.ma')
                + ' has speakers and an agenda that updates live. Ticketing sends an emailed ticket link with a '
                'downloadable QR code (Neon Postgres), and a volunteer check-in app scans it and shows visitor, speaker, '
                'guest or organizer.'
            ),
        ]
    )
)
story += [
    bullet(
        'Rate limits on sign-up requests, for a security-savvy audience. Built '
        + link('https://akasec.club', 'akasec.club')
        + ", the club's site, with Next.js and GSAP."
    )
]

story.append(
    KeepTogether(
        [
            Paragraph('Earlier', job_style),
            bullet(
                '<b>Lead Frontend Developer, WebMastry</b> (2022): Next.js and TypeScript frontends, a NestJS/Prisma REST '
                'API, mentoring.'
            ),
        ]
    )
)
story += [
    bullet(
        '<b>Frontend Developer, Pickmeup</b> (2022, remote for Los Angeles): rewrote the main site in Next.js, built a '
        'rider admin dashboard.'
    ),
    bullet('<b>Founder, MediaEthic</b> (2020–2021): small studio building client products in React and NestJS.'),
]

# ── Skills ────────────────────────────────────────────────────────────────────
story += section('SKILLS')
skills = [
    ('AI', 'Claude Code, Claude Sonnet, Claude Haiku, Cursor, n8n, Ollama (local LLMs such as Qwen), agentic coding pipelines, prompt and context engineering, human-in-the-loop design'),
    ('Frontend', 'TypeScript, React, Next.js, MUI, Tailwind, CSS Modules, Framer Motion, GSAP, Lottie, NX, micro-frontends'),
    ('Backend', 'Node.js, Express, NestJS, PostgreSQL (Neon), Prisma, Drizzle, Redis, BullMQ, Stripe'),
    ('Infra and quality', 'GCP, Terraform, Vercel, Render, Cloudflare, Datadog (SLOs, synthetics), Playwright, Vitest'),
    ('CMS and content', 'PayloadCMS, Sanity, Contentful, Storyblok, Fumadocs, Algolia'),
]
story += [bullet(f'<b>{label}:</b> {text}') for label, text in skills]

# ── Education ─────────────────────────────────────────────────────────────────
story += section('EDUCATION')
story.append(
    Paragraph('<b>Computer Science</b> · 1337 (42 Network), Khouribga, Morocco · 2021 – 2023', body_style)
)

doc = SimpleDocTemplate(
    str(OUT),
    pagesize=A4,
    # SimpleDocTemplate frames carry 6pt of padding; take it off so text lands on the original 51.4pt margin.
    leftMargin=MARGIN - 6,
    rightMargin=MARGIN - 6,
    topMargin=39.7,
    bottomMargin=44,
    title='Oussama Labrahmi Resume',
    author='Oussama Labrahmi',
)
doc.build(story)
print(f'wrote {OUT} ({OUT.stat().st_size} bytes)')
