import { createSlice } from '@reduxjs/toolkit';

// Initial state for news
const initialState = {
  trendingNews: [],
};

// Create slice for news
const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setTrendingNews: (state, action) => {
      state.trendingNews = action.payload; // Set all trending news
    },
  },
});

// Export the action
export const { setTrendingNews } = newsSlice.actions;

// Export the reducer
export default newsSlice.reducer;
