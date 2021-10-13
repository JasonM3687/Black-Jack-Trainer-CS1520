import react, {useState, useEffect} from 'react';

const BlackJack = () => {

    //enumerations
    enum GameState {
        bet,
        init,
        userTurn,
        dealerTurn
      }
    
      enum Deal {
        user,
        dealer,
        hidden
      }
    
      enum Message {
        bet = 'Place a Bet!',
        hitStand = 'Hit or Stand?',
        bust = 'Bust!',
        userWin = 'You Win!',
        dealerWin = 'Dealer Wins!',
        tie = 'Tie!'
      }

    //state variables
    const data = ''; // set data to JSON data
    const [deck, setDeck]: any[] = useState(data);

    const [userCards, setUserCards]: any[] = useState([]);
    const [userScore, setUserScore] = useState(0);
    const [userCount, setUserCount] = useState(0);

    const [dealerCards, setDealerCards]: any[] = useState([]);
    const [dealerScore, setDealerScore] = useState(0);
    const [dealerCount, setDealerCount] = useState(0);

    const [balance, setBalance] = useState(100);
    const [bet, setBet] = useState(0);

    const [gameState, setGameState] = useState(GameState.bet);
    const [message, setMessage] = useState(Message.bet);
    const [buttonState, setButtonState] = useState({
        hitDisabled: false,
        standDisabled: false,
        resetDisabled: true
    });

    return (
        <h1>BlackJack Game Will Be Here</h1>
    );
}
export default BlackJack; 