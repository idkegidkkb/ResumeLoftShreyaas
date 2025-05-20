import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const HomePage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4 max-w-[800px]">
              <div className="inline-block animate-float">
                <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  AI-Powered Resume Builder
                </span>
              </div>
              <h1 className="text-4xl font-heading font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80">
                Land Your Dream Job with AI-Enhanced Resumes
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-[600px] mx-auto">
                Create ATS-optimized resumes that get you noticed. 90% success rate in passing ATS systems.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 min-[400px]:w-auto justify-center">
              <Button asChild size="lg" className="px-8 text-lg h-12 relative overflow-hidden group">
                <Link to="/templates">
                  Create Resume Now
                  <span className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg h-12 hover:bg-primary/5">
                <Link to="/features">See How It Works</Link>
              </Button>
            </div>
            
            {/* Stats Section with modern styling */}
            <div className="grid grid-cols-3 gap-8 mt-12 w-full max-w-[900px] bg-card/50 rounded-2xl p-8 backdrop-blur-sm border border-primary/10">
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 mb-2">90%</h3>
                <p className="text-sm font-medium">ATS Success Rate</p>
                <p className="text-xs text-muted-foreground mt-1">Proven track record</p>
              </div>
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 mb-2">3x</h3>
                <p className="text-sm font-medium">More Interviews</p>
                <p className="text-xs text-muted-foreground mt-1">Than traditional resumes</p>
              </div>
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 mb-2">24/7</h3>
                <p className="text-sm font-medium">AI Support</p>
                <p className="text-xs text-muted-foreground mt-1">Always available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-muted py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-4xl">
                  Everything You Need to Land That Job
                </h2>
                <p className="max-w-[700px] text-muted-foreground mx-auto">
                  Our resume builder comes with all the tools and features to help you create a professional resume that stands out.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10v10H7z" /></svg>
                </div>
                <h3 className="font-heading text-xl font-semibold">Professional Templates</h3>
                <p className="text-muted-foreground">
                  Choose from 10 professionally designed templates that are ATS-friendly and proven to get results.
                </p>
              </div>

              {/* Feature: AI Optimizer */}
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 6-9"/><path d="m15 21 3-6"/><path d="M5 10h14"/><path d="M12 10V3"/><path d="M12 3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1"/><path d="M12 3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1"/></svg>
                </div>
                <h3 className="font-heading text-xl font-semibold">AI Resume Optimizer</h3>
                <p className="text-muted-foreground">
                  Instantly improve your resume with AI-powered suggestions. Optimize keywords and phrasing to catch recruiters' attention and beat the competition.
                </p>
              </div>

              {/* Feature: ATS Suitability */}
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16s.8-1.3 2-2c1.3-.8 4-2 6-2s4.7 1.2 6 2c1.2.7 2 2 2 2"/><path d="M4 20s.8-1.3 2-2c1.3-.8 4-2 6-2s4.7 1.2 6 2c1.2.7 2 2 2 2"/><path d="M8 8v.01"/><path d="M16 8v.01"/><path d="M12 12v.01"/><path d="M12 16v.01"/></svg>
                </div>
                <h3 className="font-heading text-xl font-semibold">ATS Friendly Designs</h3>
                <p className="text-muted-foreground">
                  Get your resume noticed by employers. Our expertly designed templates are built to pass Applicant Tracking Systems (ATS) filters, ensuring your application gets seen.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                </div>
                <h3 className="font-heading text-xl font-semibold">Easy to Use</h3>
                <p className="text-muted-foreground">
                  Simply fill out a form and we'll format everything perfectly. No design skills needed.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                </div>
                <h3 className="font-heading text-xl font-semibold">PDF Export</h3>
                <p className="text-muted-foreground">
                  Export your resume as a high-quality PDF ready to send to employers and job applications.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <h3 className="font-heading text-xl font-semibold">Save & Edit</h3>
                <p className="text-muted-foreground">
                  Create an account to save your resumes and come back to edit them anytime you need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Updated with 4 steps */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-4xl">
                  How It Works
                </h2>
                <p className="max-w-[700px] text-muted-foreground mx-auto text-lg">
                  Create a professional, ATS-optimized resume in four simple steps
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-card/50">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-3xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-heading font-semibold">Choose Template</h3>
                <p className="text-muted-foreground">
                  Select from our ATS-friendly professional templates
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-card/50">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-3xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-heading font-semibold">Add Details</h3>
                <p className="text-muted-foreground">
                  Fill in your information using our smart forms
                </p>
              </div>

              {/* Step 3 - New AI Optimization Step */}
              <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-card/50">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-3xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-heading font-semibold">AI Enhancement</h3>
                <p className="text-muted-foreground">
                  Our AI optimizes your content for maximum impact
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-card/50">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-3xl font-bold">
                  4
                </div>
                <h3 className="text-xl font-heading font-semibold">Download & Apply</h3>
                <p className="text-muted-foreground">
                  Get your optimized resume ready for applications
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1A1A1A] text-white py-20">
  <div className="container px-4 md:px-6">
    <div className="flex flex-col items-center text-center space-y-6">
      <div className="space-y-4">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Ready to Create Your Resume?
        </h2>
        <p className="max-w-[600px] text-gray-400 md:text-lg mx-auto">
          Join thousands of job seekers who've successfully landed their dream jobs with our resume builder.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition">
          Get Started for Free
        </button>
        <button className="border border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-black transition">
          Browse Templates
        </button>
      </div>
    </div>
  </div>
</section>

    </Layout>
  );
};

export default HomePage;
