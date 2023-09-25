import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter user name"],
        minlength: [3, "User name should be at least 3 character"],
    },
    email: {
        type: String,
        required: [true, "Enter user email-id"],
    },
    phone: {
        type: Number,
        required: [true, "Enter user phone no."],
        minlength: [10, "Phone no should be of 10 digits"],
        maxlength: [10, "Phone no should be of 10 digits"],
    },
    avatar: {
       public_id:String,
       url:String,
    },
    password: {
        type: String,
        required: [true, "Enter user password"],
        minlength:[6, "Password must be at least 6 characters"],
        select:false, // here we are using select:false because we don't want to select password when user is slected
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    role:{
        type:String,
        default:"user",
    }
},
    { timestamps: true }

)

const User = new mongoose.model("user",userSchema);

export default User;


















