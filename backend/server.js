const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const dotenv = require("dotenv");

dotenv.config();

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));



// API Documentation
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "News API",
      description: "News Feed API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
const newsRoutes = require("./routes/newsRoutes");
app.use("/api/news", newsRoutes);

// app.get('/api/news/trending', (req, res) => {
//     const trendingNews = [
//       { title: "Tech News 1", content: "Latest tech news..." },
//       { title: "Business News 2", content: "Latest business news..." },
//     ];
//     res.json(trendingNews);
//   });


  // Socket.io real-time updates
  const server = http.createServer(app);
  const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:3000",  // Allow requests from your frontend
      methods: ["GET", "POST"],
    },
  });
// io.on("connection", (socket) => {
//     console.log("New client connected");
//     socket.on("disconnect", () => {
//       console.log("Client disconnected");
//     });
//   });
io.on("connection", (socket) => {
    console.log("A user connected");
  
    // Example: Emit newsUpdate when new news is added
    socket.on("newNews", (news) => {
      trendingNews = [news, ...trendingNews]; // Add the new news to the trending news array
      io.emit("newsUpdate", news); // Emit the new news to all connected clients
    });
  
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
  

// Start server
server.listen(process.env.PORT || 5000, () =>
  console.log("Server is running on port 5000")
);




