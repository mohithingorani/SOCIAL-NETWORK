"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import required modules
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const multer_1 = __importDefault(require("multer"));
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Create a logger with multiple transports
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), // Adds color to log levels
    winston_1.default.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss", // Format of timestamp
    }), winston_1.default.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
    })),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.simple(), // For console logs
        }),
        new winston_1.default.transports.File({ filename: "logs/app.log" }), // For file logs
    ],
});
var cors = require("cors");
// WebSocket Implementation
const socket_io_1 = require("socket.io");
const client_1 = require("@prisma/client");
// Create an Express application
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
// Create a new instance of Socket.IO and pass the server instance
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        optionsSuccessStatus: 200,
    },
});
const prisma = new client_1.PrismaClient();
// user Authentication
app.get("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.query.email;
    const userExists = yield prisma.user.findUnique({
        where: {
            email: userEmail,
        },
    });
    if (userExists) {
        logger.info("User exists", userEmail);
        res.send(true);
    }
    else {
        logger.info("User does not exist", userEmail);
        res.send(false);
    }
}));
//add friend
app.post("/friend/request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fromUserId = parseInt(req.body.fromUserId);
    const toUserId = parseInt(req.body.toUserId);
    const fromUser = yield prisma.user.findFirst({
        where: { id: fromUserId },
    });
    const toUser = yield prisma.user.findFirst({
        where: { id: toUserId },
    });
    const friendRequestExists = yield prisma.friendRequest.findFirst({
        where: {
            AND: [
                {
                    sender: {
                        id: fromUserId,
                    },
                },
                {
                    receiver: {
                        id: toUserId,
                    },
                },
            ],
        },
    });
    if (friendRequestExists) {
        logger.info("Friend request already exists");
        res
            .send({ message: "Friend request already exists", exists: true })
            .status(400);
    }
    else if (fromUser && toUser) {
        const friendRequest = yield prisma.friendRequest.create({
            data: {
                senderId: fromUser.id,
                receiverId: toUser.id,
            },
        });
        if (friendRequest) {
            logger.info("Friend request sent successfully");
            res
                .send({ message: "Friend request sent successfully", friendRequest })
                .status(200);
        }
    }
}));
const uploadDir = "uploads";
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
// Set up storage engine
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ["image/png", "image/jpeg", "image/jpg"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
});
// Serve static files from uploads/
app.use("/uploads", express_1.default.static("uploads"));
// Add a post
// Upload route
app.post("/upload", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("got image post request");
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.headers.host}/uploads/${req.file.filename}`;
    const caption = req.body.caption;
    const userId = parseInt(req.body.userId);
    try {
        const post = yield prisma.post.create({
            data: {
                image: imageUrl,
                caption,
                user: {
                    connect: { id: userId },
                },
            },
        });
        console.log(post);
        res.status(200).json({
            post,
            url: imageUrl,
            message: "Post uploaded!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Could not post!" });
    }
}));
app.post("/uploadWithoutImage", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if (!req.file) {
    //   return res.status(400).json({ message: "No file uploaded" });
    // }
    // const imageUrl = `${req.protocol}://${req.headers.host}/uploads/${req.file.filename}`;
    const caption = req.body.caption;
    const userId = parseInt(req.body.userId);
    try {
        const post = yield prisma.post.create({
            data: {
                caption,
                user: {
                    connect: { id: userId },
                },
            },
        });
        console.log(post);
        res.status(200).json({
            post,
            // url: imageUrl,
            message: "Post uploaded!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Could not post!" });
    }
}));
// get Post
app.get("/getposts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.query.userId); // e.g., /getposts?userId=1
    if (!userId) {
        return res.status(400).json({ message: "Missing or invalid userId" });
    }
    try {
        const posts = yield prisma.post.findMany({
            include: {
                user: {
                    select: {
                        username: true,
                        picture: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                    },
                },
                likes: {
                    where: {
                        userId: userId,
                    },
                    select: {
                        userId: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const updatedPosts = posts.map((post) => {
            return Object.assign(Object.assign({}, post), { isLikedByUser: post.likes.length > 0, likes: undefined });
        });
        res.status(200).json({
            message: "Get Posts Successful",
            posts: updatedPosts,
        });
    }
    catch (err) {
        console.error("Could not fetch posts.", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.post("/likePost", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const postId = req.body.postId;
    try {
        const user = yield prisma.user.findUnique({
            where: { id: username },
            select: { id: true },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // ✅ Check if already liked
        const existingLike = yield prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: user.id,
                    postId: postId,
                },
            },
        });
        if (existingLike) {
            return res
                .status(409)
                .json({ message: "User already liked this post" });
        }
        const like = yield prisma.like.create({
            data: {
                userId: user.id,
                postId: postId,
            },
        });
        res.json({
            like,
            message: `Liked the post with id ${postId}`,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}));
app.post("/deletePost", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.body.postId;
    const post = yield prisma.post.delete({
        where: {
            id: postId
        }
    });
    res.json({
        message: "Deleted Post with PostId" + postId,
        post
    });
}));
app.post("/unlikePost", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        yield prisma.like.delete({
            where: {
                userId_postId: {
                    userId: user.id,
                    postId: postId,
                },
            },
        });
        res.status(200).json({
            message: `Unliked the post with id ${postId}`,
        });
    }
    catch (error) {
        if (error.code === "P2025") {
            return res
                .status(404)
                .json({ message: "Like not found for this user and post" });
        }
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}));
//show friend requests
app.post("/friend/requests", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.body.userId);
    // logger.info("username is " + username);
    try {
        const users = yield prisma.friendRequest.findMany({
            where: {
                receiver: {
                    id: userId,
                },
                status: "pending"
            },
            select: {
                status: true,
                id: true,
                sender: {
                    select: {
                        username: true,
                        picture: true,
                        id: true,
                    },
                },
                receiver: {
                    select: {
                        username: true,
                        picture: true,
                        id: true,
                    },
                },
            },
        });
        logger.info(users);
        res.send({
            message: "Recieved Requests",
            requests: users,
        });
    }
    catch (e) {
        logger.info(e);
        res.send({ message: "Error fetching requests" }).status(500);
    }
}));
//accept friend request
app.post("/friend/accept", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId, requestId } = req.body;
    if (!senderId || !receiverId || !requestId) {
        return res.status(400).send({ message: "Missing required fields" });
    }
    try {
        // Update friend request status
        const friendRequest = yield prisma.friendRequest.update({
            where: { id: requestId },
            data: { status: "accepted" },
            include: { sender: true, receiver: true },
        });
        // Check if the friend entries already exist
        const friendExists = yield prisma.friend.findFirst({
            where: {
                OR: [
                    { userId: senderId, friendId: receiverId },
                    { userId: receiverId, friendId: senderId },
                ],
            },
        });
        if (!friendExists) {
            // Add bidirectional friendship
            yield prisma.friend.createMany({
                data: [
                    { userId: senderId, friendId: receiverId },
                    { userId: receiverId, friendId: senderId },
                ],
            });
        }
        res.status(200).send({
            message: "Accepted Friend Request",
            friendRequest,
        });
    }
    catch (e) {
        logger.error("Error accepting friend request:", e);
        res.status(500).send({ message: "Error accepting friend request" });
    }
}));
app.post("/users/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const selfUsername = req.body.selfUsername;
    logger.info("username is " + username);
    logger.info("self username is " + selfUsername);
    try {
        const users = yield prisma.user.findMany({
            where: {
                username: {
                    contains: username,
                    mode: "insensitive",
                },
                NOT: {
                    username: selfUsername,
                },
            },
            select: {
                username: true,
                picture: true,
                id: true
            },
        });
        logger.info("Users fetched successfully");
        res.status(200).send(users);
    }
    catch (err) {
        logger.error(err);
        res.status(500).send({ message: "Error fetching users" });
    }
}));
//show friends
app.get("/user/friends", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).send({ message: "User ID is required" });
    }
    try {
        const friends = yield prisma.friend.findMany({
            where: {
                userId: Number(userId),
            },
            select: {
                friend: {
                    select: {
                        username: true,
                        picture: true,
                        id: true,
                        name: true,
                        onlineStatus: true,
                    },
                },
            },
        });
        const formattedFriends = friends.map((friend) => friend.friend); // Extract the friend details
        res.status(200).send({
            message: "Friends fetched successfully",
            friends: formattedFriends,
        });
    }
    catch (e) {
        logger.error("Error fetching friends:", e);
        res.status(500).send({ message: "Error fetching friends" });
    }
}));
app.get("/user/details", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    try {
        const userDetails = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        logger.info("User details fetched successfully");
        res.send(userDetails).status(200);
    }
    catch (err) {
        logger.info(err);
        res.send({ message: "Error fetching user details" }).status(500);
    }
}));
app.post("/createUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const name = req.body.name;
    const picture = req.body.picture;
    let randomNumber = Math.floor(Math.random() * 1000);
    let userName = name.split(" ")[0].toLowerCase() + randomNumber;
    const userNameExists = yield prisma.user.findFirst({
        where: {
            username: userName,
        },
    });
    if (userNameExists) {
        randomNumber = Math.floor(Math.random() * 1000 + 1);
        userName = name.split(" ")[0].toLowerCase() + randomNumber;
    }
    try {
        const user = yield prisma.user.create({
            data: {
                picture: picture,
                email: email,
                name: name,
                username: userName,
            },
        });
        logger.info("User created successfully");
        res.send({ message: "User created successfully", user: user }).status(200);
    }
    catch (e) {
        logger.info(e);
        logger.info("Error creating user");
        res.send({ message: "Error creating user" }).status(500);
    }
}));
app.post("/create/message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = req.body.message;
    const userName = req.body.userName;
    const roomName = req.body.roomName;
    logger.info("create/message body:", req.body);
    const time = req.body.time;
    try {
        const chat = yield prisma.chat.create({
            data: {
                message,
                userName,
                roomName,
                time,
            },
        });
        res.status(200).send({ message: "Message created successfully", chat });
    }
    catch (e) {
        logger.info("Prisma error", e);
        res.status(500).send({ message: "Error creating message" });
    }
}));
app.post("/onlinestatus", (req, res) => {
    const date = new Date();
    const email = req.body.email;
    try {
        const lastActive = prisma.user.update({
            where: {
                email: email,
            },
            data: {
                lastOnline: date,
                onlineStatus: true,
            },
        });
        res
            .json({
            lastActive,
        })
            .status(200);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error updating online status" });
    }
});
app.get("/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomName = req.query.roomName;
    try {
        const chats = yield prisma.chat.findMany({
            where: {
                roomName,
            },
        });
        res.send({ message: "Messages fetched successfully", chats }).status(200);
    }
    catch (e) {
        logger.info(e);
        res.send({ message: "Error fetching messages" }).status(500);
    }
}));
// Socket.IO event listeners
io.on("connection", (socket) => {
    logger.info("User connected");
    socket.on("message", (message, roomName, id, currentTime, userName) => {
        io.to(roomName).emit("message", message, id, currentTime, userName);
        logger.info(message);
    });
    socket.on("joinRoom", (roomName) => {
        logger.info("Joining room: " + roomName);
        socket.join(roomName);
    });
    socket.on("enter", (roomName, userName) => {
        logger.info(userName + " entered room: " + roomName);
        io.to(roomName).emit("enter", userName);
    });
    socket.on("disconnect", () => {
        logger.info("User disconnected");
    });
});
app.post("/friend/remove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const myUserName = req.body.myUserName;
    const friendUserName = req.body.friendUserName;
    try {
        const removeFriend = prisma.friend.deleteMany({
            where: {
                OR: [
                    {
                        user: {
                            username: myUserName,
                        },
                        friend: {
                            username: friendUserName,
                        },
                    },
                    {
                        user: {
                            username: friendUserName,
                        },
                        friend: {
                            username: myUserName,
                        },
                    },
                ],
            },
        });
        res.json({ message: "Friend removed", removeFriend });
    }
    catch (err) {
        logger.info("Error deleting friend", err);
    }
}));
// Start the server
const PORT = parseInt(process.env.PORT) || 3000;
if (!process.env.VERCEL) {
    server.listen(PORT, () => {
        logger.info(`Server listening on port ${PORT}`);
    });
}
exports.default = app;
