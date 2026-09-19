
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:[true,"username must be unique"]
    },
    email:{
        type:String,
        required:[true,"username is required"],
        unique:[true,"username must be unique"]
    },
    password:{
        type:String,
        required:[true,"username is required"],
    },
    verified:{
        type:Boolean,
        default: false
    }

})

//users is just name of this model
const userModel = mongoose.model("users",userSchema);
export default userModel