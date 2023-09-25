import express from 'express';
import { allPostsOfFollowing, commentOnPost, createPost, deletePost, fetchAllUserPost, likeAndDislikePost, updatePostCaption } from '../controllers/postController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route("/post/upload").post(isAuthenticated,createPost);
router
    .route("/post/:id")
    .get(isAuthenticated,likeAndDislikePost) 
    .delete(isAuthenticated,deletePost)
    .post(isAuthenticated,commentOnPost)

router.route("/allPostOfFollowing").get(isAuthenticated,allPostsOfFollowing)

router.route("/updatePostCaption/:id").put(isAuthenticated,updatePostCaption)

router.route("/fetchAllPosts").get(isAuthenticated,fetchAllUserPost)

export default router;
