import { useEffect } from 'react';
import {
  MessageCircle,
  FileBarChart,
  Settings,
  RefreshCw,
  CheckCircle,
  Users,
  Shield
} from "lucide-react";
import { Timeline } from "@/components/ui/timeline";
import ColorChangeCards from "@/components/ui/color-change-card";
// @ts-ignore: AOS has no types by default
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import commitment images directly
import responseTimeImg from '@/assets/commitment/Response-Time.png';
import meetingsImg from '@/assets/commitment/Meetings.jpg';
import reportingImg from '@/assets/commitment/Reporting.jpg';
import technologyAccessImg from '@/assets/commitment/Technology-Access.jpg';


const ProcessSection = () => {
  useEffect(() => {
    AOS.init({ duration: 500, once: true });
  }, []);

  const processSteps = [
    {
      id: 'consultation',
      number: '01',
      icon: MessageCircle,
      title: 'Initial Consultation',
      description: 'Comprehensive discussion of your financial goals, current situation, and concerns',
      expectations: [
        'No-pressure environment focused on understanding your needs',
        'Comprehensive discussion of financial goals and timeline',
        'Review of current investment portfolio and strategies',
        'Clear explanation of our services and potential fit'
      ],
      preparation: [
        'Bring recent investment statements',
        'Last 2 years tax returns',
        'List of financial goals with timeline',
        'Current insurance policies summary'
      ],
      outcome: 'Clear understanding of your needs and our potential value-add'
    },
    {
      id: 'analysis',
      number: '02',
      icon: FileBarChart,
      title: 'Comprehensive Financial Analysis',
      description: 'Detailed analysis of your current financial position, risk tolerance, and goal feasibility',
      expectations: [
        'Advanced planning software for scenario analysis',
        'Risk tolerance assessment and goal feasibility study',
        'Tax optimization and estate planning review',
        'Written financial plan with specific recommendations'
      ],
      preparation: [
        'Complete financial questionnaire',
        'Provide additional documentation as requested',
        'Schedule 90-minute review meeting'
      ],
      outcome: 'Comprehensive written plan with implementation timeline and cost estimates'
    },
    {
      id: 'implementation',
      number: '03',
      icon: Settings,
      title: 'Implementation & Onboarding',
      description: 'Systematic portfolio construction and account setup based on approved plan',
      expectations: [
        'Streamlined account opening with institutional custodians',
        'Systematic investment implementation per approved strategy',
        'Insurance policy reviews and optimizations',
        'Complete documentation and beneficiary coordination'
      ],
      preparation: [
        'Sign investment advisory agreement',
        'Fund new accounts per implementation plan',
        'Complete beneficiary designations'
      ],
      outcome: 'Fully implemented investment strategy with complete documentation'
    },
    {
      id: 'management',
      number: '04',
      icon: RefreshCw,
      title: 'Ongoing Relationship Management',
      description: 'Proactive portfolio management with regular reviews and strategic adjustments',
      expectations: [
        'Quarterly portfolio reviews and rebalancing',
        'Annual comprehensive plan updates',
        'Proactive market commentary and strategy updates',
        '24/7 secure client portal access'
      ],
      preparation: [
        'Attend scheduled review meetings',
        'Communicate life changes promptly',
        'Review quarterly reports and updates'
      ],
      outcome: 'Consistent progress toward financial goals with ongoing optimization'
    }
  ];

  const communicationStandards = [
    {
      heading: 'Response Time',
      description: 'All inquiries answered within 24 hours',
      imgSrc: responseTimeImg
    },
    {
      heading: 'Meeting Frequency',
      description: 'Quarterly reviews, annual planning, ad-hoc as needed',
      imgSrc: meetingsImg
    },
    {
      heading: 'Reporting',
      description: 'Monthly statements, quarterly performance reports',
      imgSrc: reportingImg
    },
    {
      heading: 'Technology Access',
      description: 'Secure client portal, mobile app, video conferencing',
      imgSrc: technologyAccessImg
    }
  ];


  // Transform processSteps into timeline data
  const timelineData = processSteps.map((step) => ({
    title: step.title,
    content: (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-white/10">
        {/* Icon Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <step.icon className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/90 dark:text-white/90 text-base md:text-lg font-crimson mb-8 leading-relaxed text-justify">
          {step.description}
        </p>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* What to Expect */}
          <div className="bg-white/5 rounded-xl p-5">
            <h4 className="font-playfair font-semibold text-lg text-white mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-secondary mr-2 flex-shrink-0" />
              What to Expect
            </h4>
            <ul className="space-y-3">
              {step.expectations.map((expectation, i) => (
                <li key={i} className="text-white/80 dark:text-white/80 text-sm md:text-base font-crimson flex items-start">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-2 mt-2 flex-shrink-0"></div>
                  {expectation}
                </li>
              ))}
            </ul>
          </div>

          {/* Your Preparation */}
          <div className="bg-white/5 rounded-xl p-5">
            <h4 className="font-playfair font-semibold text-lg text-white mb-4 flex items-center">
              <Users className="w-5 h-5 text-secondary mr-2 flex-shrink-0" />
              Your Preparation
            </h4>
            <ul className="space-y-3">
              {step.preparation.map((prep, i) => (
                <li key={i} className="text-white/80 dark:text-white/80 text-sm md:text-base font-crimson flex items-start">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-2 mt-2 flex-shrink-0"></div>
                  {prep}
                </li>
              ))}
            </ul>
          </div>

          {/* Outcome */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h4 className="font-playfair font-semibold text-lg text-tertiary mb-4 flex items-center">
              <Shield className="w-5 h-5 text-secondary mr-2 flex-shrink-0" />
              Outcome
            </h4>
            <p className="text-tertiary/80 text-sm md:text-base font-crimson leading-relaxed text-justify">
              {step.outcome}
            </p>
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <section id="process" className="bg-tertiary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-2">
          <p className="text-sm font-playfair font-semibold text-white/90 uppercase tracking-[0.15em] mb-4">
            OUR PROCESS
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4">
            Our Client-Focused Process
          </h2>
          <div className="flex justify-center">
            <p className="text-lg md:text-xl font-crimson text-white/80 max-w-3xl text-center">
              A systematic, transparent approach designed to reduce anxiety and build confidence throughout your financial planning journey.
            </p>
          </div>
        </div>
      </div>
      
      {/* Timeline Component */}
      <Timeline data={timelineData} />

      {/* Communication Standards */}
      <div className="bg-[#FAFAFA] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-aos="fade-up" className="mb-12">
            <div className="text-center mb-12">
              <p className="text-sm font-playfair font-semibold text-tertiary/80 uppercase tracking-[0.15em] mb-4">
                OUR COMMITMENT
              </p>
              <h3 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-tertiary mb-4 leading-tight">
                Communication Standards
              </h3>
              <div className="flex justify-center">
                <p className="font-crimson text-lg md:text-xl text-tertiary/80 max-w-3xl leading-relaxed text-center">
                  Clear expectations for responsive, professional service
                </p>
              </div>
            </div>
            <ColorChangeCards cards={communicationStandards} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;