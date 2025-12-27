import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            reuired: true,
            trim: true
        },
        
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        college: {
            type: String,
            required: false,
            default: null
        },

        password: {
            type: String,
            required: true,
            select: false
        },

       skills: [
            {
                name: {
                    type: String,
                    required: true,
                },
                score: {
                    type: Number,
                    required: true,
                },
                category: {
                    type: String,
                    required: true,
                },
                source: {
                    type: String,
                    enum: ["resume", "github", "manual"],
                    default: "resume",
                },
            },
        ],

        profilePic: {
            type: String,
            default: "https://api.dicebear.com/7.x/initials/svg?seed=User"
        }

    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;