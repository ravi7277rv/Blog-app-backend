import User from '../modules/userModule.js';
import Post from '../modules/postModule.js';
import { SC } from '../configs/status.js';
import pQueue from 'p-queue';
import { HashPassowrd } from '../utils/hashPass.js';
import { IsValidEmail } from '../utils/validEmail.js';
import { VerifyPassword } from '../utils/verifyPass.js';
import { GeneratorOfToken } from '../utils/sendToken.js';
import { ValidPhone } from '../utils/validPhone.js';
import cloudinary from 'cloudinary';




//Ceating a new user with the required credentials
export const createUser = async (req, res, next) => {

    try {

        //Getting the data from the body as following :
        const { name, email, phone, password } = req.body;

        // console.log(name);
        // console.log(email);
        // console.log(phone);
        // console.log(password);
        // console.log(req.body.avatar);

        //Checking whether the field are empty or null
        if (!name || !email || !phone || !password) {
            return res.status(SC.BAD_REQUEST).json({
                success: false,
                message: "One or more fields should not be empty",
                data: null,
            });
        };


        // Validating the Email where it is correct of not
        let validEmail = IsValidEmail(email);
        if (!validEmail) {
            return res
                .status(SC.BAD_REQUEST)
                .json({
                    success: false,
                    message: "A valid Email is required",
                    data: null,
                });
        };

        // Convert the phone number to a string and get its length
        const phoneString = phone.toString();
        const phoneLength = phoneString.length;

        // Check if the phone number has 10 digits
        if (phoneLength !== 10) {
            return res.status(SC.BAD_REQUEST).json({
                success: false,
                message: "Phone no should be of 10 digits",
                data: null,
            });
        }




        //Finding whether the user exist of not 
        let user = await User.findOne({ email });
        if (user) {
            return res
                .status(SC.BAD_REQUEST)
                .json({
                    success: false,
                    message: "User already exist",
                    data: null,
                });
        };

        let hashpass = HashPassowrd(password);


        //uploading the images to the cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "UserAvatar",
            width: 150,
            crop: "scale",
        })

        //Creating a new user
        user = await User.create({
            name,
            email,
            phone,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.url
            },
            password: hashpass
        });


        //Generating Token with the help of GeneratorOfToken method
        const token = GeneratorOfToken(user);

        //Sending the response to the frontend while setting the token in cookies

        // const options = {
        //     expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        //     httpOnly: true
        // }
        return res
            .status(SC.OK)
            // .cookie("token", token, options)
            .json({
                success: true,
                message: "User Created Successfully",
                data: user,
                token,
            });

        next();

    } catch (error) {
        return res.status(SC.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
            data: null,
        });
    };
};



//Logging the user with the valid credentials
export const loginUser = async (req, res, next) => {

    try {

        //Getting the value form the body
        const { email, password } = req.body;

        console.log(email)
        console.log(password)

        if (!email || !password) {
            return res
                .status(SC.BAD_REQUEST)
                .json({
                    success: false,
                    message: "One or more field is empty",
                    data: null,
                });
        };

        //Validating email is correct or not
        let valid = IsValidEmail(email);
        if (!valid) {
            return res
                .status(SC.BAD_REQUEST)
                .json({
                    success: false,
                    message: "Enter is Incorrect",
                    data: null,
                });
        };


        //finding whether user exist with this email or not
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res
                .status(SC.BAD_REQUEST)
                .json({
                    success: false,
                    message: "User does not exist",
                    data: null,
                });
        };


        //Matching the password whether it is correct or wrong
        let isMatched = VerifyPassword(password, user.password);
        if (!isMatched) {
            return res
                .status(SC.BAD_REQUEST)
                .json({
                    success: false,
                    message: "Invalild Email or Password",
                    data: null,
                });
        };


        //Generating Token with the help of GeneratorOfToken method
        const token = GeneratorOfToken(user);



        //this is the options for the cookie
        // const options = {
        //     expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        //     httpOnly: true
        // };


        //Sending the response to the frontend while setting the token in cookies
        return res
            .status(SC.OK)
            // .cookie("token", token, options)
            .json({
                success: true,
                message: "User Logged In Successfully",
                data: user,
                token,
            });

            next();

    } catch (error) {
        return res
            .status(SC.INTERNAL_SERVER_ERROR)
            .json({
                success: false,
                message: error.message,
                data: null,
            });
    };
};





//following or followers of the user
export const followingOrFollower = async (req, res, next) => {

    try {

        const { id } = req.params;

        if (!id) {
            return res
                .status(SC.BAD_REQUEST)
                .json({
                    success: false,
                    message: "User to follow does not exist",
                });
        };

        const userloggedIn = await User.findById(req.user._id);
        const userToFollow = await User.findById(id);

        if (userloggedIn.following.includes(userToFollow._id)) {
            const index = userloggedIn.following.indexOf(userToFollow._id);

            userloggedIn.following.splice(index, 1);

            await userloggedIn.save();

            const index2 = userToFollow.followers.indexOf(userloggedIn._id);
            userToFollow.followers.splice(index2, 1);
            await userToFollow.save();

            return res
                .status(SC.OK)
                .json({
                    success: true,
                    message: "User is unfollowed"
                });

        } else {

            userloggedIn.following.push(userToFollow._id);
            userToFollow.followers.push(userloggedIn._id);

            await userToFollow.save();
            await userloggedIn.save();

            return res
                .status(SC.OK)
                .json({
                    success: true,
                    message: "User is followed",
                });
        };

        next();

    } catch (error) {
        return res
            .status(SC.INTERNAL_SERVER_ERROR)
            .json({
                success: false,
                message: error.message
            });
    };
};





//Update user Password
export const updateProfilePassword = async (req, res, next) => {

    try {

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res
                .status(SC.BAD_REQUEST)
                .json({
                    success: false,
                    message: "Enter both Password",
                });
        };

        const user = await User.findById(req.user._id).select("+password");

        const isMatched = VerifyPassword(oldPassword, user.password);

        if (!isMatched) {
            return res
                .status(SC.BAD_REQUEST)
                .json({
                    success: false,
                    message: "Old Password does not matched",
                });
        };

        const hashPas = HashPassowrd(newPassword);

        user.password = hashPas;

        await user.save();


        return res
            .status(SC.OK)
            .json({
                success: true,
                message: "Password Updated",
                data: user,
            })

    } catch (error) {
        return res
            .status(SC.INTERNAL_SERVER_ERROR)
            .json({
                success: false,
                message: error.message,
            });
    };
};





//Update Profile which include Name Email Phone
export const updateUserProfile = async (req, res, next) => {

    try {

        const { name, email, phone, role } = req.body;

        if (!name, !email, !phone, !role) {
            return res
                .status(SC.BAD_REQUEST)
                .json({
                    success: false,
                    message: "One or more field should not be empty",
                });
        };

        let validEmail = IsValidEmail(email);
        if (!validEmail) {
            return res
                .status(SC.BAD_REQUEST)
                .json({
                    success: false,
                    message: "Enter a correct Email-Id"
                });
        };

        let validPhone = ValidPhone(phone);
        if (!validPhone) {
            return res
                .status(SC.BAD_REQUEST)
                .json({
                    success: false,
                    message: "Phone no should be 10 digits",
                });
        };

        const user = await User.findById(req.user._id);

        user.name = name;
        user.email = email;
        user.phone = phone;
        user.role = role;

        await user.save();

        return res
            .status(SC.OK)
            .json({
                success: true,
                message: "User profile Updated Successfully",
                data: user,
            })


    } catch (error) {
        return res
            .status(SC.INTERNAL_SERVER_ERROR)
            .json({
                success: false,
                message: error.message,
            });
    };
};




//Delet User Profile
export const deletUserProfile = async (req, res, next) => {


    try {

        const user = await User.findById(req.user._id);

        //deleting all the post created by user
        const posts = user.posts;
        let postlength = posts.length;

        if (postlength !== 0) {

            const queue = new pQueue({ concurrency: postlength });

            for (const postId of posts) {
                queue.add(async () => {
                    const post = await Post.findById(postId);

                    if (!post) {
                        return;
                    }

                    await Post.findOneAndDelete({ _id: postId });
                    user.posts.pull(postId);
                });
            }
            await queue.onIdle();
            await user.save();
        }



        //Removing user id from the all followers collections
        const following = user.following;
        const followingLength = following.length;

        if (followingLength !== 0) {

            const queue = new pQueue({ concurrency: followingLength });

            for (const followingId of following) {

                queue.add(async () => {

                    let user2 = await User.findById(followingId);
                    
                    if (user2) {
                        user2.followers.pull(req.user._id);
                        await user2.save();
                    }

                });
            }

            await queue.onIdle();
        }

        //deleting the user 
        let deletedUser = await User.deleteOne(req.user._id);
        return res
            .status(SC.BAD_REQUEST)
            .cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            })
            .json({
                success: true,
                message: "User profile deleted successfylly",
                data: deletedUser,
            })

    } catch (error) {
        return res
            .status(SC.INTERNAL_SERVER_ERROR)
            .json({
                success: false,
                message: error.message,
            })
    }
}







































//Logging User Out from the cookies
export const logoutUser = async (req, res, next) => {

    try {

        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        })

        return res
            .status(SC.OK)
            .json({
                success:true,
                message: "User Logout Successfully",
            })

    } catch (error) {
        return res
            .status(SC.INTERNAL_SERVER_ERROR)
            .json({
                success:false,
                message: error.message
            });
    };
};

















