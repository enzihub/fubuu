import React from 'react';
import ReactMarkdown from 'react-markdown';

const markdownComponents = {
  h1: ({ children }: any) => (
    <h1 className='mb-8 text-center text-3xl font-medium tracking-tight text-gray-100 md:text-4xl'>
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className='mb-4 border-b border-gray-700 pb-2 text-xl font-medium tracking-tight text-gray-200 md:text-2xl'>
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className='mb-3 text-lg font-medium tracking-tight text-gray-300 md:text-xl'>
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className='mb-6 text-sm leading-relaxed text-gray-400 md:text-base'>
      {children}
    </p>
  ),
  ul: ({ children }: any) => (
    <ul className='mb-6 ml-4 list-outside list-disc text-sm text-gray-400 md:text-base'>
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className='mb-6 ml-4 list-outside list-decimal text-sm text-gray-400 md:text-base'>
      {children}
    </ol>
  ),
  li: ({ children }: any) => <li className='mb-2'>{children}</li>,
  hr: () => <hr className='my-8 border-gray-700' />,
};

export default function DevRoadMap() {
  const markdownContent = `
# Fubuu Product Roadmap
**Current Status:** Just Released!
Fubuu is live and already empowering users to effortlessly grow their social media presence by turning WhatsApp voice notes into engaging content for **Twitter, LinkedIn, and Threads**.
## Sprint 1: Launch & Early Adoption
- **Objective:** Validate product-market fit with a seamless launch.
- **Key Features:**
  - WhatsApp voice note integration for effortless content creation across Twitter, LinkedIn, and Threads.
  - AI-powered drafting that transforms your spoken thoughts into social media-ready posts.
- **Goals:**
  - Onboard early adopters and gather actionable feedback.
  - Ensure smooth user onboarding and initial engagement.
  - Reach a strong base of early users (200+ happy users).
## Sprint 2: Feature Enhancements (Post-Launch Success)
- **Objective:** Enhance functionality based on initial user feedback.
- **Key Features:**
  - Advanced content customization for more personalized outputs.
  - Streamlined review and approval workflow for generated posts.
  - Enhanced scheduling options with auto-posting at peak engagement times.
- **Goals:**
  - Boost user satisfaction and engagement.
  - Refine the user interface for a smoother experience.
## Sprint 3: Platform Expansion
- **Objective:** Broaden Fubuu’s capabilities and market reach.
- **Key Features:**
  - Integration with additional social media platforms (e.g., Instagram, Facebook) beyond our core channels.
  - Introduction of multi-language support for global accessibility.
  - Development of collaboration tools for teams managing social media.
- **Goals:**
  - Expand our user base internationally.
  - Empower users with cross-platform content creation and management.
## Sprint 4: Advanced AI & Global Scaling
- **Objective:** Leverage advanced AI and scale the platform globally.
- **Key Features:**
  - Implementation of next-generation AI models for enhanced content virality.
  - Optimization of infrastructure for reliable global performance.
  - Continuous improvements driven by user analytics and feedback.
- **Goals:**
  - Establish Fubuu as the go-to solution for effortless social media growth.
  - Adapt and evolve the product to meet the changing needs of our users.
Stay tuned as we continue to evolve Fubuu and transform the way you grow your social media presence—effortlessly, powered by your thoughts.
  `;

  return (
    <div className='w-full bg-black'>
      <div className='mx-auto max-w-3xl px-4 md:px-6'>
        <div className='mb-16 mt-16 rounded-lg'>
          <div className='scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-600 scrollbar-track-transparent overflow-y-auto px-6 py-8 md:px-8'>
            <div className='prose prose-invert max-w-none'>
              <ReactMarkdown components={markdownComponents}>
                {markdownContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
