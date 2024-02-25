import {model,Schema} from "mongoose";

const closedSessionsSchema = new Schema({
    session_removed:{
        type:String,
        unique:true,
        required:true
    }
},{
    timestamps:false,
    versionKey:false
})
export default model("ClosedSessions", closedSessionsSchema)