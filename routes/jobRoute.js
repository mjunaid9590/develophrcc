const { validateJobInput, validateIdParam } = require("../middlewear/validator");
const JobModel = require("../model/JobModel");
const UserModel = require("../model/UserModel");
const{StatusCodes} = require("http-status-codes")
const route = require("express").Router();
const mongoose = require("mongoose")
const day = require("dayjs")
route.get("/", async(req, res)=>{
    try {
      
        const { search, jobStatus, jobType, sort } = req.query;

        const queryObject = {
          createdBy: req.user.userId,
        };
      
        if (search) {
          queryObject.$or = [
            { position: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
          ];
        }
      
        if (jobStatus && jobStatus !== 'all') {
          queryObject.jobStatus = jobStatus;
        }
        if (jobType && jobType !== 'all') {
          queryObject.jobType = jobType;
        }
      
        const sortOptions = {
          newest: '-createdAt',
          oldest: 'createdAt',
          'a-z': 'position',
          'z-a': '-position',
        };
      
        const sortKey = sortOptions[sort] || sortOptions.newest;
      
        // setup pagination
      
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
      
        const jobs = await JobModel.find(queryObject)
          .sort(sortKey)
          .skip(skip)
          .limit(limit);
      
        const totalJobs = await JobModel.countDocuments(queryObject);
        const numOfPages = Math.ceil(totalJobs / limit);
        res
          .status(StatusCodes.OK)
          .json({ totalJobs, numOfPages, currentPage: page, jobs });
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Please try again. There is some problem on server side."})
    }
})

// route.post("/", validateJobInput, async())


route.get("/stats", async(req, res)=>{
    try {
        let stats = await JobModel.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
            { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
          ]);
        
          stats = stats.reduce((acc, curr) => {
            const { _id: title, count } = curr;
            acc[title] = count;
            return acc;
          }, {});
        
          const defaultStats = {
            pending: stats.pending || 0,
            interview: stats.interview || 0,
            declined: stats.declined || 0,
          };
        
          let monthlyApplications = await JobModel.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
            {
              $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                count: { $sum: 1 },
              },
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 6 },
          ]);
        
          monthlyApplications = monthlyApplications
            .map((item) => {
              const {
                _id: { year, month },
                count,
              } = item;
        
              const date = day()
                .month(month - 1)
                .year(year)
                .format('MMM YY');
        
              return { date, count };
            })
            .reverse();
        
          res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
    } catch (err) {
      console.log(err)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"There is some problem on server side. Please try again."})
    }
})

route.get("/:id", async(req, res)=>{
    try {
        const job = await JobModel.findById(req.params.id);
  res.status(StatusCodes.OK).json({ job });
    } catch (err) {
        console.log(err)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"There is some problem on server side. Please try again."})
    }
})

route.patch("/:id", validateJobInput, validateIdParam, async(req, res)=>{
    try {
        const updatedJob = await JobModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
          });
        
          res.status(StatusCodes.OK).json({ msg: 'job modified', job: updatedJob });
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"There is some problem on server side. Please try again."})
        
    }
})

route.delete("/:id", validateIdParam, async(req, res)=>{
    try {
        const removedJob = await JobModel.findByIdAndDelete(req.params.id);
        res.status(StatusCodes.OK).json({ msg: 'job deleted', job: removedJob });
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"There is some problem on server side. Please try again."})
    }
})

module.exports = route;