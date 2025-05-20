import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "../lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const PricingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = (plan: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to a plan",
      });
      navigate('/signup');
      return;
    }

    // In a real app, this would initiate a payment process
    toast({
      title: `${plan} subscription`,
      description: "This is a demo. In a real app, this would take you to a payment page.",
    });
  };

  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out",
      price: {
        monthly: "$0",
        yearly: "$0",
      },
      features: [
        "3 Free Templates",
        "Export up to 3 resumes as PDF",
        "Basic editing tools",
        "7-day history",
      ],
      limitations: [
        "No premium templates",
        "Limited customization",
        "No priority support",
      ],
      cta: "Get Started",
      ctaAction: () => navigate('/signup'),
      highlight: false,
    },
    {
      name: "Pro",
      description: "For job seekers who want more",
      price: {
        monthly: "$9.99",
        yearly: "$7.99",
      },
      features: [
        "All templates (including premium)",
        "Unlimited resume exports",
        "Advanced customization options",
        "AI content suggestions",
        "Resume analytics",
        "Priority support",
        "30-day revision history",
      ],
      limitations: [],
      cta: user?.profile?.is_pro ? "Current Plan" : "Subscribe",
      ctaAction: () => handleSubscribe("Pro"),
      highlight: true,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-heading font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Choose the plan that works best for you. All plans include access to our resume builder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8">
            {/* Billing Cycle Toggle */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Monthly
                </span>
                <Switch 
                  checked={billingCycle === 'yearly'}
                  onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                />
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Yearly
                  </span>
                  <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Save 20%
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {plans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`flex flex-col ${
                    plan.highlight 
                      ? 'border-primary shadow-lg shadow-primary/10' 
                      : ''
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">
                        {plan.price[billingCycle]}
                      </span>
                      {plan.name !== "Free" && (
                        <span className="text-muted-foreground ml-2">
                          {billingCycle === 'monthly' ? '/month' : '/month billed annually'}
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Includes:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <svg
                              className="mr-2 h-4 w-4 text-primary"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {plan.limitations.length > 0 && (
                        <div className="pt-2">
                          <h4 className="font-medium text-muted-foreground">Limitations:</h4>
                          <ul className="space-y-2 mt-2">
                            {plan.limitations.map((limitation, i) => (
                              <li key={i} className="flex items-center text-sm text-muted-foreground">
                                <svg
                                  className="mr-2 h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button
                      className="w-full"
                      variant={plan.highlight ? "default" : "outline"}
                      onClick={plan.ctaAction}
                      disabled={plan.name === "Pro" && user?.profile?.is_pro}
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-heading font-bold tracking-tighter">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Have questions? We've got answers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "Do I need a subscription to create a resume?",
                  answer: "No, you can create and export up to 3 resumes with our Free plan. The Pro plan offers unlimited resumes and additional premium features."
                },
                {
                  question: "Can I cancel my subscription at any time?",
                  answer: "Yes, you can cancel your subscription at any time. Your Pro features will remain active until the end of your billing period."
                },
                {
                  question: "Are my payment details secure?",
                  answer: "Yes, we use industry-standard security practices to protect your payment information. We never store your full credit card details on our servers."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept major credit cards, PayPal, and Apple Pay. Additional payment methods may be available depending on your region."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "Yes, we offer a 14-day money-back guarantee. If you're not satisfied with our Pro plan, contact our support team within 14 days of your purchase."
                },
                {
                  question: "How do I switch between plans?",
                  answer: "You can upgrade from Free to Pro at any time. To downgrade from Pro to Free, cancel your Pro subscription and your account will revert to the Free plan at the end of your billing period."
                }
              ].map((item, i) => (
                <Card key={i} className="shadow-none">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-muted rounded-lg p-6 text-center mt-4">
              <h3 className="text-lg font-medium mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-4">We're here to help. Contact our support team for assistance.</p>
              <Button variant="outline" asChild>
                <a href="#contact">Contact Support</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PricingPage;
