import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    Date:{
        type:Date,
        require:true
    },
    Time:{
        type:String,
        require:true
    },
    Position:{
        type:String,
        require:true
    },
    Candidate:{
        type:String,
        require:true
    },
    Recruiter:{
        type:String,
        require:true
    },
    Mode:{
        type:String,
        require:true,
        enum:['Online','Offline']
    },
    Status:{
        type:String,
        require:true,
        enum:['Completed','upcoming','Incomplete']
    },
    Reschedule:{
        type:Boolean,
        require:true
    }

},{timestamps: true})

const candidateDetails = mongoose.model ('candidateDetails',userSchema);
export default candidateDetails;