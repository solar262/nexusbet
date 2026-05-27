# MarketVibe AI

A Vercel-ready Next.js website for MarketVibe1.com.

MarketVibe AI helps freelancers, agencies, web designers, SEO sellers, chatbot builders, and AI automation builders find local businesses with visible buying signals and generate outreach.

Included:

- SEO-optimized landing page
- Interactive lead finder demo
- API route for leads
- Free mock lead provider for testing
- Google Places provider option
- SerpApi provider option
- CSV export
- Stripe Payment Link placeholders
- Google AdSense script hook and ad placeholders
- Privacy, Terms, Refund, and Contact pages
- Sitemap and robots routes

Local setup:

npm install
npm run dev

Open localhost on port 3000.

Set these environment variables in Vercel:

NEXT_PUBLIC_SITE_URL=https://marketvibe1.com
NEXT_PUBLIC_SITE_NAME=MarketVibe AI
LEAD_PROVIDER=mock
GOOGLE_PLACES_API_KEY=
SERPAPI_KEY=
NEXT_PUBLIC_STRIPE_STARTER_URL=
NEXT_PUBLIC_STRIPE_PRO_URL=
NEXT_PUBLIC_STRIPE_AGENCY_URL=
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-your-id

Use LEAD_PROVIDER=mock first because it is free. Add Google Places or SerpApi only after the site is working.
