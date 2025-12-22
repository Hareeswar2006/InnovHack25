import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        },
        appliedAt: {
            type: Date,
            default: Date.now
        },
    },
    { _id: true }
);


const memberSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member"
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
    },
    { _id: false }
);


const roomSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            unique: true
        },

        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        roomCode: {
            type: String,
            required: true,
            unqiue: true,
            uppercase: true,
            index: true
        },

        members : [memberSchema],

        applications: [applicationSchema],

        teamSize: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["open", "full", "closed"],
            default: "open"
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Room", roomSchema);