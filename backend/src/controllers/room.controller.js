import Post from "../schemas/post.schema.js";
import Room from "../schemas/rooms.schema.js";
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


export const getActiveRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: "open" })
      .populate({
        path: "post",
        select: "title description category skillsRequired teamSize scope createdAt",
        populate: {
          path: "createdBy",
          select: "name profilePic",
        },
      })
      .sort({ createdAt: -1 });

    const formattedRooms = rooms.map((room) => ({
      roomId: room._id,              
      status: room.status,
      teamSize: room.teamSize,
      membersCount: room.members.length,
      post: room.post,
      createdAt: room.createdAt,
    }));

    return res.status(200).json({
      rooms: formattedRooms,
    });
  } 
  catch (error) {
    return res.status(500).json({
      message: "Failed to fetch active rooms",
      error: error.message,
    });
  }
};
