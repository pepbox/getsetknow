import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log("MONGO_URI", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seeding check to mark the first 6 questions as default
    try {
      const { Question } = require('../modules/questions/models/question.model');
      const defaultCount = await Question.countDocuments({ isDefault: true });
      if (defaultCount === 0) {
        const firstSix = await Question.find({}).sort({ createdAt: 1 }).limit(6);
        if (firstSix.length > 0) {
          const ids = firstSix.map((q: any) => q._id);
          await Question.updateMany({ _id: { $in: ids } }, { $set: { isDefault: true } });
          console.log(`Successfully marked the first ${firstSix.length} questions as default.`);
        }
      }
    } catch (seedError) {
      console.error("Error seeding default questions:", seedError);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${error}`);
    }

    process.exit(1);
  }
};

export default connectDB;
