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

export default function TermsOfService() {
  const markdownContent = `

# Terms of Service

**Effective Date:** February 13, 2025

Welcome to Fubuu, your effortless Twitter growth assistant. Fubuu transforms your WhatsApp voice notes and meeting transcripts into engaging, viral tweets that help accelerate your Twitter presence. These Terms of Service ("Terms") govern your access to and use of our services—including our AI-powered tweet generation, Twitter integration, and any associated websites, applications, or features (collectively, the "Services").

By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, please refrain from using our Services.

## 1. Eligibility

- **Minimum Age:** You must be at least 13 years old to use our Services.
- **Compliance:** By using our Services, you represent and warrant that you comply with all applicable laws and regulations.

## 2. Account Responsibilities

- **Account Information:** You agree to provide accurate, complete, and updated information when signing up for our Services.
- **Account Security:** You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
- **Unauthorized Access:** Notify us immediately at support@example.com if you suspect any unauthorized use of your account.

## 3. Subscription and Free Trial

- **Free Trial:** Fubuu offers a 7-day free trial for new users, giving you full access to the Services during this period.
- **Subscription:** After the trial period, you will be charged for continued use of the Services in accordance with the pricing plan you select. Payment details provided during sign-up will be used for subscription charges.
- **Cancellation:** You may cancel your subscription at any time. Cancellation does not entitle you to a refund for any fees already paid.

## 4. Use of Services

- **Permitted Use:** You may use our Services for personal, non-commercial purposes in compliance with these Terms.
- **Prohibited Use:** You agree not to:
  - Access or use our Services for any unlawful or harmful activities.
  - Interfere with the operation of the Services or access them using unauthorized methods (e.g., automated bots or scraping).
  - Reproduce, distribute, or modify any part of the Services without prior written consent.

## 5. User Content and Voice Notes

- **Voice Notes and Transcripts:** By sending a WhatsApp voice note to our designated number or uploading meeting transcripts, you provide us with content that we process and transform into Twitter posts.
- **License:** You grant Fubuu a non-exclusive, worldwide, royalty-free license to process, transform, and use your content solely for the purpose of providing the Services.
- **Ownership:** You retain all rights to your content. Fubuu will use your content only in accordance with your instructions and our Privacy Policy.

## 6. Social Media Integration

- **Twitter Connection:** Our Services may require you to connect your Twitter account to facilitate the creation and posting of AI-generated tweets.
- **Authorization:** By connecting your Twitter account, you authorize Fubuu to post tweets on your behalf as approved by you.
- **Third-Party Terms:** Your use of Twitter in connection with our Services is subject to Twitter's terms and conditions, and you are solely responsible for compliance with those terms.

## 7. Intellectual Property

All content, trademarks, logos, and other materials provided through the Services are owned by Fubuu or its licensors. You may not use, copy, or distribute these materials without explicit written permission, except as expressly allowed by these Terms.

## 8. Privacy

Your use of our Services is governed by our [Privacy Policy](#), which explains how we collect, use, and protect your data—including voice notes and social media information. By using the Services, you consent to our collection and use of your data as described in the Privacy Policy.

## 9. Modifications to Services

We may update, suspend, or discontinue the Services or any part thereof at our discretion and without notice. We are not liable for any modification, suspension, or discontinuation of the Services.

## 10. Third-Party Links

Our Services may include links to third-party websites or services. These links are provided for your convenience, and Fubuu is not responsible for the content or privacy practices of those third-party sites. Use them at your own risk.

## 11. Limitation of Liability

- **As-Is Basis:** The Services are provided "as-is" and "as available" without warranties of any kind, express or implied.
- **No Liability:** To the maximum extent permitted by law, Fubuu is not liable for any indirect, incidental, or consequential damages arising from your use of the Services.

## 12. Indemnification

You agree to indemnify, defend, and hold harmless Fubuu, its affiliates, officers, and employees from any claims, liabilities, damages, or expenses (including legal fees) arising from:
- Your use or misuse of the Services.
- Your violation of these Terms.

## 13. Termination

We reserve the right to suspend or terminate your access to the Services if you violate these Terms or engage in prohibited activities. Upon termination, your rights to use the Services will immediately cease.

## 14. Governing Law

These Terms are governed by and construed in accordance with the laws of the State of Wyoming, USA. Any disputes arising under these Terms will be subject to the exclusive jurisdiction of the courts located in Wyoming.

## 15. Changes to These Terms

We may revise these Terms from time to time. Significant changes will be communicated through email or via our website. Your continued use of the Services constitutes acceptance of the revised Terms.

## 16. Contact Information

If you have any questions, concerns, or feedback about these Terms, please contact us:
- **Email:** support@example.com
- **Address:** your company address
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
