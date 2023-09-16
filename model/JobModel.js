const mongoose = require("mongoose")
const JobSchema = new mongoose.Schema(
  {
    name:String,
    f_Name:String,
    trade:String,
    passportExp:String,
    dob:String,
    references:String,
    contact:String,
    status:String, 
    companyStatus:String,
    agency:String,
    selected:{type:String, default:"Active"},
    rejected:{type:String, default:"None"}
    ,company: String,
    position: String,
    payment:{type:String, default:"none"},
    passportNo:String,
    VisaStatus:String,
    jobStatus: {
      type: String,
      default: "pending",
    },
    jobType: {
      type: String,
      default: "full time",
    },
    jobLocation: {
      type: String,
      default: 'my city',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    ticket:{type:String, required:true},
    visa:{type:String, required:true},
    protector:{type:String, required:true},
    passport:{type:String, required:true}
  },
  { timestamps: true }
);

module.exports= mongoose.model('Job', JobSchema);
