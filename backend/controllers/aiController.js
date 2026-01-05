import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
// import { model } from 'mongoose'; // remove if not used

// Make sure GEMINI_API_KEY is set in your .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateOutline = async (req, res) => {
  try {
    const { topic, style, numChapters, description } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Please provide a topic' });
    }

    const chaptersCount = numChapters || 5;
    const writingStyle = style || 'Neutral';

    const prompt = `
You are an expert book outline generator. Create a comprehensive book outline based on the following requirements:

Topic: "${topic}"
${description ? `Description: ${description}` : ''}
Writing style: ${writingStyle}
Number of Chapters: ${chaptersCount}

Requirements:
1. Generate exactly ${chaptersCount} chapters.
2. Each chapter title should be clear, engaging and follow a logical progression.
3. Each chapter description should be 2-3 sentences explaining what the chapter covers.
4. Ensure chapters build upon each other coherently.
5. Match the "${writingStyle}" writing style in your titles and descriptions.

Output format:
Return ONLY a valid JSON array with no additional text, markdown, or formatting.
Each object must have exactly two keys: "title" and "description".

Example structure:
[
  {
    "title": "Chapter 1: Introduction to the Topic",
    "description": "A comprehensive overview introducing the main concepts. Sets the foundation for understanding the subject matter."
  },
  {
    "title": "Chapter 2: Core Principle",
    "description": "Explores the foundational principle and theories, providing detailed examples and real-world applications."
  }
]

Generate the outline now.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt, // text input is allowed by the SDK [web:29][web:14]
    });

    const text = response.text || '';

    const startIndex = text.indexOf('[');
    const endIndex = text.lastIndexOf(']');

    if (startIndex === -1 || endIndex === -1) {
      console.error('Could not find JSON array in AI response:', text);
      return res.status(500).json({
        message: 'Failed to parse AI response, no JSON array found.',
      });
    }

    const jsonString = text.substring(startIndex, endIndex + 1);

    try {
      const outline = JSON.parse(jsonString);
      return res.status(200).json({ outline });
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', jsonString);
      return res.status(500).json({
        message:
          'Failed to generate a valid outline. The AI response was not valid JSON.',
      });
    }
  } catch (error) {
    console.error('Error generating outline:', error);
    return res.status(500).json({
      message: 'Server error during AI outline generation',
    });
  }
};

export const generateChapterContent = async (req, res) => {
  try {
    const { chapterTitle, chapterDescription, style } = req.body;

    if (!chapterTitle) {
      return res.status(400).json({
        message: 'Please provide a chapter title',
      });
    }

    const writingStyle = style || 'Neutral';

    const prompt = `
You are an expert writer specializing in ${writingStyle} content. Write a complete chapter for a book with the following specifications:

Chapter title: "${chapterTitle}"
${chapterDescription ? `Chapter description: ${chapterDescription}` : ''}
Writing Style: ${writingStyle}
Target Length: Comprehensive and detailed (aim for 2000 - 3000 words).

Requirements:
1. Write in a ${writingStyle.toLowerCase()} tone throughout the chapter.
2. Structure the content with clear sections and smooth transitions.
3. Include relevant examples, explanations, or anecdotes as appropriate for the style.
4. Ensure the content flows logically from introduction to conclusion.
${chapterDescription ? '5. Cover all points mentioned in the chapter description.' : ''}

Format guidelines:
- Start with a compelling opening paragraph.
- Use clear paragraph breaks for readability.
- Include subheadings if appropriate for the content length.
- End with a strong conclusion or transition to the next chapter.
- Write in plain text without markdown formatting.

Begin writing the chapter content now:
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    const text = response.text || '';

    return res.status(200).json({
      content: text,
    });
  } catch (error) {
    console.error('Error generating chapter:', error);
    return res.status(500).json({
      message: 'Server error during AI chapter generation',
    });
  }
};
