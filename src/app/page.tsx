"use client";

import { useMemo, useState } from "react";

type Lead = {
  business: string;
  location: string;
  website?: string;
  phone?: string;
  problem: string;
  offer: string;
  score: number;
  source: string;
};

const starterUrl = process.env.NEXT_PUBLIC_STRIPE_STARTER_URL || "#pricing";
const proUrl = process.env.NEXT_PUBLIC_STRIPE_PRO_URL || "#pricing";
const agencyUrl = process.env.NEXT_PUBLIC_STRIPE_AGENCY_URL || "#pricing";

const industries = ["Dentists", "Roofers", "Med spas", "Law firms", "Restaurants", "Gyms", "Auto detailers", "Real estate agents"];

function AdSlot({ label }: { label: string }) {
  return (
    <div className="ad-slot" aria-label="Advertisement placeholder">
      <span>Advertisement</span>
      <small>{label}</small>
    </div>
  );
}

function csvEscape(value: string | number | undefined) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export default function Home() {
  const [industry, setIndustry] = useState("Dentists");
  const [city, setCity] = useState("Dallas");
  const [service, setService] = useState("AI receptionist");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchText = useMemo(() => `${industry} in ${city} that need ${service}`, [industry, city, service]);

  async function findLeads() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, city, service, count: 6 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Lead search failed");
      setLeads(data.leads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function exportCsv() {
    const rows = [
      ["Business", "Location", "Website", "Phone", "Problem", "Offer", "Score", "Source"],
      ...leads.map((lead) => [lead.business, lead.location, lead.website || "", lead.phone || "", lead.problem, lead.offer, lead.score, lead.source]),
    ];
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketvibe-${industry}-${city}.csv`.replaceAll(" ", "-").toLowerCase();
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main>
      <header className="nav">
        <a className="brand" href="#top" aria-label="MarketVibe AI home">
          <span className="logo">MV</span>
          <span><b>MarketVibe AI</b><small>Client finder</small></span>
        </a>
        <nav>
          <a href="#demo">Demo</a>
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="nav-cta" href="#pricing">Start finding leads</a>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">AI lead generation for freelancers and agencies</p>
          <h1>Find local businesses ready to buy your service.</h1>
          <p className="subhead">Search a niche and city, uncover visible buying signals, score the opportunity, and generate cold outreach for web design, SEO, chatbots, and AI automation services.</p>
          <div className="hero-actions">
            <a className="button primary" href="#demo">Try the demo</a>
            <a className="button secondary" href="#pricing">See pricing</a>
          </div>
          <div className="trust-row"><span>Free sample leads</span><span>CSV export</span><span>Stripe ready</span><span>AdSense ready layout</span></div>
        </div>
        <div className="hero-card">
          <div className="panel-top"><span>Live search preview</span><b>{searchText}</b></div>
          {["BrightSmile Dental Studio", "Cedar Roofing Pros", "Luna Med Spa"].map((name, i) => (
            <div className="mini-lead" key={name}>
              <div><b>{name}</b><span>{city} • Opportunity score {92 - i * 5}/100</span></div>
              <p>{i === 0 ? "No online booking and weak contact flow" : i === 1 ? "Weak SEO pages and no quote automation" : "No chatbot and missed after-hours leads"}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="demo" className="section demo-section">
        <div className="section-heading">
          <p className="eyebrow">Interactive demo</p>
          <h2>Turn any city and niche into a prospecting list.</h2>
          <p>Use mock data for free testing. Later, switch the lead provider to Google Places or SerpApi in your environment variables.</p>
        </div>
        <div className="demo-grid">
          <form className="search-box" onSubmit={(e) => { e.preventDefault(); findLeads(); }}>
            <label>Industry<select value={industry} onChange={(e) => setIndustry(e.target.value)}>{industries.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>City<input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dallas" /></label>
            <label>Service you sell<input value={service} onChange={(e) => setService(e.target.value)} placeholder="AI receptionist" /></label>
            <button className="button primary full" disabled={loading}>{loading ? "Finding leads..." : "Find sample leads"}</button>
            {error ? <p className="error">{error}</p> : null}
          </form>
          <div className="results">
            {leads.length === 0 ? <div className="empty"><h3>Your leads will appear here</h3><p>Run a sample search to preview the paid user experience.</p></div> : null}
            {leads.map((lead) => (
              <article className="lead-card" key={`${lead.business}-${lead.location}`}>
                <div className="lead-head"><div><h3>{lead.business}</h3><p>{lead.location}</p></div><strong>{lead.score}</strong></div>
                <div className="lead-meta"><span>{lead.problem}</span><span>{lead.offer}</span></div>
                <p className="email"><b>Cold email opener:</b> I noticed your website may be missing an easy way for new customers to ask questions or book fast. I help {industry.toLowerCase()} add {service.toLowerCase()} systems that capture more leads.</p>
                {lead.website ? <a href={lead.website} target="_blank" rel="noreferrer">Visit website</a> : null}
              </article>
            ))}
            {leads.length > 0 ? <button className="button secondary full" onClick={exportCsv}>Export CSV</button> : null}
          </div>
        </div>
      </section>

      <section className="section"><AdSlot label="Top content ad placement" /></section>

      <section id="how" className="section alt">
        <div className="section-heading"><p className="eyebrow">How it works</p><h2>A simple workflow for getting clients.</h2></div>
        <div className="cards">
          <article><span>01</span><h3>Pick a niche</h3><p>Choose dentists, roofers, med spas, law firms, restaurants, or another local market.</p></article>
          <article><span>02</span><h3>Find buying signals</h3><p>MarketVibe looks for missing booking, weak contact flow, poor SEO pages, and missing automation.</p></article>
          <article><span>03</span><h3>Send outreach</h3><p>Get a reason to contact each business and a human-sounding message tailored to the problem.</p></article>
        </div>
      </section>

      <section className="section content-grid">
        <article className="seo-copy">
          <h2>Best AI lead finder for local service sellers</h2>
          <p>MarketVibe AI is built for people who sell websites, SEO, chatbots, AI receptionists, workflow automation, booking systems, and local marketing services. Instead of sending generic cold emails, start with a visible business problem and make the pitch relevant.</p>
          <p>The fastest path is to choose one city, one niche, and one offer. For example: med spas in Miami that need a booking assistant, roofers in Phoenix that need SEO pages, or law firms in Atlanta that need better lead capture.</p>
          <p>This page includes original content, policy pages, clear navigation, and advertising placeholders to help prepare the site for AdSense review. Approval is still decided by Google.</p>
        </article>
        <aside><AdSlot label="Sidebar ad placement" /><div className="popular"><h3>Popular searches</h3><p>Dentists needing AI receptionists</p><p>Roofers needing SEO</p><p>Law firms needing chatbots</p><p>Med spas needing booking automation</p></div></aside>
      </section>

      <section id="pricing" className="section pricing">
        <div className="section-heading"><p className="eyebrow">Monetized from day one</p><h2>Start with a low-ticket lead pack.</h2><p>Replace the Stripe placeholder links with your live Payment Links when ready.</p></div>
        <div className="pricing-grid">
          <article><h3>Starter</h3><strong>$9</strong><p>One-time lead pack for beginners.</p><ul><li>25 leads</li><li>Pain-point summaries</li><li>Cold email template</li><li>No subscription risk</li></ul><a className="button secondary full" href={starterUrl}>Buy lead pack</a></article>
          <article className="featured"><p className="badge">Most popular</p><h3>Pro</h3><strong>$29/mo</strong><p>Best for freelancers doing weekly outreach.</p><ul><li>250 leads/month</li><li>CSV exports</li><li>Outreach scripts</li><li>Saved searches soon</li></ul><a className="button primary full" href={proUrl}>Start Pro</a></article>
          <article><h3>Agency</h3><strong>$79/mo</strong><p>For agencies running multiple campaigns.</p><ul><li>1,000 leads/month</li><li>Bulk exports</li><li>Campaign templates</li><li>Priority support</li></ul><a className="button secondary full" href={agencyUrl}>Start Agency</a></article>
        </div>
      </section>

      <section id="faq" className="section alt faq">
        <div className="section-heading"><p className="eyebrow">FAQ</p><h2>Launch notes</h2></div>
        <details><summary>Is this live lead data?</summary><p>By default it uses mock data so local and Vercel testing are free. Set LEAD_PROVIDER to google or serpapi after adding API keys.</p></details>
        <details><summary>Is it AdSense approved?</summary><p>It is AdSense-ready with content, navigation, policy pages, and ad slots. Google still has to approve the site.</p></details>
        <details><summary>Can this become a ChatGPT app?</summary><p>Yes. The same backend and payment site can later power a ChatGPT app.</p></details>
      </section>

      <section className="cta"><h2>Launch MarketVibe AI on marketvibe1.com.</h2><p>Use the domain you already own and sell lead packs before building a complex SaaS.</p><a className="button light" href="#pricing">Start monetizing</a></section>

      <footer><b>MarketVibe AI</b><nav><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/refunds">Refunds</a><a href="/contact">Contact</a></nav><p>© {new Date().getFullYear()} MarketVibe1.com. All rights reserved.</p></footer>
    </main>
  );
}
