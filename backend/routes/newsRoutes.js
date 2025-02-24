const express = require("express");
const router = express.Router();
const News = require("../models/News"); // Import the News model
const newsController = require("../controllers/newsController");

/**
 * @swagger
 * /api/news/trending:
 *   get:
 *     description: Get trending news based on selected categories or all news if none are selected.
 *     parameters:
 *       - in: query
 *         name: category
 *         description: Comma separated list of categories to filter trending news by (e.g., "Tech, Business").
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched trending news.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   category:
 *                     type: string
 *                   views:
 *                     type: integer
 *                   likes:
 *                     type: integer
 *       404:
 *         description: No trending news found for the given categories.
 *       500:
 *         description: Internal server error.
 */
router.get("/trending", async (req, res) => {
    try {
      const categories = req.query.category ? req.query.category.split(",") : []; // Handle multiple categories
  
      // MongoDB pipeline to fetch trending news
      const pipeline = [
        {
            $match: categories.length > 0 ? { category: { $in: categories } } : {} // Match news from selected categories
        },
        {
          $addFields: {
            score: { $add: ["$views", "$likes"] }, // Calculate the combined score of likes and views
          },
        },
        {
          $sort: { score: -1 }, // Sort by score in descending order
        },
        {
          $limit: 10, // Limit the number of trending news to 10
        },
      ];
  
      const trendingNews = await News.aggregate(pipeline);
  
      if (!trendingNews.length) {
        return res.status(404).json({ message: "No trending news found." });
      }
      res.json(trendingNews); 
    } catch (err) {
      console.error("Error fetching trending news:", err);
      res.status(500).json({ error: "Failed to fetch trending news" });
    }
});

/**
 * @swagger
 * /api/news/subscribe:
 *   post:
 *     description: Subscribe a user to a category.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully subscribed to category.
 *       400:
 *         description: Invalid input data.
 */
router.post("/subscribe", (req, res) => {
  const { userId, category } = req.body;

  // If the user is already subscribed to this category, we don't need to add them again
  if (!userSubscriptions[userId]) {
    userSubscriptions[userId] = [];
  }

  if (!userSubscriptions[userId].includes(category)) {
    userSubscriptions[userId].push(category);
  }

  res.json({ message: `Subscribed to ${category}` });
});

/**
 * @swagger
 * /api/news/subscriptions/{userId}:
 *   get:
 *     description: Get all subscriptions of a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched subscriptions for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscriptions:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: User not found.
 */
router.get("/subscriptions/:userId", (req, res) => {
  const userId = req.params.userId;

  if (userSubscriptions[userId]) {
    res.json({ subscriptions: userSubscriptions[userId] });
  } else {
    res.json({ subscriptions: [] });
  }
});

module.exports = router;
