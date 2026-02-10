import mongoose from "mongoose";

const screeningSchema = new mongoose.Schema({
  addQuestions: [{ type: String, trim: true }],
  rounds: [
    {
      roundType: {
        type: String,
        enum: ["aptitude", "technical", "non-technical", "interview"],
        required: true,
      },
      tasks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Task",
        },
      ],
    },
  ],
}, { timestamps: true });

screeningSchema.virtual("noOfRounds").get(function () {
  return this.rounds.length;
});

screeningSchema.virtual("roundsWithNo").get(function () {
  return this.rounds.map((round, index) => ({
    roundNo: index + 1,
    ...round.toObject(),
  }));
});

screeningSchema.set("toJSON", { virtuals: true });
screeningSchema.set("toObject", { virtuals: true });

export default mongoose.model("Screening", screeningSchema);