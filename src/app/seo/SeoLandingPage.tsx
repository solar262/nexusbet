import Link from 'next/link';

export type SeoLandingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: string;
  secondaryCta?: string;
  sections: {
    title: string;
    body: string[];
  }[];
  cards: {
    title: string;
    body: string;
  }[];
  checklist: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

const relatedPages = [
  { href: '/ai-business-ideas', label: 'AI business ideas' },
  { href: '/niche-validation', label: 'Niche validation' },
  { href: '/ai-automation-ideas', label: 'AI automation ideas' },
  { href: '/market-research-tools', label: 'Market research tools' },
  { href: '/startup-idea-validation', label: 'Startup idea validation' },
  { href: '/business-opportunity-database', label: 'Opportunity database' },
];

export default function SeoLandingPage({
  eyebrow,
  title,
  description,
  primaryCta = 'Explore MarketVibe',
  secondaryCta = 'Browse research pages',
  sections,
  cards,
  checklist,
  faqs,
}: SeoLandingPageProps) {
  return (
    <main>
      <section className="hero" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="subhead">{description}</p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link className="button primary" href="/">
              {primaryCta}
            </Link>
            <Link className="button secondary" href="/business-opportunity-database">
              {secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Practical signals, not hype</span>
          <h2>How to use this page</h2>
          <p>
            These guides are built for founders, operators, creators, and small teams who want to find real demand before spending months building the wrong thing.
          </p>
        </div>
        <div className="cards">
          {cards.map((card) => (
            <article key={card.title}>
              <span>MarketVibe</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="content-grid">
          <article className="seo-copy">
            {sections.map((section) => (
              <section key={section.title} style={{ marginBottom: 34 }}>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </article>
          <aside>
            <div className="popular">
              <h3>Validation checklist</h3>
              <p>Use this before committing time, ad spend, or engineering resources.</p>
              <ul style={{ paddingLeft: 20, color: '#475569', lineHeight: 1.8 }}>
                {checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="popular">
              <h3>Related research pages</h3>
              <p>Build topical depth by moving through related MarketVibe resources.</p>
              <div style={{ display: 'grid', gap: 10 }}>
                {relatedPages.map((page) => (
                  <Link key={page.href} href={page.href} style={{ fontWeight: 900, color: '#334155' }}>
                    {page.label} →
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section faq">
        <div className="section-heading">
          <span className="eyebrow">FAQ</span>
          <h2>Questions founders usually ask</h2>
        </div>
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </section>

      <section className="cta">
        <h2>Find the opportunity before you build the product.</h2>
        <p>Use MarketVibe to turn niche signals, demand patterns, and automation angles into clearer business decisions.</p>
        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <Link className="button light" href="/">
            Open MarketVibe
          </Link>
        </div>
      </section>
    </main>
  );
}
