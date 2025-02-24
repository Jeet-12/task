import axios from "axios";

// Action types
export const GET_TRENDING_NEWS = "GET_TRENDING_NEWS";

// Action to get trending news
export const getTrendingNews = () => async (dispatch) => {

  const res = await axios.get('https://task-backend-s9et.onrender.com/api/news/trending');
  console.log(res);
  dispatch({
    type: GET_TRENDING_NEWS,
    payload: res.data || [],
  });
};
