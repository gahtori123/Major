import { addMembersToGroup, createChat, createContactList, editContactDetails, fetchChats, getMessages, googleSignUp, search, sendMessage } from "../controllers/User.Controllers.js";
import {Router} from 'express';

const router = Router();

router.post("/google/auth",googleSignUp)
router.post("/createContactList", createContactList)
router.post("/editContactDetails", editContactDetails)
router.post("/createChat", createChat)
router.post("/addMembersToGroup",addMembersToGroup)
router.post("/fetchChats", fetchChats);
router.post("/sendMessage", sendMessage);
router.post("/getMessages",getMessages);
router.post("/search",search);
router.all("*",()=>{
    console.log("in last route");
    return;
})

export default router