// /home/srvlinux/Git/Apps/Expo/testeai/ai/App.tsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Button, Modal, ScrollView, SafeAreaView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useMovieFetcher } from './api/openRouter';

import Keyboard from "./components/Keyboard";
import Hangman from "./components/Hangman";
import useGameLogic from './hooks/useGameLogic';
import GameWord from './components/GameWord';

export default function App() {
  const { 
    loading, 
    produzido, 
    titulo, 
    dica1, 
    dica2, 
    dica3, 
    error, 
    fetchMovie 
  } = useMovieFetcher();

  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [showHint3, setShowHint3] = useState(false);
  const [showHint4, setShowHint4] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [finalWord, setFinalWord] = useState('');

  const { 
    guessedLetters, 
    wrongGuesses, 
    wrongLetters, 
    revealLetter, 
    isGameOver, 
    isWinner, 
    resetGameState,
    setGameOver
  } = useGameLogic(titulo);

  // Timer logic (countdown)
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          endGame(false, true);
          return 0;
        }
        return prev - 1;
      });

      // Show hints at specific times
      if (timeLeft === 90) setShowHint1(true);
      if (timeLeft === 75) setShowHint2(true);
      if (timeLeft === 60) setShowHint3(true);
      if (timeLeft === 30) setShowHint4(true);

    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, timeLeft, titulo]);

  // Check for game over by wrong guesses
  useEffect(() => {
    if (wrongGuesses >= 6 && !isGameOver) {
      endGame(true, false);
    }
  }, [wrongGuesses, isGameOver]);

  const endGame = (isHangmanGameOver: boolean, isTimeOver: boolean) => {
    setFinalWord(titulo || '');
    setGameOver(true);
    setGameStarted(false);
    
    if (isTimeOver) {
      setGameOverByTime(true);
    } else if (isHangmanGameOver) {
      setGameOverByHangman(true);
    }
  };

  const [gameOverByTime, setGameOverByTime] = useState(false);
  const [gameOverByHangman, setGameOverByHangman] = useState(false);

  const startNewGame = async () => {
    try {
      await fetchMovie();
      resetGameState();
      setTimeLeft(120); ///   TEMPO DE JOGO
      setShowHint1(false);
      setShowHint2(false);
      setShowHint3(false);
      setGameOverByTime(false);
      setGameOverByHangman(false);
      setGameStarted(true);
      setFinalWord('');
    } catch (error) {
      console.error("Erro ao buscar palavra:", error);
    }
  };

  const handleNewGame = async () => {
    await startNewGame();
  };

  const handlePlayAgain = async () => {
    await startNewGame();
  };

  useEffect(() => {
    if (isWinner) {
      setFinalWord(titulo || '');
    }
  }, [isWinner, titulo]);


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {!gameStarted ? (
          <View style={styles.startContainer}>
            <Text style={styles.title}>Jogo da Forca</Text>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleNewGame}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Carregando...' : 'Novo Jogo'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Área fixa do topo */}
            <View style={styles.topSection}>
              <View style={styles.header}>
                <Text style={styles.title}>Qual o Filme?</Text>
                <View style={styles.timerContainer}>
                  <Text style={styles.timerText}>⏳ {timeLeft}s</Text>
                </View>
              </View>

              {/* Área de dicas com altura fixa */}
              <View style={styles.hintsArea}>
                {error ? (
                  <Text style={styles.error}>{error}</Text>
                ) : (
                  <>
                    {showHint1 && <Text style={styles.hint}>Dica 1: {dica1}</Text>}
                    {showHint2 && <Text style={styles.hint}>Dica 2: {dica2}</Text>}
                    {showHint3 && <Text style={styles.hint}>Dica 3: {dica3}</Text>}
                    {showHint3 && <Text style={styles.hint}>Dica 4: Produzido em {produzido}</Text>}
                  </>
                )}
              </View>

              {/* Área da palavra com altura fixa */}
              <View style={styles.wordArea}>
                <GameWord word={titulo} guessedLetters={guessedLetters} />
              </View>
            </View>

            {/* Conteúdo principal rolável */}
            <ScrollView 
              style={styles.middleSection}
              contentContainerStyle={styles.middleContent}
            >
              <View style={styles.gameContent}>
                {/* Coluna principal (75%) */}
                <View style={styles.mainColumn}>
                  <View style={styles.usedLettersContainer}>
                    <Text style={styles.sectionTitle}>Letras utilizadas:</Text>
                    <Text style={styles.lettersText}>
                      {[...guessedLetters, ...wrongLetters].join(" ")}
                    </Text>
                  </View>
                </View>
                
                {/* Coluna do boneco (25%) */}
                <View style={styles.hangmanColumn}>
                  <Hangman wrongGuesses={wrongGuesses} />
                </View>
              </View>
            </ScrollView>

            {/* Teclado fixo na parte inferior (com margem segura) */}
            <View style={styles.keyboardContainer}>
              <Keyboard revealLetter={revealLetter} />
            </View>
          </>
        )}
      
      <Modal visible={isGameOver || isWinner} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            {isWinner ? `🎉 Você venceu! O filme era: ${finalWord}` : 
             gameOverByTime ? `⏰ Tempo esgotado! O filme era: ${finalWord}` : 
             `☠️ Game Over! A palavra era: ${finalWord}`}
          </Text>
          <Button title="Jogar Novamente" onPress={handlePlayAgain} />
        </View>
      </Modal>
      
      <StatusBar style="auto" />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    position: 'relative',
    paddingBottom: Platform.OS === 'android' ? 20 : 0, // Adiciona padding extra no Android
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  timerContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  timerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  hintsArea: {
    minHeight: 120,
    marginBottom: 20,
  },
  hint: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  wordArea: {
    minHeight: 100,
    justifyContent: 'center',
    marginBottom: 20,
  },
  middleSection: {
    flex: 1,
  },
  middleContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gameContent: {
    flexDirection: 'row',
  },
  mainColumn: {
    flex: 3,
    paddingRight: 15,
  },
  hangmanColumn: {
    flex: 1,
    alignItems: 'center',
  },
  usedLettersContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  lettersText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  keyboardContainer: {
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'android' ? 30 : 10, // Margem maior no Android
    backgroundColor: '#fff',
    // Adiciona sombra no iOS para melhor visualização
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    minWidth: 200,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    padding: 20,
  },
});