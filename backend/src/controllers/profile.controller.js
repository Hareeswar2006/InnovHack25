import User from "../schemas/user.schema.js";
import { extractTextFromPDF } from "../utils/pdfToText.js";
import { parseResumeWithAI } from "../ai/resume.parser.js";
import { normalizeSkills } from "../ai/skillNormalizer.js";

export const uploadResume = async (req, res) => {
    try{
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF is required"
            });
        }

        const userId = req.user.userId;

        const resumeText = await extractTextFromPDF(req.file.buffer);

        const rawSkills = await parseResumeWithAI(resumeText);

        const finalSkills = await normalizeSkills(rawSkills);

        const user = await User.findByIdAndUpdate(
            userId,
            { skills: finalSkills },
            { new: true }
        ).select("name email skills");

        return res.status(200).json({
            message: "Resume uploaded and skills are extracted successfully",
            skills: user.skills
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to process resume",
            error: error.message
        });
    }
};