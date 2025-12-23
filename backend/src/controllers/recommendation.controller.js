import Room from "../schemas/rooms.schema.js";
import User from "../schemas/user.schema.js";

export const getSuggestedUsers = async (req, res) => {
    try{
        const { roomId } = req.params;
        const userId = req.user.userId;
        
        const room = await Room.findById(roomId).populate("post");
        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        if (room.admin.toString() !== userId) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const requiredSkills = room.post.skillsRequired.map((s) => 
            s.toLowerCase()
        );

        const candidates = await User.find({
            _id: {
                $nin: [
                    room.admin,
                    room.members.map((m) => m.user)
                ]
            },
            skills: { $exists: true, $ne: [] }
        }).select("name skills");

        const suggestions = candidates
          .map((user) => {
            let score = 0;

            user.skills.forEach((skill) => {
                if (requiredSkills.includes(skill.name.toLowerCase())) {
                    score += skill.score;
                }
            });

            return {
                userId: user._id,
                name: user.name,
                matchScore: score
            };
          })
          .filter((u) => u.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 5);

        return res.status(200).json({
            suggestions,
            note:
              suggestions.length === 0
                ? "No suitable candidate found. Candidates must upload resume to be recommended."
                : undefined
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to fecth recommendations",
            error: error.message
        });
    }
};