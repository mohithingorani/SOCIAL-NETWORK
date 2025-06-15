// Import required modules
require("dotenv").config();
import express from "express";
import http from "http";
import multer from "multer";
import winston from "winston";
import path from "path";
import fs from "fs";

// Create a logger with multiple transports
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(), // Adds color to log levels
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss", // Format of timestamp
    }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(), // For console logs
    }),
    new winston.transports.File({ filename: "logs/app.log" }), // For file logs
  ],
});
var cors = require("cors");

// WebSocket Implementation
import { Server as SocketIOServer, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";
// Create an Express application
const app = express();
app.use(cors());

app.use(express.json());

const server = http.createServer(app);

// Create a new instance of Socket.IO and pass the server instance
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    optionsSuccessStatus: 200,
  },
});

const prisma = new PrismaClient();

// user Authentication
app.get("/user", async (req, res) => {
  const userEmail = req.query.email as string;
  const userExists = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (userExists) {
    logger.info("User exists", userEmail);
    res.send(true);
  } else {
    logger.info("User does not exist", userEmail);
    res.send(false);
  }
});

//add friend
app.post("/friend/request", async (req, res) => {
  const { fromUserName, toUserName } = req.body;
  const fromUser = await prisma.user.findFirst({
    where: { username: fromUserName },
  });
  const toUser = await prisma.user.findFirst({
    where: { username: toUserName },
  });

  const friendRequestExists = await prisma.friendRequest.findFirst({
    where: {
      AND: [
        {
          sender: {
            username: fromUserName,
          },
        },
        {
          receiver: {
            username: toUserName,
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
  } else if (fromUser && toUser) {
    const friendRequest = await prisma.friendRequest.create({
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
});

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg",];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});
// Serve static files from uploads/
app.use("/uploads", express.static("uploads"));

// Add a post
// Upload route
app.post("/upload", upload.single("image"), async (req, res) => {
  console.log("got image post request");

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.headers.host}/uploads/${req.file.filename}`;
  const caption = req.body.caption;
  const userId = parseInt(req.body.userId);

  try {
    const post = await prisma.post.create({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not post!" });
  }
});



// get Post
app.get("/getposts",async(req,res)=>{
  try{
    const posts = await prisma.post.findMany({});
    res.json({
      message:"Get Posts Successfull",
      posts:posts
    }).status(200);
  }catch(err){
    console.log("Could not fetch posts.",err);
    res.json(err).status(500);
  }
})




//show friend requests
app.get("/friend/requests", async (req, res) => {
  const username = req.query.username as string;
  logger.info("username is " + username);
  try {
    const users = await prisma.friendRequest.findMany({
      where: {
        receiver: {
          username,
        },
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
  } catch (e) {
    logger.info(e);
    res.send({ message: "Error fetching requests" }).status(500);
  }
});

//accept friend request
app.post("/friend/accept", async (req, res) => {
  const { senderId, receiverId, requestId } = req.body;

  if (!senderId || !receiverId || !requestId) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    // Update friend request status
    const friendRequest = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "accepted" },
      include: { sender: true, receiver: true },
    });

    // Check if the friend entries already exist
    const friendExists = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: senderId, friendId: receiverId },
          { userId: receiverId, friendId: senderId },
        ],
      },
    });

    if (!friendExists) {
      // Add bidirectional friendship
      await prisma.friend.createMany({
        data: [
          { userId: senderId, friendId: receiverId },
          { userId: receiverId, friendId: senderId },
        ],
      });
    }

    res.status(200).send({
      message: "Friend request accepted and friends added",
      friendRequest,
    });
  } catch (e) {
    logger.error("Error accepting friend request:", e);
    res.status(500).send({ message: "Error accepting friend request" });
  }
});

app.post("/users/search", async (req, res) => {
  const username = req.body.username as string;
  const selfUsername = req.body.selfUsername as string;
  logger.info("username is " + username);
  logger.info("self username is " + selfUsername);
  try {
    const users = await prisma.user.findMany({
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
      },
    });

    logger.info("Users fetched successfully");
    res.status(200).send(users);
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: "Error fetching users" });
  }
});

//show friends
app.get("/user/friends", async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).send({ message: "User ID is required" });
  }

  try {
    const friends = await prisma.friend.findMany({
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
  } catch (e) {
    logger.error("Error fetching friends:", e);
    res.status(500).send({ message: "Error fetching friends" });
  }
});

app.get("/user/details", async (req, res) => {
  const email = req.query.email as string;
  try {
    const userDetails = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    logger.info("User details fetched successfully");
    res.send(userDetails).status(200);
  } catch (err) {
    logger.info(err);
    res.send({ message: "Error fetching user details" }).status(500);
  }
});

app.post("/createUser", async (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const picture = req.body.picture;

  let randomNumber = Math.floor(Math.random() * 1000);
  let userName = name.split(" ")[0].toLowerCase() + randomNumber;

  const userNameExists = await prisma.user.findFirst({
    where: {
      username: userName,
    },
  });

  if (userNameExists) {
    randomNumber = Math.floor(Math.random() * 1000 + 1);
    userName = name.split(" ")[0].toLowerCase() + randomNumber;
  }
  try {
    const user = await prisma.user.create({
      data: {
        picture: picture,
        email: email,
        name: name,
        username: userName,
      },
    });
    logger.info("User created successfully");
    res.send({ message: "User created successfully", user: user }).status(200);
  } catch (e) {
    logger.info(e);
    logger.info("Error creating user");
    res.send({ message: "Error creating user" }).status(500);
  }
});

app.post("/create/message", async (req, res) => {
  const message = req.body.message;
  const userName = req.body.userName;
  const roomName = req.body.roomName;
  logger.info("create/message body:", req.body);
  const time = req.body.time;
  try {
    const chat = await prisma.chat.create({
      data: {
        message,
        userName,
        roomName,
        time,
      },
    });
    res.status(200).send({ message: "Message created successfully", chat });
  } catch (e) {
    logger.info("Prisma error", e);
    res.status(500).send({ message: "Error creating message" });
  }
});

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
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error updating online status" });
  }
});

app.get("/messages", async (req, res) => {
  const roomName = req.query.roomName as string;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        roomName,
      },
    });
    res.send({ message: "Messages fetched successfully", chats }).status(200);
  } catch (e) {
    logger.info(e);
    res.send({ message: "Error fetching messages" }).status(500);
  }
});

// Socket.IO event listeners
io.on("connection", (socket: Socket) => {
  logger.info("User connected");

  socket.on(
    "message",
    (
      message: string,
      roomName: string,
      id: string,
      currentTime: string,
      userName: string
    ) => {
      io.to(roomName).emit("message", message, id, currentTime, userName);
      logger.info(message);
    }
  );

  socket.on("joinRoom", (roomName: string) => {
    logger.info("Joining room: " + roomName);
    socket.join(roomName);
  });

  socket.on("enter", (roomName: string, userName: string) => {
    logger.info(userName + " entered room: " + roomName);
    io.to(roomName).emit("enter", userName);
  });

  socket.on("disconnect", () => {
    logger.info("User disconnected");
  });
});

app.post("/friend/remove", async (req, res) => {
  const myUserName = req.body.myUserName as string;
  const friendUserName = req.body.friendUserName as string;
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
  } catch (err) {
    logger.info("Error deleting friend", err);
  }
});

// Start the server
const PORT: number = parseInt(process.env.PORT as string) || 3000;
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
  });
}

export default app;
