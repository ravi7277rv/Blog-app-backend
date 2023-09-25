import { SC } from "../configs/status.js";
import jwt from 'jsonwebtoken';
import myConfig from "../configs/config.js";
import User from "../modules/userModule.js";


export const isAuthenticated = async (req, res, next) => {

        var token = req.headers.authorization;
   
    if(!token){
        return res
                .status(SC.UNAUTHORIZED)
                .json({
                    success:false,
                    message:"Your are Unauthorize, Login yourself",
                });
    };

    const decoded = jwt.verify(token,myConfig.key.jwt_secret);

    let id = decoded.user._id;
     let userData = await User.findById(id);


     req.user = userData;
     
    next();
}