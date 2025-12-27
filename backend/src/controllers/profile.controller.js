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


export const updateProfile = async (req, res) => {
    try {
        const { name, college } = req.body;
        const userId = req.user.userId; // Extracted from your auth middleware

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 🟢 LOGIC: Only allow name updates freely
        if (name) user.name = name;

        // 🟢 LOGIC: Only allow college update if it's currently empty/null
        if (college && (!user.college || user.college.trim() === "")) {
            user.college = college;
        } else if (college && user.college !== college) {
            // If they try to change an existing college name, block it
            return res.status(403).json({ 
                message: "College name is locked and cannot be changed once set." 
            });
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                college: user.college,
                skills: user.skills
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};