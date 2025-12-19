import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            enum: ["project", "hackathon"],
            required: true
        },

        scope: {
            type: String,
            enum: ["public", "college"],
            default: "public"
        },

        skillsRequired: {
            type: [String],
            default: []
        },

        teamSize: {
            type: Number,
            default: 1
        },

        isOpen: {
            type: Boolean,
            default: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true
    }
);

const Post = mongoose.model("Post", postSchema);

export default Post;