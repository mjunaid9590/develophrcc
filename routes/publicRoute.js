const { StatusCodes } = require("http-status-codes");

const route = require("express").Router();
const JobModel = require("../model/JobModel")
route.get("/get/job/", async (req, res) => {
    try {
        let id = req.query.id;
        if (id) {
            let jobData = await JobModel.findOne({ _id: id })
            return res.send({ done: true, data: jobData })

        }
        res.status(404).send({ done: false, data: "There is no data on this id. Please try again" })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "There is some problem on server side." })
    }
})


module.exports = route