import Post from "../schemas/post.schema.js";

export const createPost = async(req, res) => {
    try{
        const { title, description, category, scope, skillsRequired, teamSize } = req.body;
        if (!title || !description || !category) {
            console.log(`[ERROR] Title, description and category fields are required.`)
            return res.status(400).json({
                message: "Title, description and category fields are required."
            });
        }

        const post = await Post.create({
            title,
            description,
            category,
            scope,
            skillsRequired,
            teamSize,
            createdBy: req.user.userId
        });
        console.log(`[INFO] Post Created..`)
        res.status(201).json({
            message: "Post created successfully",
            post
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to create post",
            error: error.message
        });
    }
};


export const getAnnouncements = async (req, res) => {
    try{
        const { category } = req.query;

        const filter = {};
        if (category) {
            filter.category = category;
        }

        const posts = await Post.find(filter)
        .sort({ created: -1 })
        .populate("createdBy", "name email");

        return res.status(200).json(posts);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to fetch announcements",
            error: error.message
        });
    }
};


export const getRooms = async (req, res) => {
    try{
        const posts = await Post.find({ isOpen: true })
        .sort({ createdAt: -1 })
        .populate("createdBy", "name email");

        return res.status(200).json(posts);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to fetch rooms",
            error: error.message
        });
    }
};