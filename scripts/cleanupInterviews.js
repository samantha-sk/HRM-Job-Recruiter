import mongoose from 'mongoose';
import InterviewSchedule from '../src/model/InterviewScheduleSchema.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanupOldInterviews = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interview_management');
    console.log('Connected to MongoDB');

    // Find all active interviews for Priya Sharma
    const result = await InterviewSchedule.updateMany(
      {
        candidateName: 'Priya Sharma',
        status: { $in: ['Scheduled', 'OnHold', 'Rescheduled'] }
      },
      {
        $set: { status: 'Completed' }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} interviews to Completed status`);
    
    // Show all interviews for this candidate
    const allInterviews = await InterviewSchedule.find({
      candidateName: 'Priya Sharma'
    });

    console.log('\nAll interviews for Priya Sharma:');
    allInterviews.forEach((interview, index) => {
      console.log(`${index + 1}. Date: ${interview.interviewDate}, Time: ${interview.interviewTime}, Status: ${interview.status}`);
    });

    if (allInterviews.length === 0) {
      console.log('No interviews found for Priya Sharma');
    }

  } catch (error) {
    console.error('Error cleaning up interviews:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

cleanupOldInterviews();