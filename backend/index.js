const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User"); 
const Message = require("./models/Message");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require('path')
const Image = require("./models/Image");


require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin:"https://websocket-application-client-qc8a11khl-amanpreetheyars-projects.vercel.app/",
    methods: ["GET", "POST"],
  },
});

const PORT =  5000;
const MONGODB_URI = process.env.MONGODB_URI ||"mongodb+srv://amanpreet:61yXUNq8KTOa30Np@cluster0.1ezl4s6.mongodb.net/application"

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if unable to connect
  });

const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("MongoDB connection established"));

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://websocket-application-client-git-main-amanpreetheyars-projects.vercel.app"
  ],
};


app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('/uploads'))
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json({ message: "Success",   
        user: {
          id: user._id,
          email: user.email,
          userName: user.userName
          // include other user fields if needed
        }});
      } else {
        res.json("The password is incorrect");
      }
    } else {
      res.json("No record existed");
    }
  }).catch((error) => {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  });
});

app.post("/signup", async (req, res) => {
  try {
    const userData = req.body;
    const newUser = new User(userData);
    console.log(newUser,"new user data===>")

    await newUser.save();
    res.status(201).json({ message: "User data saved successfully.", data: newUser });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Failed to save user data." });
  }
});

app.get("/messages", async (req, res) => {
  const { senderId, receiverId } = req.query;

  // console.log(senderId, receiverId, "users====>")

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ createdAt: 1 });

console.log(messages, "all messages====>")
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});



// implement web socket.io for real-time chat

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log(socket.id, "user connected")
  // console.log("a user connected");

  socket.on("addUser", ({userId, userName}) => {
    // console.log(userId,"id===>")
    onlineUsers[socket.id] = {userId, userName};
    io.emit("getUsers", Object.values(onlineUsers));
  });

  

// console.log(onlineUsers,"online users==>")

  socket.on("sendMessage", async ({userId, userName, receiverId, text }) => {
    // console.log(userName,"user name")
    // console.log(userId, "sender  id==>")
    // console.log(receiverId,"receiver id==>")
    const message = new Message({
      sender: userId,
      receiver: receiverId,
      text: text
    });

    // console.log(message, "messages===>")

    try {
      await message.save();
      io.emit("getMessage", message);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
 

  // socket.on("sendMessage", (message) => {
  //   io.emit("getMessage", message);
  // });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete onlineUsers[socket.id];
    io.emit("getUsers", Object.values(onlineUsers));
  });
});



/// image saving using multer package

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({storage: storage});



// app.use(express.urlencoded({extended: true}));


// const upload = multer({dest: 'uploads/'});

const uploadDir = path.join(__dirname, 'uploads');
if (!(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });



// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadDir));


// handle post request for multer image saving in data base

app.post('/upload', upload.single('file'), async(req, res) => {
  console.log(req.body, "========")
  // const {userId} = req.body;


if (!req.file) {
 return res.status(400).send('No file uploaded.');
}

const image = new Image({
  filename: req.file.filename,
  path: req.file.path,
 userId : req.body.userId
})
console.log(image, "image addresss===>")

try {
  await image.save();
  res.status(201).json({location:` http://localhost:5000/uploads/${req.file.filename}`});
} catch (error) {
  res.status(500).send('Error saving image to the database');
}

});

/// get user image from image schema according to their user id :-

app.get('/user-image/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const image = await Image.findOne({ userId: userId });
    if (image) {
      res.status(200).json({ imageUrl: `http://localhost:5000/${image.path}` });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).send('Error fetching user image');
  }
});


server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});



