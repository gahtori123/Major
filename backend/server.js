import { config } from 'dotenv';
import express from 'express';
import connectToDb from './db/ConnectToDb.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import router from './routes/User.Routes.js';
import { sendMessage, sendMessageToDB } from './controllers/User.Controllers.js';

config();
connectToDb();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log("A user connected");

    socket.on("join-rooms",(chat_ids)=>{
        chat_ids.forEach(chat_id => {
            socket.join(chat_id)
            console.log("joined",chat_id);
        });
    })
    socket.on('sendMessage',async (message) => {
        const {chat_id} = message
        const lastMessage = await sendMessageToDB(message)
        io.to(chat_id).emit('receiveMessage', lastMessage);
    });

    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });

    socket.on('isTyping', (data) => {
        console.log("typing in backend ",data);
        const { chat_id, typingUser } = data;
        socket.to(chat_id).emit('typing', typingUser);
    });
});

app.use("/user",router)

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is up at http://localhost:${PORT}`);
});
