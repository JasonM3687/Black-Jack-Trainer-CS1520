import react from 'react';
import './App.css'; 
import { Button } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import { getAuth, signOut, GoogleAuthProvider } from "firebase/auth";



const HomeScreen = ({setIsSignedIn}) => {

  //instance variables
  const history = useHistory();

  //functions
  const pictureClick = () => {
    history.push('./BlackJack');
  }

  const logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      return setIsSignedIn(false);
    }).catch((error) => {
    // An error happened.
    });
  }

    return (
        <div className="App">
          <header className="App-header">
            <h1>Welcome to BlackJack Trainer</h1>
            <Button 
              variant="contained" 
              color="error" 
              onClick={logout}
              >
                Log out :/ 
              </Button>
            <br/>
            <div className="image">
              <img src="https://i.ibb.co/6FJ0JGK/561-5611765-all-diamonds-cards-clip-arts-cards-fanned-out.png" className="App-logo" alt="logo" height="300" width="300" onClick={pictureClick}/>
            </div>
            <br/>
            <p>Welcome to an online web application that can be utilized to train and help memorize basic blackjack strategy.</p>
            <ul>
              <li>You will receive strategy recommendations based on the basic strategy chart</li>
              <li>You will significantly hone your blackjack skills, preparing you for the real table!</li>
            </ul>
            </header>  
            <Button 
              className="playButton" 
              variant="contained" 
              color="error" 
              size="large"
              component={Link} to="/BlackJack"
              >
                Play! 
              </Button>
              <div className="pageBottom">
                <h1 className="chartHeader">Basic Strategy Chart</h1>
                <img className="chartImage"src="https://www.blackjackapprenticeship.com/wp-content/uploads/2018/10/mini-blackjack-strategy-chart.png" width="1000"/>
              </div>
        </div>
      );
}
export default HomeScreen; 