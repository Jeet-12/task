import logo from './logo.svg';
import './App.css';
import store from './store';
import { Provider } from "react-redux";
import NewsFeed from './components/NewsFeed';

function App() {
  return (
    <Provider store={store}>
      <NewsFeed />
    </Provider>
  );
}

export default App;
