import { NextRequest, NextResponse } from "next/server";

type Lead = {
  business: string;
  location: string;
  website?: string;
  phone?: string;
  problem: string;
  offer: string;
  score: number;
  source: "google" | "serpapi" | "mock";
};

function scoreLead(name: string, website?: string): number {
  let score = 74;
  if (!website) score += 14;
  if (/clinic|studio|group|pros|center|care|law|dental|roof/i.test(name)) score += 6;
  return Math.min(score, 96);
}

function problemFromService(service: string) {
  const lower = service.toLowerCase();
  if (lower.includes("seo")) return "Weak local SEO visibility and likely missing service landing pages";
  if (lower.includes("chat") || lower.includes("ai")) return "No obvious AI chat, receptionist, or instant lead capture flow";
  if (lower.includes("website") || lower.includes("web")) return "Website likely needs a clearer call-to-action and conversion flow";
  if (lower.includes("booking")) return "Booking path may be too slow or hard for new customers";
  return "Visible opportunity for better lead capture and customer follow-up";
}

function offerFromService(service: string) {
  const lower = service.toLowerCase();
  if (lower.includes("seo")) return "Local SEO pages + Google Business Profile optimization";
  if (lower.includes("chat") || lower.includes("ai")) return "AI receptionist + chatbot lead capture";
  if (lower.includes("website") || lower.includes("web")) return "Conversion-focused website redesign";
  if (lower.includes("booking")) return "Online booking + SMS follow-up automation";
  return `${service} implementation`;
}

function mockLeads(industry: string, city: string, service: string, count: number): Lead[] {
  const base = [
    `${city} Family ${industry.replace(/s$/, "")}`,
    `Premier ${industry} of ${city}`,
    `${city} Modern ${industry}`,
    `BrightPath ${industry}`,
    `Northside ${industry} Group`,
    `Elite ${city} ${industry}`,
    `Sunrise ${industry} Center`,
    `Trusted ${industry} Pros`,
  ];
  return base.slice(0, count).map((business, index) => ({
    business,
    location: city,
    website: index % 3 === 0 ? undefined : `https://example.com/${business.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    phone: index % 2 === 0 ? "(555) 010-2026" : undefined,
    problem: problemFromService(service),
    offer: offerFromService(service),
    score: Math.max(71, 94 - index * 3),
    source: "mock",
  }));
}

async function googlePlacesLeads(industry: string, city: string, service: string, count: number): Promise<Lead[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error("GOOGLE_PLACES_API_KEY is missing");
  const query = encodeURIComponent(`${industry} in ${city}`);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${key}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data = await res.json();
  if (!res.ok || data.status === "REQUEST_DENIED") throw new Error(data.error_message || "Google Places request failed");
  const results = Array.isArray(data.results) ? data.results.slice(0, count) : [];
  return results.map((place: any) => ({
    business: place.name || "Unknown business",
    location: place.formatted_address || city,
    website: undefined,
    phone: undefined,
    problem: problemFromService(service),
    offer: offerFromService(service),
    score: scoreLead(place.name || "", undefined),
    source: "google",
  }));
}

async function serpApiLeads(industry: string, city: string, service: string, count: number): Promise<Lead[]> {
  const key = process.env.SERPAPI_KEY;
  if (!key) throw new Error("SERPAPI_KEY is missing");
  const params = new URLSearchParams({ engine: "google_maps", q: `${industry} in ${city}`, api_key: key });
  const res = await fetch(`https://serpapi.com/search.json?${params.toString()}`, { next: { revalidate: 3600 } });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || "SerpApi request failed");
  const results = Array.isArray(data.local_results) ? data.local_results.slice(0, count) : [];
  return results.map((place: any) => ({
    business: place.title || "Unknown business",
    location: place.address || city,
    website: place.website,
    phone: place.phone,
    problem: problemFromService(service),
    offer: offerFromService(service),
    score: scoreLead(place.title || "", place.website),
    source: "serpapi",
  }));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const industry = String(body.industry || "Dentists").slice(0, 80);
    const city = String(body.city || "Dallas").slice(0, 80);
    const service = String(body.service || "AI receptionist").slice(0, 120);
    const count = Math.min(Number(body.count || 6), 20);
    const provider = (process.env.LEAD_PROVIDER || "mock").toLowerCase();

    let leads: Lead[];
    if (provider === "google") leads = await googlePlacesLeads(industry, city, service, count);
    else if (provider === "serpapi") leads = await serpApiLeads(industry, city, service, count);
    else leads = mockLeads(industry, city, service, count);

    return NextResponse.json({ leads, provider });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Lead search failed" }, { status: 500 });
  }
}
