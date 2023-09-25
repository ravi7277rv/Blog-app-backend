import express from 'express';
import myConfig from './configs/config.js';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';



// Declaring Application from express (app)
const app = express();

//Applying Middlewares for accessing the application/json data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());


//Appllying CORS for the cross origin resource sharing
app.use(cors());


//Connecting to the MONGODB Database
mongoose.connect(myConfig.mongo.string,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then((conn) => {
        console.log(`DataBase is connected ${conn.connection.host}`);
    })
    .catch((err) => {
        console.log(err);
    })

//Cloudinary configuration for the uuploading images
cloudinary.config({
    cloud_name: myConfig.cloudinary.name,
    api_key: myConfig.cloudinary.api_key,
    api_secret: myConfig.cloudinary.api_secret
})

cloudinary.config

//Importing the Router here
import post from './routes/postRoute.js';
import user from './routes/userRoute.js';


//Using the route here
app.use("/api/v1", post);
app.use("/api/v1", user);


app.listen(myConfig.server.port, () => {
    console.log(`Server is running on http://127.0.0.1:${myConfig.server.port}`);
})