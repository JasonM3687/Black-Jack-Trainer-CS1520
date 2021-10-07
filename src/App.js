import react from 'react'; 
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import HomeScreen from './HomeScreen';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <HomeScreen/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
