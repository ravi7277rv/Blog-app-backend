import express from 'express';
import { createUser, deletUserProfile, followingOrFollower, loginUser, logoutUser, updateProfilePassword, updateUserProfile } from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();
 
router.route("/create/user").post(createUser);
router.route("/login/user").post(loginUser);
router.route("/follow/:id").get(isAuthenticated,followingOrFollower);

router.route("/profile/updatePass").put(isAuthenticated,updateProfilePassword);
router.route("/updateUserProfile").put(isAuthenticated,updateUserProfile);

router.route("/logout").get(logoutUser);
router.route("/deleteProfile").delete(isAuthenticated,deletUserProfile);


export default router;