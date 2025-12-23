import "../envloader.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const buildPrompt = (resumeText) => `
You are an expert technical recuiter.

Task:
Extract ONLY technical skills from the resume text below.
For each skill:
- Assign a confidence score (0-100)
- Assign a category

Allowed categories (use ONLY these):
- Programming Language
- Framework
- Machine Learning
- Database
- DevOps
- Tool
- Cloud
- Other

Rules:
- Prefer specific technologies over generic terms
- Use "Tool" ONLY for IDEs, editors, utilities

Scoring rules:
- Higher score if the skill is used in projects or experience
- Medium score if mentioned in skills section only
- Low score if mentioned briefly or indirectly
- DO NOT invent skills
- DO NOT include soft skills
- DO NOT include explanations

Return ONLY valid JSON in the following format:

{
    "skills": [
    {
      "name": "string",
      "score": number,
      "category": "string"
    }
  ]
}

Resume text:
"""
${resumeText}
"""
`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const parseResumeWithAI = async (resumeText) => {
    try{

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing in .env file");
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = buildPrompt(resumeText);

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const cleaned = responseText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const parsed = JSON.parse(cleaned);

        if (!parsed.skills || !Array.isArray(parsed.skills)) {
            throw new Error("Invalid AI response format");
        }

        return parsed.skills;
    }
    catch (error) {
        console.error("AI PARSING ERROR:");
        console.error(error.message);
        if (error.response) console.error(error.response);
        throw new Error("AI resume parsing failed: " + error.message);
    }
};
