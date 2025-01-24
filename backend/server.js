import { config } from 'dotenv';
import express from 'express';
import connectToDb from './db/ConnectToDb.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import router from './routes/User.Routes.js';

config();
connectToDb();

const app = express();

app.use(express.json());

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

    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });
});

app.use("/user",router)

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is up at http://localhost:${PORT}`);
});
