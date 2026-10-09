# prompts.py

VIRAL_TWITTER_CUSTOM_PROMPT = """
# ======= GENERAL INSTRUCTIONS =======
Create a Twitter post based on the custom prompt provided below.
The content to be considered for the post is between <user input> and </user input> tags.
Your response will be used as is to be posted so don't include things like "As an AI model.." or anything that shouldn't be in the final post.
Must stay within Twitter's 280 character limit.

<user input>
{raw_text}
</user input>

<custom prompt>
{custom_prompt}
</custom prompt>
"""

VIRAL_TWITTER_PROMPT = """
# ======= GENERAL INSTRUCTIONS =======
Create a Twitter post following the default prompt below if no custom prompt is provided.
The content to be considered for the post is between <user input> and </user input> tags.
Your response will be used as is to be posted so don't include things like "As an AI model.." or anything that shouldn't be in the final post.
Must stay within Twitter's 280 character limit.

<user input>
{raw_text}
</user input>

<default prompt>
I am a {description}, keeping that in mind if relevant, turn the <user input> into a tweet. Decide the length needed to capture the core message, but keep it under 280 characters and include a captivating hook. If needed, add line breaks while maintaining the same style/trend/theme as the original message—stay professional. 
Below are <best practices> (use what's needed, no need to include them all):
<best practices>
•Be concise: Aim for clarity and brevity—stick to 1–2 sentences when possible. Twitter is fast-paced; make every word count.
•Lead with the hook: Start with the most important or intriguing words to grab attention.
•Use active voice and strong verbs: Avoid passive language to keep tweets dynamic and engaging.
•If it makes sense, ask questions or prompt action: Encourage replies, retweets, or clicks with phrases like "What do you think?" or "Tap below."
•Keep it conversational: Write in a natural, relatable tone—avoid jargon or overly formal language.
•Highlight urgency or timeliness: Use phrases like "Now live," "Breaking," or "Last chance" to capitalize on FOMO.
•Optimize for readability: Use line breaks, bullet points (•), or em dashes (—) to structure text for quick scanning.
•Include a clear CTA if needed: Direct followers to "Retweet," "Click the link," or "Follow" for desired outcomes.
•Test humor and wit: Clever wordplay or lightheartedness can help tweets stand out (while aligning with your brand voice).
•Prioritize value: Ensure every tweet offers something useful—information, entertainment, inspiration, or a solution.
</best practices>
</default prompt>
"""

VIRAL_LINKEDIN_CUSTOM_PROMPT = """
# ======= GENERAL INSTRUCTIONS =======
Create a LinkedIn post based on the custom prompt provided below.
The content to be considered for the post is between <user input> and </user input> tags.
Your response will be used as is to be posted so don't include things like "As an AI model.." or anything that shouldn't be in the final post.
Must stay within LinkedIn's 1500 character limit.
Give me the pure LinkedIn post content only as your response nothing else.

<user input>
{raw_text}
</user input>

<custom prompt>
{custom_prompt}
</custom prompt>
"""

VIRAL_LINKEDIN_PROMPT = """
# ======= GENERAL INSTRUCTIONS =======
Create a LinkedIn post following the default prompt below if no custom prompt is provided.
The content to be considered for the post is between <user input> and </user input> tags.
Your response will be used as is to be posted so don't include things like "As an AI model.." or anything that shouldn't be in the final post.
Must stay within LinkedIn's 1500 character limit.
Give me the pure LinkedIn post content only as your response nothing else.

<user input>
{raw_text}
</user input>

<default prompt>
I am a {description}, keeping that in mind if relevant, turn the <user input> content into a LinkedIn Post. Decide the length needed to capture the core message include a captivating hook, make it concise. If needed, add line breaks while maintaining the same style/trend/theme as the original message—stay professional. Below are <best practices> ONLY use what's needed, they are all best practices, just choose a few :
<best practices>
* Balance conciseness with depth: Keep paragraphs short and concise but provide meaningful insights—LinkedIn audiences value professional context and substance.
* Lead with a professional hook: Start with a bold statement, question, or problem your audience cares about (e.g., "90% of leaders overlook this critical skill…").
* Use a polished yet relatable tone: Maintain professionalism without sounding robotic—share personal anecdotes or lessons learned to humanize your message.
* Incorporate storytelling: Share success stories, failures, or case studies to illustrate your point and build credibility.
* Leverage formatting for readability:
    * Break up text with bullet points (•), numbered lists, or em dashes (—).
    * Use spacing between paragraphs to avoid walls of text.
* Tag relevant people/companies: Mention collaborators, influencers, or organizations to expand reach and foster professional connections.
* Ask thoughtful questions: Encourage discussion with prompts like, "How would you handle this?" or "What's your take?"
* Highlight industry trends or data: Use phrases like "New research shows…" or "2024's biggest challenge…" to position yourself as a thought leader.
* Include a clear CTA: Direct readers to "Comment below," "Share your experience," or "Read the full article" to drive engagement.
* Use 3–5 targeted hashtags: Boost discoverability with niche or industry-specific hashtags (e.g., #LeadershipDevelopment, #Sustainability).
* Emphasize value over promotion: Focus on actionable advice, career tips, or industry insights—avoid overtly salesy language.
* Align with LinkedIn's culture: Participate in trending topics (e.g., #CareerAdvice, #RemoteWork) or share motivational content that resonates with professionals.
</best practices>
</default prompt>
"""
