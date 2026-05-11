import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String , 
        required : true , 
        trim : true ,
        minlength : 3 ,  
    }, 
    email : {
        type : String , 
        required : true ,
        unique : true ,
        lowercase : true , 
        trim : true ,
    },
    password : {
        type : String , 
        required : true
    },
    profileImg : {
        type : String ,
        default : ""
    },
    role : {
        type : String , 
        enum : ["user" , "admin"] , 
        default : "user"
    },
    isDeleted : {
        type : Boolean,
        default : false 
    },
    isBlocked : {
        type : Boolean ,
        default : false
    }

} ,
{
    timestamps : true
}
)

const User = mongoose.model('User' , userSchema)
export default User