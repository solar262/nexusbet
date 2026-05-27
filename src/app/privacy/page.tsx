import Link from "next/link";

export default function Privacy() {
  return (
    <main className="legal">
      <Link href="/">← Back to MarketVibe AI</Link>
      <h1>Privacy Policy</h1>
      <p>Last updated: May 2026.</p>
      <p>MarketVibe AI collects information you submit, such as search inputs, contact messages, account details, and payment information processed by third-party providers. We use this information to provide lead-finding tools, improve the service, prevent abuse, and communicate with customers.</p>
      <p>Payments may be handled by Stripe. Advertising may be handled by Google AdSense. Lead data may be retrieved from third-party data providers depending on the plan and settings used.</p>
      <p>You can request data removal or support by contacting support@marketvibe1.com.</p>
    </main>
  );
}
