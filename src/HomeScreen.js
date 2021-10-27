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
            <div>
              <h1>Welcome to BlackJack Trainer</h1>
              <Button 
                className="logoutButton"
                variant="contained" 
                color="error" 
                onClick={logout}
                >
                  Log out
                </Button>
              </div>
            <br/>
            <div>
             <img src="https://i.ibb.co/cbCnR6c/chippy-removebg-preview.png" className="chippyLeft" />
             <img src="https://i.ibb.co/cbCnR6c/chippy-removebg-preview.png" className="chippyRight"/>
             </div>  
            <div className="image">
              <img src="https://i.ibb.co/NKK1n2m/207-2074612-premium-blackjack-redbubble-jack-of-spades-playing-card-removebg-preview.png" className="App-logo" alt="logo" height="300" width="300" onClick={pictureClick}/>
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
                <img className="chartImage"src="https://www.blackjackapprenticeship.com/wp-content/uploads/2018/10/mini-blackjack-strategy-chart.png" width="1000"/>
              </div>
        </div>
      );
}
export default HomeScreen; 