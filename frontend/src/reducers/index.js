import { combineReducers } from 'redux';
import newsReducer from './newsSlice'; // Assuming you have a newsReducer

const rootReducer = combineReducers({
  news: newsReducer, // Add other reducers here if needed
});

export default rootReducer;
