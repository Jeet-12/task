import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setTrendingNews } from "../reducers/newsSlice"; // Import actions
import styled from "styled-components"; // Import styled-components for styling

// Styled components for a professional layout
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const CategorySection = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
`;

const SubscribeButton = styled.button`
  background: ${(props) => (props.active ? "#4e8cde" : "#007bff")};
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #0056b3;
  }
`;

const NewsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const CardCategory = styled.span`
  background: #4e8cde;
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  margin-bottom: 15px;
  display: inline-block;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.3;
`;

const CardContent = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardStats = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #888;
`;

const NewsFeed = () => {
  const [categories, setCategories] = useState([]); // Track selected categories
  const dispatch = useDispatch();
  const { trendingNews } = useSelector((state) => state.news);

  const socket = io("https://task-backend-s9et.onrender.com"); // Socket connection to backend

  // Fetch trending news for selected categories
  const fetchTrendingNews = async () => {
    // If no categories selected, fetch all trending news
    const categoryQuery = categories.length > 0 ? categories.join(",") : "all"; // "all" means fetch all categories

    try {
      const response = await fetch(`https://task-backend-s9et.onrender.com/api/news/trending?category=${categoryQuery}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        dispatch(setTrendingNews(data)); // Dispatch to Redux
      } else {
        dispatch(setTrendingNews([])); // Clear if no news available
      }
    } catch (error) {
      dispatch(setTrendingNews([])); // Clear on error
      console.error("Error fetching trending news:", error);
    }
  };

  // Toggle category subscription (add/remove from selected categories)
  const toggleCategory = (category) => {
    setCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };

  // Subscribe to a category in the backend (if necessary)
  const subscribeToCategory = async (category) => {
    const userId = "user123"; // Hardcoded for simplicity
    try {
      await fetch("https://task-backend-s9et.onrender.com/api/news/subscribe", {
        method: "POST",
        body: JSON.stringify({ userId, category }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error subscribing to category:", error);
    }
  };

  useEffect(() => {
    fetchTrendingNews(); // Re-fetch when categories change

    socket.on("newsUpdate", fetchTrendingNews); // Listen for new data

    return () => {
      socket.off("newsUpdate");
    };
  }, [categories]); // Dependency array ensures effect runs when categories change

  return (
    <Container>
      <Title>Trending News</Title>

      {/* Category selection buttons */}
      <CategorySection>
        {["Tech", "Business", "Sports"].map((category) => (
          <SubscribeButton
            key={category}
            active={categories.includes(category)}
            onClick={() => {
              toggleCategory(category);
              subscribeToCategory(category);
            }}
          >
            {category}
          </SubscribeButton>
        ))}
      </CategorySection>

      {/* Display trending news */}
      <h2>{categories.length > 0 ? `Trending News in ${categories.join(", ")}` : "Trending News"}</h2>
      <NewsSection>
        {Array.isArray(trendingNews) && trendingNews.length > 0 ? (
          trendingNews.map((news, index) => (
            <Card key={index}>
              <CardCategory>{news.category}</CardCategory>
              <CardTitle>{news.title}</CardTitle>
              <CardContent>{news.content}</CardContent>
              <CardStats>
                <span>👁️ {news.views} Views</span>
                <span>❤️ {news.likes} Likes</span>
              </CardStats>
            </Card>
          ))
        ) : (
          <p>No trending news available for the selected categories.</p>
        )}
      </NewsSection>
    </Container>
  );
};

export default NewsFeed;
