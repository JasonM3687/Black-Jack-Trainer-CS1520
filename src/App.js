import react from 'react'; 
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import HomeScreen from './HomeScreen';
import BlackJack from './BlackJack';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomeScreen/>
        </Route>
        <Route exact path="/BlackJack">
          <BlackJack/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
