import mongoose from 'mongoose';
import Application from '../src/model/applicantSchema.js';
import Job from '../src/model/jobSchema.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interview_management');
    console.log('Connected to MongoDB');

    // Create a test job first
    const testJob = new Job({
      _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
      jobTitle: 'Full Stack Developer',
      jobRole: 'Full Stack Developer',
      department: 'Engineering',
      jobLocation: 'Remote',
      jobType: 'Full-time',
      hiringManager: 'Sarah Wilson',
      numberOfOpenings: 2,
      closingDate: new Date('2025-12-31'),
      about: 'We are looking for a skilled full stack developer to join our engineering team.',
      responsibilities: 'Develop and maintain web applications, collaborate with team members, write clean code',
      requirements: 'JavaScript, React, Node.js, MongoDB experience required',
      preferredQualifications: 'Experience with cloud platforms, CI/CD pipelines',
      lookingFor: 'Passionate developer with 3+ years experience in full stack development',
      jobStatus: 'Open',
      applicantsCount: 0
    });

    // Save job (if it doesn't exist)
    try {
      await testJob.save();
      console.log('Test job created with ID: 507f1f77bcf86cd799439011');
    } catch (error) {
      if (error.code === 11000) {
        console.log('Test job already exists');
      } else {
        throw error;
      }
    }

    // Create a test candidate/applicant
    const testCandidate = new Application({
      _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
      jobId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
      firstName: 'Priya',
      lastName: 'Sharma',
      address1: 'House No. 123, Block A',
      address2: 'Sector 15, Rohini',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110085',
      email: 'priya.sharma@example.com',
      contactNumber: '9876543210',
      gender: 'Female',
      experienceLevel: 'Mid Level',
      education: [{
        institution: 'Delhi University',
        degreeLevel: "Bachelor's level Degree",
        program: 'Computer Science',
        startDate: new Date('2018-07-01'),
        endDate: new Date('2022-06-30'),
        pursuing: false,
        yearOfGraduation: 2022,
        gpaOrPercent: 8.5
      }],
      experience: [{
        companyName: 'Tech Solutions Pvt Ltd',
        role: 'Junior Developer',
        startDate: new Date('2022-08-01'),
        endDate: new Date('2024-12-31'),
        responsibility: 'Developed web applications using React and Node.js',
        currentCTC: 600000,
        expectedCTC: 1000000,
        noticePeriod: '30 days'
      }],
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      referralSource: 'LinkedIn',
      profileStatus: 'Applied',
      attachments: [],
      termsAccepted: true,
      consent: true,
      appliedOn: new Date()
    });

    // Save candidate (if it doesn't exist)
    try {
      await testCandidate.save();
      console.log('Test candidate created with ID: 507f1f77bcf86cd799439012');
    } catch (error) {
      if (error.code === 11000) {
        console.log('Test candidate already exists');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Test data created successfully!');
    console.log('Job ID: 507f1f77bcf86cd799439011');
    console.log('Candidate ID: 507f1f77bcf86cd799439012');
    console.log('\nYou can now test the scheduling API with these IDs.');

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createTestData();