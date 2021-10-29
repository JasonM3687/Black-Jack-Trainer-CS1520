import react, { useState } from 'react'; 
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import HomeScreen from './HomeScreen';
import BlackJack from './BlackJack';
import Login from './Login';
import { getAuth, onAuthStateChanged} from "firebase/auth";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(true); 
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) 
    {
      return setIsSignedIn(true);
    } 
    else 
    {
      return setIsSignedIn(false);
    }
  });
  if (isSignedIn === true)
  {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <HomeScreen setIsSignedIn={setIsSignedIn} />
          </Route>
          <Route exact path="/BlackJack">
            <BlackJack/>
          </Route>
        </Switch>
      </Router>
    );
  }
  else // user is not signed in
  {
    return (
      <Router>
        <Switch>
          <Route path="/">
            <Login/>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
