import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MarketVibe Research Library: AI Business Ideas and Validation Guides',
  description: 'Browse MarketVibe research guides for AI business ideas, niche validation, automation opportunities, market research, and startup idea validation.',
  alternates: { canonical: '/research' },
};

const researchPages = [
  {
    href: '/ai-business-ideas',
    title: 'AI Business Ideas',
    description: 'How to find AI opportunities with clear buyers, urgency, current spending, and room to grow.',
  },
  {
    href: '/niche-validation',
    title: 'Niche Validation',
    description: 'A practical framework for checking buyer pain, demand, competition, and reachability before building.',
  },
  {
    href: '/ai-automation-ideas',
    title: 'AI Automation Ideas',
    description: 'Workflow-first automation ideas for agencies, local services, sales teams, creators, and operators.',
  },
  {
    href: '/market-research-tools',
    title: 'Market Research Tools',
    description: 'How to combine search data, reviews, competitor pages, communities, and pricing signals.',
  },
  {
    href: '/startup-idea-validation',
    title: 'Startup Idea Validation',
    description: 'Validate startup assumptions with interviews, landing pages, manual tests, and willingness-to-pay evidence.',
  },
  {
    href: '/business-opportunity-database',
    title: 'Business Opportunity Database',
    description: 'Compare opportunities by buyer pain, demand, competitive gaps, channel fit, and validation difficulty.',
  },
];

export default function Page() {
  return (
    <main>
      <section className="hero" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <span className="eyebrow">MarketVibe Research Library</span>
          <h1>Research guides for finding better AI and online business opportunities.</h1>
          <p className="subhead">
            Use these MarketVibe guides to move from vague ideas to clearer decisions: what to build, who it is for, why they would pay, and how to validate the opportunity before spending months on execution.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link className="button primary" href="/">
              Start finding leads
            </Link>
            <Link className="button secondary" href="/ai-business-ideas">
              Read AI business ideas
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Browse guides</span>
          <h2>Start with the question you need answered.</h2>
          <p>
            Each guide focuses on practical decision-making: buyer clarity, demand signals, workflow pain, competitive gaps, pricing evidence, and the next validation step.
          </p>
        </div>

        <div className="cards">
          {researchPages.map((page) => (
            <article key={page.href}>
              <span>Research guide</span>
              <h3>{page.title}</h3>
              <p>{page.description}</p>
              <Link className="button secondary" href={page.href} style={{ marginTop: 12 }}>
                Open guide
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="seo-copy" style={{ maxWidth: 980, margin: '0 auto' }}>
          <h2>How MarketVibe thinks about opportunity research</h2>
          <p>
            A business opportunity is stronger when the buyer is specific, the pain is repeated, current alternatives are imperfect, and the first validation test can be run quickly. The goal is not to collect endless ideas. The goal is to choose better opportunities with less guesswork.
          </p>
          <p>
            Use this library as a starting point for evaluating AI services, automation workflows, niche products, lead-generation offers, and startup concepts before investing serious time or money.
          </p>
        </div>
      </section>
    </main>
  );
}
