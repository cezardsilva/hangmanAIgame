// /home/srvlinux/Git/Apps/Expo/testeai/ai/hooks/useGameLogic.ts
import { useState } from "react";

const useGameLogic = (word: string) => {
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const revealLetter = (letter: string) => {
    if (isGameOver) return;
    
    const upperLetter = letter.toUpperCase();
    if (!word.toUpperCase().includes(upperLetter)) {
      setWrongGuesses((prev) => prev + 1);
      setWrongLetters((prev) => [...prev, upperLetter]);
    } else {
      setGuessedLetters((prev) => [...prev, upperLetter]);
    }
  };

  const isWinner = word.length > 0 && word.toUpperCase().split("").every(
    (letter) => letter === " " || guessedLetters.includes(letter.toUpperCase())
  );

  const setGameOver = (value: boolean) => {
    setIsGameOver(value);
  };

  const resetGameState = () => {
    setGuessedLetters([]);
    setWrongGuesses(0);
    setWrongLetters([]);
    setIsGameOver(false);
  };

  return { 
    guessedLetters, 
    wrongGuesses, 
    wrongLetters,
    revealLetter, 
    isGameOver, 
    isWinner, 
    setGameOver,
    resetGameState 
  };
};

export default useGameLogic;