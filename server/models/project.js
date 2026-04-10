import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },

    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },

    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [200, "Description cannot be more than 200 characters"],
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },

    files: [
      {
        fileType: {
          type: String,
          required: true,
        },
        fileUrl: {
          type: String,
          required: true,
        },
        originalName: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    feedback: [
      {
        supervisorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        type: {
          type: String,
          enum: ["positive", "negative", "general"],
          default: "general",
        },
        message: {
          type: String,
          required: true,
          maxlength: [1000, "Feedback message cannot be more than 1000 characters"],
        },
      },
    ],

    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


projectSchema.index({ student: 1 });
projectSchema.index({ supervisor: 1 });
projectSchema.index({ status: 1 });



const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;