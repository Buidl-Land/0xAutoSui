import React from 'react';

interface SubscriptionTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isCurrent?: boolean;
  highlight?: boolean;
  badge?: string;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'free-tier',
    name: 'Free Tier',
    price: 'Free',
    description: "Perfect for getting started and exploring the platform's core functionalities.",
    features: [
      '200 Interaction Points per month (enough for basic tasks)',
      'Access to a curated selection of Free MCPs and Agents',
      'Community support',
    ],
  },
  {
    id: 'intermediate-tier',
    name: 'Intermediate Tier',
    price: '$39.9/month',
    description: "Ideal for regular users who need more power and access to advanced tools.",
    features: [
      '2,000 Interaction Points per month (ample for most projects)',
      'Full access to all Advanced MCPs and Agent capabilities',
      'Priority access to new and advanced AI models',
      'Ability to utilize Free Shared Agents from the community',
      'Email support',
    ],
    highlight: true,
    badge: 'Most Popular',
  },
  {
    id: 'advanced-tier',
    name: 'Advanced Tier',
    price: '$99.9/month',
    description: "Designed for power users and professionals building and deploying sophisticated AI solutions.",
    features: [
      '10,000 Interaction Points per month (for intensive usage and development)',
      'Unlock the ability to create and rent out your custom Agents to the community',
      'Dedicated premium support',
      'Early access to beta features',
    ],
  },
];

const SubscriptionCard: React.FC<{ tier: SubscriptionTier }> = ({ tier }) => {
  return (
    <div
      className={`card bg-base-100 shadow-xl relative ${
        tier.highlight ? 'border-2 border-primary ring-2 ring-primary shadow-2xl' : 'border border-base-300'
      } flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:scale-105`}
    >
      <div className="card-body p-6 flex-grow">
        {tier.badge && (
          <div className="absolute top-0 right-0 bg-secondary text-secondary-content px-3 py-1 text-xs font-semibold rounded-bl-lg rounded-tr-lg">
            {tier.badge}
          </div>
        )}
        <h2 className="card-title text-2xl font-bold mb-2">{tier.name}</h2>
        <p className="text-3xl font-extrabold text-primary mb-1">{tier.price}</p>
        <p className="text-sm text-base-content/70 mb-4 min-h-[3em]">{tier.description}</p>
        <ul className="space-y-2 mb-6 flex-grow">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-base-content/90">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-actions justify-center p-6 pt-0">
        {tier.isCurrent ? (
          <button className="btn btn-disabled w-full text-lg py-3">Current Plan</button>
        ) : (
          <button className={`btn ${tier.highlight ? 'btn-primary' : 'btn-outline btn-primary'} w-full text-lg py-3`}>
            {tier.price === 'Free' ? 'Get Started' : 'Subscribe Now'}
          </button>
        )}
      </div>
    </div>
  );
};

const SubscriptionPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
          Find the Perfect Plan
        </h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          Unlock more features and capabilities by choosing a plan that suits your needs. Start for free or scale up as you grow.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subscriptionTiers.map((tier) => (
          <SubscriptionCard key={tier.id} tier={tier} />
        ))}
      </div>
      <div className="mt-16 text-center">
        <p className="text-lg text-base-content/80">
          Need something more? For enterprise solutions or custom requirements, please{' '}
          <a href="mailto:support@example.com" className="link link-accent font-semibold hover:underline">
            Contact Our Sales Team
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPage;