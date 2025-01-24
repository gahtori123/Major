import {OAuth2Client} from 'google-auth-library';
import User from '../models/User.Model.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleSignUp = async(req,res)=>{
    const {tokenId} = req.body;
    console.log("here in controllers , tokenId", tokenId)
    if(!tokenId){
        return res.status(400).json({
            success:false,
            message:"tokenId is required"
        })
    }
    try{
        const ticket = await client.verifyIdToken({
            idToken:tokenId,
            audience:process.env.GOOGLE_CLIENT_ID
        })
        const {email,name,picture} = ticket.getPayload();

        let user = await User.findOne({email});

        if(!user){
                user = await User.create({
                email,
                name,
                avatar:{
                    secure_url:picture,
                    public_id:null
                }
            })
        }
        console.log("user   = ",user);
        const token = user.jwtToken();
        const refreshToken = user.refreshToken();

        const cookieOptions = {
            maxAge: 36000000,
            httpOnly: true,
        }

        res.cookie('token', token, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

        return res.status(200).json({
            success:true,
            data:user,
            message:"user logged in successfully"
        })
    }catch(err){
        console.log(err);
        return res.status(400).json({
            success:false,
            message:"something went wrong"
        })
    }
}

export{
    googleSignUp,
}