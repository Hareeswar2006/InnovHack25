import Post from "../schemas/post.schema.js";
import { createRoom } from "../utils/createRoom.js";

export const createRoomLater = async (req, res) => {
    try{
        const { postId } = req.body;
        const userId = req.user.userId;
        
        if (!postId) {
            return res.status(400).json({
                message: "Post ID is required"
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.roomEnabled) {
            return res.status(400).json({
                message: "Room already exists for this post",
            });
        }

        const room = await createRoom(post, userId);

        return res.status(201).json({
            message: "Room created successfully",
            room: {
                id: room._id,
                roomCode: room.roomCode,
                status: room.status
            },
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};