// const express = require("express");
// const News = require("./models/news"); // Import the news model
// const app = express();

// // API route to get trending news based on views and likes
// app.get("/api/news/trending", async (req, res) => {
//   try {
//     const newsCategory = req.query.category || null; // Optional category filter
    
//     // MongoDB aggregation pipeline to fetch trending news
//     const pipeline = [
//       {
//         $match: newsCategory ? { category: newsCategory } : {} // Filter by category if provided
//       },
//       {
//         $addFields: {
//           score: { $add: ["$views", "$likes"] } // Calculate a "score" based on views and likes
//         }
//       },
//       {
//         $sort: { score: -1 } // Sort by score (views + likes) in descending order
//       },
//       {
//         $limit: 10 // Limit to the top 10 trending news
//       }
//     ];
    
//     const trendingNews = await News.aggregate(pipeline); // Execute the aggregation pipeline
    
//     res.json(trendingNews);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch trending news" });
//   }
// });
