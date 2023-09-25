import User from "../modules/userModule.js";
import Post from "../modules/postModule.js";
import { SC } from '../configs/status.js';
import cloudinary from 'cloudinary';



export const createPost = async (req, res, next) => {

    try {

        

        //getting the caption form the body of frontend
        const caption = req.body.caption;

        //Checking whether the caption is empty
        if (!caption) {
            return res.status(SC.BAD_REQUEST).json({
                success: false,
                message: "Caption is required",
                data: null,
            });
        };

        if(!req.body.avatar){
            return res
                    .status(SC.OK)
                    .json({
                        success:false,
                        message:"Post Image is required",
                    })
        }

        //Uploading the images to the Cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"Post",
            width:200,
            crop:"scale"
        })

        //New Post Data is being prepared here
        const newPostData = {
            caption,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.url
            },
            owner: req.user._id
        };



        //Creating a new post here to the database
        const newPost = await Post.create(newPostData);



        //Here we are finding the user with id for accessing the posts field
        const user = await User.findById(req.user._id);


        //Pushing the post id into the respective post array field of User Collection
        user.posts.push(newPost._id);


        // Saving the updated user document to the database
        await user.save();



        //Sending the response to the frontend 
        return res.status(SC.OK).json({
            success: true,
            message: "Post created successfuylly",
            data: newPost,
        });


        //calling the next() callback function
        next();


    } catch (error) {

        // sending response if error occured
        return res.status(SC.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
            data: null,
        });
    };
};


//Deleting the post
export const deletePost = async( req, res, next ) => {


    try {

        const { id } = req.params;
        
        //finding the post from the database
        const post = await Post.findById(id);
       
        //checking whether the post exist or not
        if(!post){
            return res
                    .status(SC.BAD_REQUEST)
                    .json({
                        success:false,
                        message:"Post does not found",
                    });
        };


        //Checking whether the user is authroized for deleting the post or not
        if(post.owner.toString() !== req.user._id.toString()){
            return res
                    .status(SC.BAD_REQUEST)
                    .json({
                        success:false,
                        message:"Unauthorized"
                    });
        };

        //deleting the post
        let deletedPost = await Post.deleteOne({_id:post._id})

        //finding user and removing the post id form the user posts array field
        const user = await User.findById(req.user._id);
        //finding the index of the postid which was saved inside the user posts array field
        const index = user.posts.indexOf(req.params.id);
        //removing the post id form teh post array field of user
        user.posts.splice(index,1);
        //saving the update user after removing the deleted post id
        await user.save();

        //sending response to the user
        return res
                .status(SC.OK)
                .json({
                    success:true,
                    message:"Post deleted successfully",
                    data:deletedPost,
                });

                next();
        
    } catch (error) {
        return res
                .status(SC.INTERNAL_SERVER_ERROR)
                .json({
                    success:false,
                    message:error.message,
                })
        
    }
}


// Controller for likes when user likes or dislike the post
export const likeAndDislikePost = async (req, res, next) => {

    try {

        // Getting the postId from the params
        const { id } = req.params;

        //finding the all post data from the database
        const post = await Post.findById(id);

        if (!post) {
            return res
                .status(SC.BAD_REQUEST)
                .json({
                    success: false,
                    message: "Post not found",
                })
        }

        //here checking whether user has already liked or not, if already liked then dislike it otherwise likeit
        if (post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id);

            //removing the user id from the likes array
            post.likes.splice(index, 1);

            ////saving the post after the updation of dislike
            await post.save();

            return res
                .status(SC.OK)
                .json({
                    success: true,
                    message: "Post unliked"
                });

        } else {


            //updating the post with user._id who liked it
            post.likes.push(req.user._id);
            //saving the post after the updation of likes 
            await post.save();

            return res
                .status(SC.OK)
                .json({
                    success: true,
                    message: "Post is liked"
                });
        };


        //Calling next(); callback function
        next();

    } catch (error) {
        return res
            .status(SC.INTERNAL_SERVER_ERROR)
            .json({
                message: error.message,
            });
    };
};



//Adding comment to the post
export const commentOnPost = async( req, res, next ) => {

    try {

        const { id } = req.params;
        const { comment } = req.body;

        if(!id){
            return res
                    .status(SC.BAD_REQUEST)
                    .json({
                        success:false,
                        message:"Id is required of Post",
                    })
        }
     
        if(!comment){
            return res
                    .status(SC.BAD_REQUEST)
                    .json({
                        success:false,
                        message:"Comment should not be empty",
                    });
        };


        let post = await Post.findById(id);
        if(!post){
            return res
                    .status(SC.BAD_REQUEST)
                    .json({
                        success:false,
                        message:"Post does not found",
                    });
        };

        const newComment = {
            user:req.user._id,
            comment:comment,
        }

        post.comments.push(newComment);

        await post.save();

        return res
                .status(SC.OK)
                .json({
                    success:true,
                    message:"Comment Created Successfylly",
                });

                next();
    
    } catch (error) {
        return res
                .status(SC.INTERNAL_SERVER_ERROR)
                .json({
                    success:false,
                    message:error.message,
                });
    };
};


//Getting all the post of the following 
export const allPostsOfFollowing = async( req, res, next ) => {

    try {

        const user = await User.findById(req.user._id);

        const post = await Post.find({
            owner:{
                $in:user.following
            }
        })

        console.log(user);
        return res
                .status(SC.OK)
                .json({
                    success:true,
                    message:"UserLogIn",
                    data:post,
                });

                next();
        
    } catch (error) {
        return res
                .status(SC.INTERNAL_SERVER_ERROR)
                .json({
                    success:false,
                    message:error.message,
                });
    };
};



//Update Post Caption
export const updatePostCaption = async ( req, res, next) => {

    try {

        const { id } = req.params;
        const { newCaption } = req.body;

        if(!id){
            return res
                    .status(SC.BAD_REQUEST)
                    .json({
                        success:false,
                        message:"Id of post is required",
                    });
        };

        if(!newCaption){
            return res
                    .status(SC.BAD_REQUEST)
                    .json({
                        success:false,
                        message:"Caption is required",
                    });
        };

        let post = await Post.findById(id);

        if(!post){
            return res
                    .status(SC.BAD_REQUEST)
                    .json({
                        success:false,
                        message:"Post does not found",
                    });
        };

        if(post.owner.toString() !== req.user._id.toString()){
            return res
                    .status(SC.BAD_REQUEST)
                    .json({
                        success:false,
                        message:"Unauthorized user"
                    });
        };

        post.caption = newCaption;
        await post.save();


        return res
                .status(SC.OK)
                .json({
                    success:true,
                    message:"Post Caption updated Successfully",
                    data:post,
                });

                next();

        
    } catch (error) {
        return res
                .status(SC.INTERNAL_SERVER_ERROR)
                .json({
                    success:false,
                    message:error.message,
                });
    };
};



//Fetching all Post from database 
export const fetchAllUserPost = async( req, res, next) => {
    

        try {

           const posts = await Post.find({owner:req.user._id})

            if(!posts){
                return res
                        .status(SC.BAD_REQUEST)
                        .json({
                            success:false,
                            message:"User don't have any post"
                        });
            };


            return res
                    .status(SC.OK)
                    .json({
                        success:true,
                        message:"All posts found of user",
                        data:posts,
                    });

                    next();
            
        } catch (error) {
            return res
                    .status(SC.INTERNAL_SERVER_ERROR)
                    .json({
                        success:false,
                        message:error.message
                    })
        }

}




















