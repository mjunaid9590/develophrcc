const { authorizePermissions, checkForTestUser } = require("../middlewear/authMiddlewear");
const UserModel = require("../model/UserModel");
const JobModel = require("../model/JobModel")
const { StatusCodes } = require("http-status-codes")
const route = require("express").Router();
const { validateUpdateUserInput } = require("../middlewear/validator")
const uploads = require("../middlewear/upload")
    route.get("/current-user", async (req, res) => {
        try {
            let user = await UserModel.findOne({ _id: req.user.userId })
            const userWithoutPassword = user.toJSON();
            res.status(StatusCodes.OK).json({ user: userWithoutPassword });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "There is some problem on server side. Please try again" })
        }
    })

const getApplicationStats = async (req, res) => {
    const users = await UserModel.countDocuments();
    const jobs = await JobModel.countDocuments();
    res.status(StatusCodes.OK).json({ users, jobs });
};
route.get('/admin/app-stats', 
    authorizePermissions('admin'),
    getApplicationStats,
);

route.patch(
    '/update-user',
    checkForTestUser,
    uploads.single('avatar'),
    validateUpdateUserInput,
    async (req, res) => {
        const newUser = { ...req.body };
        delete newUser.password;
        delete newUser.role;

        if (req.file) {
            // const file = formatImage(req.file);
            // const response = await cloudinary.v2.uploader.upload(file);
            // newUser.avatar = response.secure_url;
            // newUser.avatarPublicId = response.public_id;

            // new commented
            // console.log(req.file, req.files)
            // newUser.avtar = req.file.filename

            newUser.avtar = req.file.filename
            newUser.avatarPublicId = req.file.filename;


        }
        const updatedUser = await UserModel.findByIdAndUpdate(req.user.userId, newUser, { new: true });

        if (updatedUser) {
            res.status(StatusCodes.OK).json({ msg: 'update user' });
        } else {
            res.status(StatusCodes.REQUEST_TIMEOUT).json({ msg: "Please try again. There is some problem." })
        }
    }

);
module.exports = route;