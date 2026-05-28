import type { Metadata } from 'next';
import SeoLandingPage from '../seo/SeoLandingPage';

export const metadata: Metadata = {
  title: 'Startup Idea Validation: Evidence Before You Build | MarketVibe',
  description: 'Validate startup ideas with buyer interviews, market signals, landing page tests, competitor gaps, and willingness-to-pay evidence.',
  alternates: { canonical: '/startup-idea-validation' },
};

export default function Page() {
  return (
    <SeoLandingPage
      eyebrow="Startup idea validation"
      title="Validate your startup idea before product development becomes expensive."
      description="Startup risk usually hides in assumptions: who needs this, how badly they need it, what they use today, whether they will pay, and whether you can reach them. Validation makes those assumptions visible."
      sections={[
        {
          title: 'Validation is not asking friends if your idea is good',
          body: [
            'Most people are polite. They will say an idea sounds interesting even when they would never buy it. Useful validation looks for behavior: replies, calls booked, deposits, waitlist signups from qualified buyers, manual service requests, or people switching from an existing workaround.',
            'The earlier you test behavior, the faster you learn whether the idea has commercial force or only sounds appealing in conversation.'
          ]
        },
        {
          title: 'Start with the riskiest assumption',
          body: [
            'Every startup idea has one or two assumptions that matter most. It might be whether small businesses care enough, whether enterprise buyers trust the workflow, whether acquisition costs are too high, or whether the product can deliver the promised outcome reliably.',
            'Do not test everything at once. Pick the assumption that would kill the idea if it were false. Design the smallest test that gives you evidence either way.'
          ]
        },
        {
          title: 'What good validation looks like',
          body: [
            'Good validation produces sharper positioning. You should come away with clearer language, a better buyer definition, known objections, a more believable promise, and a next step. If the idea survives, it becomes narrower and stronger.',
            'If it fails, that is also valuable. A rejected idea saves months of work and frees you to test a better market.'
          ]
        }
      ]}
      cards={[
        { title: 'Assumption mapping', body: 'Write down the claims your idea depends on before testing.' },
        { title: 'Buyer evidence', body: 'Prioritize signals from people who could actually pay.' },
        { title: 'Small tests', body: 'Use landing pages, outreach, manual delivery, and interviews before full builds.' }
      ]}
      checklist={[
        'The target buyer is narrow enough to find and contact.',
        'The pain is urgent or costly enough to create action.',
        'There is evidence of current spending or serious workaround behavior.',
        'The landing page promise can be tested without a complete product.',
        'The next step produces real behavior, not just opinions.'
      ]}
      faqs={[
        { question: 'How do I validate a startup idea quickly?', answer: 'Define the buyer, identify the riskiest assumption, build a simple offer or landing page, contact qualified prospects, and measure behavior such as replies, calls, signups, or payment intent.' },
        { question: 'Should I build an MVP first?', answer: 'Not always. If the riskiest question is demand, a manual offer, demo, prototype, or landing page may teach more than a full MVP.' },
        { question: 'What is a bad validation signal?', answer: 'Compliments, vague interest, social likes, and feedback from people outside the buyer group are weak signals. They can be useful, but they should not drive major build decisions.' }
      ]}
    />
  );
}
