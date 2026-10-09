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

export default function PrivacyPolicy() {
  const markdownContent = `
# Privacy Policy
**Effective Date:** January 15, 2025

At Fubuu, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and share information when you use our services—including our AI-powered tweet generation from WhatsApp voice notes and any associated mobile or web applications (collectively, the "Services").
## 1. Information We Collect
### 1.1 Information You Provide Directly
- **Personal Information:** When you sign up for Fubuu, we collect information such as your name, email address, and any other details you provide.
- **Feedback:** If you contact us or provide feedback, we collect the information you share with us.
### 1.2 Information Collected Automatically
- **Usage Data:** When you interact with our website or app, we may collect non-identifiable information such as browser type, operating system, IP address, and timestamps.
- **Cookies:** We use cookies to improve your experience, track preferences, and analyze traffic.
## 2. How We Use Your Information
We use the information collected for the following purposes:
- To deliver Fubuu’s AI-powered tweet generation service.
- To improve and personalize our services.
- To communicate with you about your account or service updates.
- To analyze trends and gather insights to enhance the user experience.
## 3. How We Share Your Information
We do not sell your personal information. We may share your data with third parties in the following cases:
- **Service Providers:** To deliver our services, analyze user behavior, or manage infrastructure.
- **Legal Obligations:** If required by law or to protect our rights.
- **With Your Consent:** When you explicitly agree to share your information.
## 4. Google API Services
Fubuu may use Google API Services to enhance our offerings. By using our Services:
- You agree to Google’s Privacy Policy.
- We will only access and use Google API data in ways that comply with Google’s API Services User Data Policy.
- We will not share or use your data for advertising purposes without your explicit consent.
## 5. Data Retention
We retain your information only as long as necessary to provide our Services or as required by law. You can request deletion of your data by contacting us.
## 6. Your Rights
- **Access and Update:** You can access or update your personal information at any time.
- **Opt-Out:** You can unsubscribe from communications using the link provided in each message.
- **Data Deletion:** Contact us to request the deletion of your data.
## 7. Security
We implement industry-standard security measures to protect your data. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
## 8. Third-Party Links
Our app or website may contain links to third-party websites or services. We are not responsible for their privacy practices or content.
## 9. Changes to This Privacy Policy
We may update this Privacy Policy from time to time. Changes will be communicated through email or on our website.
## 10. Contact Us
If you have questions or concerns about this Privacy Policy, please contact us:
- **Email:** support@example.com
- **Address:** your company address
---
Your Time Matters. Your Privacy Does Too.
Fubuu is committed to safeguarding your information and ensuring your data remains private and secure. Thank you for trusting us with your digital presence and content creation.
Need help with anything? We're here! Just send us a message on WhatsApp and we'll be happy to assist you.
---
**Terms of Service | Privacy Policy | Dev Roadmap**
*Made by Enzi Studio with love <3*
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
