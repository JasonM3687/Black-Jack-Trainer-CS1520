import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Status from './Status';
import Controls from './Controls';
import Hand from './Hand';
import jsonData from './deck.json';
import { Button } from '@mui/material';
import './App.css';


const BlackJack = () => {

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
    bet = 'Place your bet!',
    hitStand = 'Make a move!',
    bust = 'You busted ): !',
    userWin = 'Congratulations! You Win!',
    dealerWin = 'Dealer wins, better luck next time!',
    tie = 'Its a push!',
    double = 'Sorry, you are broke, you can not double!'
  }

  const data = JSON.parse(JSON.stringify(jsonData.cards));
  const [deck, setDeck]: any[] = useState(data);

  const [userCards, setUserCards]: any[] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const [dealerCards, setDealerCards]: any[] = useState([]);
  const [dealerScore, setDealerScore] = useState(0);
  const [dealerCount, setDealerCount] = useState(0);

  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(0);

  const [doubleTrue, setDoubleTrue] = useState(false); 
  const [gameState, setGameState] = useState(GameState.bet);
  const [message, setMessage] = useState(Message.bet);
  const [buttonState, setButtonState] = useState({
    hitDisabled: false,
    standDisabled: false,
    doubleDisabled: false,
    resetDisabled: true
  });

  useEffect(() => {
    if (gameState === GameState.init) {
      drawCard(Deal.user);
      drawCard(Deal.hidden);
      drawCard(Deal.user);
      drawCard(Deal.dealer);
      setGameState(GameState.userTurn);
      setMessage(Message.hitStand);
    }
  }, [gameState]);

  useEffect(() => {
    calculate(userCards, setUserScore);
    setUserCount(userCount + 1);
  }, [userCards]);

  useEffect(() => {
    calculate(dealerCards, setDealerScore);
    setDealerCount(dealerCount + 1);
  }, [dealerCards]);

  useEffect(() => {
    if (gameState === GameState.userTurn) {
      if (userScore === 21) {
        buttonState.hitDisabled = true;
        buttonState.doubleDisabled = true; 
        setButtonState({ ...buttonState });
      }
      else if (userScore > 21) {
        bust();
      }
    }
  }, [userCount]);

  useEffect(() => {
    if (gameState === GameState.dealerTurn) {
      if (dealerScore >= 17) {
        checkWin();
      }
      else {
        drawCard(Deal.dealer);
      }
    }
  }, [dealerCount]);

  const resetGame = () => {
    console.clear();
    setDeck(data);

    setUserCards([]);
    setUserScore(0);
    setUserCount(0);

    setDealerCards([]);
    setDealerScore(0);
    setDealerCount(0);

    setBet(0);

    setGameState(GameState.bet);
    setMessage(Message.bet);
    setButtonState({
      hitDisabled: false,
      standDisabled: false,
      doubleDisabled: false,
      resetDisabled: true
    });
  }

  const placeBet = (amount: number) => {
    setBet(amount);
    setBalance(Math.round((balance - amount) * 100) / 100);
    setGameState(GameState.init);
  }

  const drawCard = (dealType: Deal) => {
    if (deck.length > 0) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      const card = deck[randomIndex];
      deck.splice(randomIndex, 1);
      setDeck([...deck]);
      console.log('Remaining Cards:', deck.length);
      switch (card.suit) {
        case 'spades':
          dealCard(dealType, card.value, '???');
          break;
        case 'diamonds':
          dealCard(dealType, card.value, '???');
          break;
        case 'clubs':
          dealCard(dealType, card.value, '???');
          break;
        case 'hearts':
          dealCard(dealType, card.value, '???');
          break;
        default:
          break;
      }
    }
    else {
      alert('All cards have been drawn');
    }
  }

  const dealCard = (dealType: Deal, value: string, suit: string) => {
    switch (dealType) {
      case Deal.user:
        userCards.push({ 'value': value, 'suit': suit, 'hidden': false });
        setUserCards([...userCards]);
        break;
      case Deal.dealer:
        dealerCards.push({ 'value': value, 'suit': suit, 'hidden': false });
        setDealerCards([...dealerCards]);
        break;
      case Deal.hidden:
        dealerCards.push({ 'value': value, 'suit': suit, 'hidden': true });
        setDealerCards([...dealerCards]);
        break;
      default:
        break;
    }
  }

  const revealCard = () => {
    dealerCards.filter((card: any) => {
      if (card.hidden === true) {
        card.hidden = false;
      }
      return card;
    });
    setDealerCards([...dealerCards])
  }

  const calculate = (cards: any[], setScore: any) => {
    let total = 0;
    cards.forEach((card: any) => {
      if (card.hidden === false && card.value !== 'A') {
        switch (card.value) {
          case 'K':
            total += 10;
            break;
          case 'Q':
            total += 10;
            break;
          case 'J':
            total += 10;
            break;
          default:
            total += Number(card.value);
            break;
        }
      }
    });
    const aces = cards.filter((card: any) => {
      return card.value === 'A';
    });
    aces.forEach((card: any) => {
      if (card.hidden === false) {
        if ((total + 11) > 21) {
          total += 1;
        }
        else if ((total + 11) === 21) {
          if (aces.length > 1) {
            total += 1;
          }
          else {
            total += 11;
          }
        }
        else {
          total += 11;
        }
      }
    });
    setScore(total);
  }

  const hit = () => {
    buttonState.doubleDisabled = true; 
    drawCard(Deal.user);
  }

  const double = () => {
    if (balance - (bet) >= 0)
    {
      drawCard(Deal.user);
      setBet(bet * 2.00);
      setDoubleTrue(true);
      setBalance(Math.round((balance - bet) * 100) / 100);
      buttonState.hitDisabled = true;
      buttonState.standDisabled = true;
      buttonState.doubleDisabled = true; 
      buttonState.resetDisabled = false;
      setButtonState({ ...buttonState });
      setGameState(GameState.dealerTurn);
      revealCard();
    }
    else
    {
      setMessage(Message.double);
    }
    
    
  }
  
  const stand = () => {
    buttonState.hitDisabled = true;
    buttonState.standDisabled = true;
    buttonState.doubleDisabled = true; 
    buttonState.resetDisabled = false;
    setButtonState({ ...buttonState });
    setGameState(GameState.dealerTurn);
    revealCard();
  }

  const bust = () => {
    buttonState.hitDisabled = true;
    buttonState.standDisabled = true;
    buttonState.doubleDisabled = true; 
    buttonState.resetDisabled = false;
    setButtonState({ ...buttonState });
    setMessage(Message.bust);
  }

  const checkWin = () => {
    if (doubleTrue == true)
    {
      
      if (dealerScore == 21 && userScore != 21)
      {
        setMessage(Message.dealerWin);
      }
      else if (userScore > 21 && dealerScore < 21){
        setMessage(Message.dealerWin);
      }
      else if (dealerScore > userScore && userScore < 21 && dealerScore < 21){
        setMessage(Message.dealerWin);
      }
      else if (dealerScore > userScore && userScore > 21) {
        setMessage(Message.dealerWin);
      }
      else if (dealerScore < userScore && dealerScore > 21 && userScore > 21 ) {
        setMessage(Message.dealerWin);
      }
      else if (userScore > 21 && dealerScore > 21)
      {
        setMessage(Message.dealerWin);
      }
      else if (userScore > dealerScore && userScore <= 21) {
        setBalance(Math.round((balance + (bet * 2)) * 100) / 100);
        setMessage(Message.userWin);
      }
      else if (userScore > dealerScore || dealerScore > 21 || userScore == 21) {
        setBalance(Math.round((balance + (bet * 2)) * 100) / 100);
        setMessage(Message.userWin);
      }
      else {
        setBalance(Math.round((balance + (bet * 1)) * 100) / 100);
        setMessage(Message.tie);
      }
    }
    else
    {
      if (userScore > dealerScore || dealerScore > 21) {
        setBalance(Math.round((balance + (bet * 2)) * 100) / 100);
        setMessage(Message.userWin);
      }
      else if (dealerScore > userScore) {
        setMessage(Message.dealerWin);
      }
      else {
        setBalance(Math.round((balance + (bet * 1)) * 100) / 100);
        setMessage(Message.tie);
      }
    }
  }

  const ProblemOnClick = () => {
    window.location.href = "https://www.1800gambler.net/";
  }
  
  const chippySaysHit = () => {
    // Dealer has 2
    if (userScore == 2 && dealerScore == 2){
        return true
    }
    else if (userScore == 3 && dealerScore == 2){
        return true
    }
    else if(userScore == 4 && dealerScore == 2) {
        return true
    }
    else if(userScore == 5 && dealerScore == 2) {
        return true
    }
    else if(userScore == 6 && dealerScore == 2) {
      return true
    }
    else if(userScore == 7 && dealerScore == 2) {
      return true
    }
    else if(userScore == 8 && dealerScore == 2) {
      return true
    }
    else if(userScore == 9 && dealerScore == 2) {
      return true
    }
    else if(userScore == 10 && dealerScore == 2) {
      return true
    }
    else if(userScore == 11 && dealerScore == 2) {
      return true
    }
    else if(userScore == 12 && dealerScore == 2) {
      return true
    }
    // Dealer has 3
    else if (userScore == 2 && dealerScore == 3){
      return true
    }
    else if(userScore == 3 && dealerScore == 3) {
      return true
    }
    else if(userScore == 4 && dealerScore == 3) {
      return true
    }
    else if(userScore == 5 && dealerScore == 3) {
      return true
    }
    else if(userScore == 6 && dealerScore == 3) {
      return true
    }
    else if(userScore == 7 && dealerScore == 3) {
      return true
    }
    else if(userScore == 8 && dealerScore == 3) {
      return true
    }
    else if(userScore == 9 && dealerScore == 3) {
      return true
    }
    else if(userScore == 10 && dealerScore == 3) {
      return true
    }
    else if(userScore == 11 && dealerScore == 3) {
      return true
    }
    else if(userScore == 12 && dealerScore == 3) {
      return true
    }
    // Dealer has 4
    else if (userScore == 2 && dealerScore == 4){
      return true
    }
    else if(userScore == 3 && dealerScore == 4) {
      return true
    }
    else if(userScore == 4 && dealerScore == 4) {
      return true
    }
    else if(userScore == 5 && dealerScore == 4) {
      return true
    }
    else if(userScore == 6 && dealerScore == 4) {
      return true
    }
    else if(userScore == 7 && dealerScore == 4) {
      return true
    }
    else if(userScore == 8 && dealerScore == 4) {
      return true
    }
    else if(userScore == 9 && dealerScore == 4) {
      return true
    }
    else if(userScore == 10 && dealerScore == 4) {
      return true
    }
    else if(userScore == 11 && dealerScore == 4) {
      return true
    }
    else if(userScore == 12 && dealerScore == 4) {
      return true
    }
    // Dealer has 5
    else if (userScore == 2 && dealerScore == 5){
      return true
    }
    else if(userScore == 3 && dealerScore == 5) {
      return true
    }
    else if(userScore == 4 && dealerScore == 5) {
      return true
    }
    else if(userScore == 5 && dealerScore == 5) {
      return true
    }
    else if(userScore == 6 && dealerScore == 5) {
      return true
    }
    else if(userScore == 7 && dealerScore == 5) {
      return true
    }
    else if(userScore == 8 && dealerScore == 5) {
      return true
    }
    else if(userScore == 9 && dealerScore == 5) {
      return true
    }
    else if(userScore == 10 && dealerScore == 5) {
      return true
    }
    else if(userScore == 11 && dealerScore == 5) {
      return true
    }
    else if(userScore == 12 && dealerScore == 5) {
      return true
    }
    // Dealer has 6
    else if (userScore == 2 && dealerScore == 6){
      return true
    }
    else if(userScore == 3 && dealerScore == 6) {
      return true
    }
    else if(userScore == 4 && dealerScore == 6) {
      return true
    }
    else if(userScore == 5 && dealerScore == 6) {
      return true
    }
    else if(userScore == 6 && dealerScore == 6) {
      return true
    }
    else if(userScore == 7 && dealerScore == 6) {
      return true
    }
    else if(userScore == 8 && dealerScore == 6) {
      return true
    }
    else if(userScore == 9 && dealerScore == 6) {
      return true
    }
    else if(userScore == 10 && dealerScore == 6) {
      return true
    }
    else if(userScore == 11 && dealerScore == 6) {
      return true
    }
    else if(userScore == 12 && dealerScore == 6) {
      return true
    }
    //Dealer has 7
    else if (userScore == 2 && dealerScore == 7){
      return true
    }
    else if(userScore == 3 && dealerScore == 7) {
      return true
    }
    else if(userScore == 4 && dealerScore == 7) {
      return true
    }
    else if(userScore == 5 && dealerScore == 7) {
      return true
    }
    else if(userScore == 6 && dealerScore == 7) {
      return true
    }
    else if(userScore == 7 && dealerScore == 7) {
      return true
    }
    else if(userScore == 8 && dealerScore == 7) {
      return true
    }
    else if(userScore == 9 && dealerScore == 7) {
      return true
    }
    else if(userScore == 10 && dealerScore == 7) {
      return true
    }
    else if(userScore == 11 && dealerScore == 7) {
      return true
    }
    else if(userScore == 12 && dealerScore == 7) {
      return true
    }
    else if(userScore == 13 && dealerScore == 7) {
      return true
    }
    else if(userScore == 14 && dealerScore == 7) {
      return true
    }
    else if(userScore == 15 && dealerScore == 7) {
      return true
    }
    else if(userScore == 16 && dealerScore == 7) {
      return true
    }
    // Dealer has 8
    else if (userScore == 2 && dealerScore == 8){
      return true
    }
    else if(userScore == 3 && dealerScore == 8) {
      return true
    }
    else if(userScore == 4 && dealerScore == 8) {
      return true
    }
    else if(userScore == 5 && dealerScore == 8) {
      return true
    }
    else if(userScore == 6 && dealerScore == 8) {
      return true
    }
    else if(userScore == 7 && dealerScore == 8) {
      return true
    }
    else if(userScore == 8 && dealerScore == 8) {
      return true
    }
    else if(userScore == 9 && dealerScore == 8) {
      return true
    }
    else if(userScore == 10 && dealerScore == 8) {
      return true
    }
    else if(userScore == 11 && dealerScore == 8) {
      return true
    }
    else if(userScore == 12 && dealerScore == 8) {
      return true
    }
    else if(userScore == 13 && dealerScore == 8) {
      return true
    }
    else if(userScore == 14 && dealerScore == 8) {
      return true
    }
    else if(userScore == 15 && dealerScore == 8) {
      return true
    }
    else if(userScore == 16 && dealerScore == 8) {
      return true
    }
    // Dealer has 9
    else if (userScore == 2 && dealerScore == 9){
      return true
    }
    else if(userScore == 3 && dealerScore == 9) {
      return true
    }
    else if(userScore == 4 && dealerScore == 9) {
      return true
    }
    else if(userScore == 5 && dealerScore == 9) {
      return true
    }
    else if(userScore == 6 && dealerScore == 9) {
      return true
    }
    else if(userScore == 7 && dealerScore == 9) {
      return true
    }
    else if(userScore == 8 && dealerScore == 9) {
      return true
    }
    else if(userScore == 9 && dealerScore == 9) {
      return true
    }
    else if(userScore == 10 && dealerScore == 9) {
      return true
    }
    else if(userScore == 11 && dealerScore == 9) {
      return true
    }
    else if(userScore == 12 && dealerScore == 9) {
      return true
    }
    else if(userScore == 13 && dealerScore == 9) {
      return true
    }
    else if(userScore == 14 && dealerScore == 9) {
      return true
    }
    else if(userScore == 15 && dealerScore == 9) {
      return true
    }
    else if(userScore == 16 && dealerScore == 9) {
      return true
    }
    // Dealer has 10
    else if (userScore == 2 && dealerScore == 10){
      return true
    }
    else if(userScore == 3 && dealerScore == 10) {
      return true
    }
    else if(userScore == 4 && dealerScore == 10) {
      return true
    }
    else if(userScore == 5 && dealerScore == 10) {
      return true
    }
    else if(userScore == 6 && dealerScore == 10) {
      return true
    }
    else if(userScore == 7 && dealerScore == 10) {
      return true
    }
    else if(userScore == 8 && dealerScore == 10) {
      return true
    }
    else if(userScore == 9 && dealerScore == 10) {
      return true
    }
    else if(userScore == 10 && dealerScore == 10) {
      return true
    }
    else if(userScore == 11 && dealerScore == 10) {
      return true
    }
    else if(userScore == 12 && dealerScore == 10) {
      return true
    }
    else if(userScore == 13 && dealerScore == 10) {
      return true
    }
    else if(userScore == 14 && dealerScore == 10) {
      return true
    }
    else if(userScore == 15 && dealerScore == 10) {
      return true
    }
    else if(userScore == 16 && dealerScore == 10) {
      return true
    }
    // Dealer has 11 (Ace)
    else if (userScore == 2 && dealerScore == 11){
      return true
    }
    else if(userScore == 3 && dealerScore == 11) {
      return true
    }
    else if(userScore == 4 && dealerScore == 11) {
      return true
    }
    else if(userScore == 5 && dealerScore == 11) {
      return true
    }
    else if(userScore == 6 && dealerScore == 11) {
      return true
    }
    else if(userScore == 7 && dealerScore == 11) {
      return true
    }
    else if(userScore == 8 && dealerScore == 11) {
      return true
    }
    else if(userScore == 9 && dealerScore == 11) {
      return true
    }
    else if(userScore == 10 && dealerScore == 11) {
      return true
    }
    else if(userScore == 11 && dealerScore == 11) {
      return true
    }
    else if(userScore == 12 && dealerScore == 11) {
      return true
    }
    else if(userScore == 13 && dealerScore == 11) {
      return true
    }
    else if(userScore == 14 && dealerScore == 11) {
      return true
    }
    else if(userScore == 15 && dealerScore == 11) {
      return true
    }
    else if(userScore == 16 && dealerScore == 11) {
      return true
    }
    else
      return false
  }
  
  const chippySaysStand = () => {
    // Dealer has 2
    if (userScore == 13 && dealerScore == 2) {
      return true
    }
    else if (userScore == 14 && dealerScore == 2) {
      return true
    }
    else if (userScore == 15 && dealerScore == 2) {
      return true
    }
    else if (userScore == 16 && dealerScore == 2) {
      return true
    }
    else if (userScore == 17 && dealerScore == 2) {
      return true
    }
    else if (userScore == 18 && dealerScore == 2) {
      return true
    }
    else if (userScore == 19 && dealerScore == 2) {
      return true
    }
    else if (userScore == 20 && dealerScore == 2) {
      return true
    }
    else if (userScore == 21 && dealerScore == 2) {
      return true
    }
    // Dealer has 3
    else if (userScore == 13 && dealerScore == 3) {
      return true
    }
    else if (userScore == 14 && dealerScore == 3) {
      return true
    }
    else if (userScore == 15 && dealerScore == 3) {
      return true
    }
    else if (userScore == 16 && dealerScore == 3) {
      return true
    }
    else if (userScore == 17 && dealerScore == 3) {
      return true
    }
    else if (userScore == 18 && dealerScore == 3) {
      return true
    }
    else if (userScore == 19 && dealerScore == 3) {
      return true
    }
    else if (userScore == 20 && dealerScore == 3) {
      return true
    }
    else if (userScore == 21 && dealerScore == 3) {
      return true
    }
    // Dealer has 4
    else if (userScore == 12 && dealerScore == 4) {
      return true
    }
    else if (userScore == 13 && dealerScore == 4) {
      return true
    }
    else if (userScore == 14 && dealerScore == 4) {
      return true
    }
    else if (userScore == 15 && dealerScore == 4) {
      return true
    }
    else if (userScore == 16 && dealerScore == 4) {
      return true
    }
    else if (userScore == 17 && dealerScore == 4) {
      return true
    }
    else if (userScore == 18 && dealerScore == 4) {
      return true
    }
    else if (userScore == 19 && dealerScore == 4) {
      return true
    }
    else if (userScore == 20 && dealerScore == 4) {
      return true
    }
    else if (userScore == 21 && dealerScore == 4) {
      return true
    }
    // Dealer has 5
    else if (userScore == 12 && dealerScore == 5) {
      return true
    }
    else if (userScore == 13 && dealerScore == 5) {
      return true
    }
    else if (userScore == 14 && dealerScore == 5) {
      return true
    }
    else if (userScore == 15 && dealerScore == 5) {
      return true
    }
    else if (userScore == 16 && dealerScore == 5) {
      return true
    }
    else if (userScore == 17 && dealerScore == 5) {
      return true
    }
    else if (userScore == 18 && dealerScore == 5) {
      return true
    }
    else if (userScore == 19 && dealerScore == 5) {
      return true
    }
    else if (userScore == 20 && dealerScore == 5) {
      return true
    }
    else if (userScore == 21 && dealerScore == 5) {
      return true
    }
    // Dealer has 6
    else if (userScore == 12 && dealerScore == 6) {
      return true
    }
    else if (userScore == 13 && dealerScore == 6) {
      return true
    }
    else if (userScore == 14 && dealerScore == 6) {
      return true
    }
    else if (userScore == 15 && dealerScore == 6) {
      return true
    }
    else if (userScore == 16 && dealerScore == 6) {
      return true
    }
    else if (userScore == 17 && dealerScore == 6) {
      return true
    }
    else if (userScore == 18 && dealerScore == 6) {
      return true
    }
    else if (userScore == 19 && dealerScore == 6) {
      return true
    }
    else if (userScore == 20 && dealerScore == 6) {
      return true
    }
    else if (userScore == 21 && dealerScore == 6) {
      return true
    }
    // Dealer has 7
    else if (userScore == 17 && dealerScore == 7) {
      return true
    }
    else if (userScore == 18 && dealerScore == 7) {
      return true
    }
    else if (userScore == 19 && dealerScore == 7) {
      return true
    }
    else if (userScore == 20 && dealerScore == 7) {
      return true
    }
    else if (userScore == 21 && dealerScore == 7) {
      return true
    }
    // Dealer has 8
    else if (userScore == 17 && dealerScore == 8) {
      return true
    }
    else if (userScore == 18 && dealerScore == 8) {
      return true
    }
    else if (userScore == 19 && dealerScore == 8) {
      return true
    }
    else if (userScore == 20 && dealerScore == 8) {
      return true
    }
    else if (userScore == 21 && dealerScore == 8) {
      return true
    }
    // Dealer has 9
    else if (userScore == 17 && dealerScore == 9) {
      return true
    }
    else if (userScore == 18 && dealerScore == 9) {
      return true
    }
    else if (userScore == 19 && dealerScore == 9) {
      return true
    }
    else if (userScore == 20 && dealerScore == 9) {
      return true
    }
    else if (userScore == 21 && dealerScore == 9) {
      return true
    }
    // Dealer has 10
    else if (userScore == 17 && dealerScore == 10) {
      return true
    }
    else if (userScore == 18 && dealerScore == 10) {
      return true
    }
    else if (userScore == 19 && dealerScore == 10) {
      return true
    }
    else if (userScore == 20 && dealerScore == 10) {
      return true
    }
    else if (userScore == 21 && dealerScore == 10) {
      return true
    }
    // Dealer has 11 (Ace)
    else if (userScore == 17 && dealerScore == 11) {
      return true
    }
    else if (userScore == 18 && dealerScore == 11) {
      return true
    }
    else if (userScore == 19 && dealerScore == 11) {
      return true
    }
    else if (userScore == 20 && dealerScore == 11) {
      return true
    }
    else if (userScore == 21 && dealerScore == 11) {
      return true
    }

  }

  const chippySaysDouble = () => {
    // User has 9
    if (userScore == 9 && dealerScore == 3)
    {
      return true; 
    }
    else if (userScore == 9 && dealerScore == 4)
    {
      return true; 
    }
    else if (userScore == 9 && dealerScore == 5)
    {
      return true; 
    }
    else if (userScore == 9 && dealerScore == 6)
    {
      return true; 
    }
    // User has 10
    else if (userScore == 10 && dealerScore == 2)
    {
      return true;
    }
    else if (userScore == 10 && dealerScore == 3)
    {
      return true;
    }
    else if (userScore == 10 && dealerScore == 4)
    {
      return true;
    }
    else if (userScore == 10 && dealerScore == 5)
    {
      return true;
    }
    else if (userScore == 10 && dealerScore == 6)
    {
      return true;
    }
    else if (userScore == 10 && dealerScore == 7)
    {
      return true;
    }
    else if (userScore == 10 && dealerScore == 8)
    {
      return true;
    }
    else if (userScore == 10 && dealerScore == 9)
    {
      return true;
    }
    // User has 11
    else if (userScore == 11 && dealerScore == 2)
    {
      return true;
    }
    else if (userScore == 11 && dealerScore == 3)
    {
      return true;
    }
    else if (userScore == 11 && dealerScore == 4)
    {
      return true;
    }
    else if (userScore == 11 && dealerScore == 5)
    {
      return true;
    }
    else if (userScore == 11 && dealerScore == 6)
    {
      return true;
    }
    else if (userScore == 11 && dealerScore == 7)
    {
      return true;
    }
    else if (userScore == 11 && dealerScore == 8)
    {
      return true;
    }
    else if (userScore == 11 && dealerScore == 9)
    {
      return true;
    }
    else if (userScore == 11 && dealerScore == 10)
    {
      return true;
    }
    else if (userScore == 11 && dealerScore == 11)
    {
      return true;
    }

  }
  if (chippySaysDouble() == true)
  {
    return (
      <div className="game">
        <Button 
            className="exitButton"
            variant="contained" 
            color="error" 
            component={Link} to="/"
            >
            Exit Game 
        </Button>
        <Status message={message} balance={balance} />
        <Controls
          balance={balance}
          gameState={gameState}
          buttonState={buttonState}
          betEvent={placeBet}
          hitEvent={hit}
          doubleEvent={double}
          standEvent={stand}
          resetEvent={resetGame}
        />
        <Hand title={`Dealer's Hand (${dealerScore})`} cards={dealerCards} />
        <Hand title={`Your Hand (${userScore})`} cards={userCards} />
        <img src="https://i.ibb.co/cbCnR6c/chippy-removebg-preview.png" className="chippyBJ"/>
        <img src="https://i.ibb.co/yf8X5hW/double-Down.png" className="chippySays"/>
        <img src="https://i.ibb.co/Nr4cmgW/1800.jpg" className="problem" onClick={ProblemOnClick}/>
        <p className="trainerChippy">Trainer Chippy</p>
      </div>
    );
  }
  else if (chippySaysStand() == true)
  {
    return (
      <div className="game">
        <Button 
            className="exitButton"
            variant="contained" 
            color="error" 
            component={Link} to="/"
            >
            Exit Game 
        </Button>
        <Status message={message} balance={balance} />
        <Controls
          balance={balance}
          gameState={gameState}
          buttonState={buttonState}
          betEvent={placeBet}
          hitEvent={hit}
          doubleEvent={double}
          standEvent={stand}
          resetEvent={resetGame}
        />
        <Hand title={`Dealer's Hand (${dealerScore})`} cards={dealerCards} />
        <Hand title={`Your Hand (${userScore})`} cards={userCards} />
        <img src="https://i.ibb.co/cbCnR6c/chippy-removebg-preview.png" className="chippyBJ"/>
        <img src="https://i.ibb.co/W0FGNKD/chippy-stand1.png" className="chippySays"/>
        <img src="https://i.ibb.co/Nr4cmgW/1800.jpg" className="problem" onClick={ProblemOnClick}/>
        <p className="trainerChippy">Trainer Chippy</p>
      </div>
    );
  }
  else if (chippySaysHit() == true)
  {
    return (
      <div className="game">
        <Button 
            className="exitButton"
            variant="contained" 
            color="error" 
            component={Link} to="/"
            >
            Exit Game 
        </Button>
        <Status message={message} balance={balance} />
        <Controls
          balance={balance}
          gameState={gameState}
          buttonState={buttonState}
          betEvent={placeBet}
          hitEvent={hit}
          doubleEvent={double}
          standEvent={stand}
          resetEvent={resetGame}
        />
        <Hand title={`Dealer's Hand (${dealerScore})`} cards={dealerCards} />
        <Hand title={`Your Hand (${userScore})`} cards={userCards} />
        <img src="https://i.ibb.co/cbCnR6c/chippy-removebg-preview.png" className="chippyBJ"/>
        <img src="https://i.ibb.co/NT2GCD5/newHit.png" className="chippySays"/>
        <img src="https://i.ibb.co/Nr4cmgW/1800.jpg" className="problem" onClick={ProblemOnClick}/>
        <p className="trainerChippy">Trainer Chippy</p>
      </div>
    );
  }
  return (
    <div className="game">
      <Button 
          className="exitButton"
          variant="contained" 
          color="error" 
          component={Link} to="/"
          >
          Exit Game 
      </Button>
      <Status message={message} balance={balance} />
      <Controls
        balance={balance}
        gameState={gameState}
        buttonState={buttonState}
        betEvent={placeBet}
        hitEvent={hit}
        doubleEvent={double}
        standEvent={stand}
        resetEvent={resetGame}
      />
      <Hand title={`Dealer's Hand (${dealerScore})`} cards={dealerCards} />
      <Hand title={`Your Hand (${userScore})`} cards={userCards} />
      <img src="https://i.ibb.co/cbCnR6c/chippy-removebg-preview.png" className="chippyBJ"/>
      <img src="https://i.ibb.co/Nr4cmgW/1800.jpg" className="problem" onClick={ProblemOnClick}/>
      <p className="trainerChippy">Trainer Chippy</p>
    </div>
  );
}
export default BlackJack; 