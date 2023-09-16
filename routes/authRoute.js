const UserModel = require("../model/UserModel")
const { StatusCodes } = require("http-status-codes");

const route = require("express").Router();
const bcrypt = require("bcrypt")
const {createJWT} = require("../middlewear/token")
route.post("/register", async(req, res)=>{
    try {
        // first chek the user exist or not
        let userExist = await UserModel.findOne({email:req.body.email})
        if(userExist){
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({msg:"The user is also exist."})
        }
        let users = await UserModel.find({})
        req.body.password = await bcrypt.hash(req.body.password, 10)
        if(users === null || users.length ===0){
            req.body.role="Admin";
            let data = UserModel(req.body);
            data.save().then(response=>{
                if(response){
                    res.status(StatusCodes.CREATED).json({msg:"user is created"})
                }
            }).catch(err=>{
                res.status(StatusCodes.UNAUTHORIZED).json({msg:"There is some error. Please try again."})
            })
        }else{
            req.body.role= "user";
            let data = UserModel(req.body);
            data.save().then(response=>{
                if(response){
                    res.status(StatusCodes.CREATED).json({msg:"user is created"})
                }
            }).catch(err=>{
                res.status(StatusCodes.UNAUTHORIZED).json({msg:"There is some error. Please try again."})
            })
        }
    } catch (err) {
        console.log(err)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"There is some error on server side. Please try again."})
        
    }
})

route.post('/login',  async(req, res)=>{
    try {
        let user = await UserModel.findOne({email:req.body.email});
        if(user){
            let compare = await bcrypt.compare(req.body.password, user.password)
            if(compare){
                const token = createJWT({ userId: user._id, role: user.role });

                const oneDay = 1000 * 60 * 60 * 24;
              
                res.cookie('token', token, {
                  httpOnly: true,
                  expires: new Date(Date.now() + oneDay),
                  secure:'production',
                });
                res.status(StatusCodes.OK).json({ msg: 'user logged in' });
            }else{
                res.status(StatusCodes.NOT_FOUND).json({msg:"You entered incorrect password. Please try again."})
            }
        }else{
            res.status(StatusCodes.NOT_FOUND).json({msg:"There is no user with that email address."})
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"There is some problem on server side. Please try again", error:error})
    }
});

route.get("/logout", async(req, res)=>{
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
      });
      res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
})

module.exports = route