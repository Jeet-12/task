import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './reducers/newsSlice'; // Import the newsSlice reducer

const store = configureStore({
  reducer: {
    news: newsReducer, // Add more reducers if you have other slices
  },
});

export default store;
