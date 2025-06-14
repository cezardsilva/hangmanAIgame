import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useMovieFetcher } from "./api/openRouter";

import Keyboard from "./components/Keyboard";
import Hangman from "./components/Hangman";
import useGameLogic from "./hooks/useGameLogic";
import GameWord from "./components/GameWord";

import axios from "axios";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const {
    loading,
    produzido,
    titulo,
    dica1,
    dica2,
    dica3,
    imdb_id,
    error,
    fetchMovie,
  } = useMovieFetcher();

  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [showHint3, setShowHint3] = useState(false);
  const [showHint4, setShowHint4] = useState(false);
  const [showHint5, setShowHint5] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [finalWord, setFinalWord] = useState("");

  const {
    guessedLetters,
    wrongGuesses,
    wrongLetters,
    revealLetter,
    isGameOver,
    isWinner,
    resetGameState,
    setGameOver,
  } = useGameLogic(titulo);

  // Timer logic (countdown)
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
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
      if (timeLeft === 15) setShowHint5(true);
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
    setFinalWord(titulo || "");
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

  const [showMovieModal, setShowMovieModal] = useState(false);
  const [movie, setMovie] = useState<any>(null);

  const startNewGame = async () => {
    try {
      await fetchMovie();
      resetGameState();
      setTimeLeft(120);
      setShowHint1(false);
      setShowHint2(false);
      setShowHint3(false);
      setShowHint4(false);
      setShowHint5(false);
      setGameOverByTime(false);
      setGameOverByHangman(false);
      setGameStarted(true);
      setFinalWord("");
      // Busque os dados do filme e já preencha o estado movie
      if (imdb_id) {
        const movieData = await fetchMovieData(imdb_id);
        setMovie(movieData);
      } else {
        setMovie(null);
      }
    } catch (error) {
      console.error("Erro ao buscar palavra:", error);
      setMovie(null);
    }
  };

  const handleNewGame = async () => {
    await startNewGame();
  };

const handlePlayAgain = async () => {
  setMovie(null); // Limpa o estado do filme ao jogar novamente
  await startNewGame();
};

  useEffect(() => {
    if (isWinner) {
      setFinalWord(titulo || "");
    }
  }, [isWinner, titulo]);

  async function fetchMovieData(imdb_id: string) {
    const query = `
    {
      title(id: "${imdb_id}") {
        id
        type
        is_adult
        primary_title
        original_title
        start_year
        end_year
        runtime_minutes
        plot
        rating {
          aggregate_rating
          votes_count
        }
        genres
        posters {
          url
          width
          height
        }
        certificates {
          country {
            code
            name
          }
          rating
        }
        spoken_languages {
          code
          name
        }
        origin_countries {
          code
          name
        }
        directors: credits(first: 5, categories: ["director"]) {
          name {
            id
            display_name
            avatars {
              url
              width
              height
            }
          }
        }
        casts: credits(first: 5, categories: ["actor", "actress"]) {
          name {
            id
            display_name
            avatars {
              url
              width
              height
            }
          }
          characters
        }
      }
    }
  `;
    try {
      const response = await axios.post(
        "https://graph.imdbapi.dev/v1",
        { query },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data?.data?.title || null;
    } catch (error) {
      return null;
    }
  }

const handleShowMovieModal = async () => {
  if (!movie && imdb_id) {
    const movieData = await fetchMovieData(imdb_id);
    setMovie(movieData);
  }
  setShowMovieModal(true);
};

  // Estado para o modo escuro
  const [darkMode, setDarkMode] = useState(false);

  // Paleta de cores para claro/escuro
  const theme = {
    light: {
      background: "#fff",
      text: "#222",
      hint: "#555",
      sectionTitle: "#666",
      usedLettersBg: "#f8f8f8",
      keyboardBg: "#fff",
      timerBg: "#f0f0f0",
      modalBg: "rgba(0,0,0,0.7)",
      button: "#007AFF",
      buttonText: "#fff",
      secondaryButton: "#34C759",
      error: "red",
      movieModalBg: "#fff",
    },
    dark: {
      background: "#181A20",
      text: "#fff",
      hint: "#bbb",
      sectionTitle: "#bbb",
      usedLettersBg: "#23242a",
      keyboardBg: "#23242a",
      timerBg: "#23242a",
      modalBg: "rgba(0,0,0,0.95)",
      button: "#007AFF",
      buttonText: "#fff",
      secondaryButton: "#34C759",
      error: "#ff7675",
      movieModalBg: "#23242a",
    },
  };

  const currentTheme = darkMode ? theme.dark : theme.light;

  // Função utilitária para traduzir gêneros
  function traduzirGenero(genero: string): string {
    const mapa: { [key: string]: string } = {
      Action: "Ação",
      Adventure: "Aventura",
      Animation: "Animação",
      Biography: "Biografia",
      Comedy: "Comédia",
      Crime: "Crime",
      Documentary: "Documentário",
      Drama: "Drama",
      Family: "Família",
      Fantasy: "Fantasia",
      History: "História",
      Horror: "Terror",
      Music: "Música",
      Musical: "Musical",
      Mystery: "Mistério",
      Romance: "Romance",
      SciFi: "Ficção Científica",
      "Science Fiction": "Ficção Científica",
      Sport: "Esporte",
      Thriller: "Suspense",
      War: "Guerra",
      Western: "Faroeste",
      RealityTV: "Reality Show",
      News: "Notícias",
      TalkShow: "Talk Show",
      Short: "Curta",
      // Adicione mais conforme necessário
    };
    return mapa[genero] || genero;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]}>
      <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
        {/* Ícone de alternância de tema no topo da tela inicial */}
        {!gameStarted && (
          <TouchableOpacity
            style={styles.themeToggle}
            onPress={() => setDarkMode((d) => !d)}
            accessibilityLabel="Alternar modo escuro/claro"
          >
            <Ionicons
              name={darkMode ? "sunny" : "moon"}
              size={28}
              color={darkMode ? "#FFD700" : "#222"}
            />
          </TouchableOpacity>
        )}

        {!gameStarted ? (
          <View style={styles.startContainer}>
            <Text style={[styles.title, { color: currentTheme.text }]}>Jogo da Forca</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: currentTheme.button }]}
              onPress={handleNewGame}
              disabled={loading}
            >
              <Text style={[styles.buttonText, { color: currentTheme.buttonText }]}>
                {loading ? "Carregando..." : "Novo Jogo"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Área fixa do topo */}
            <View style={styles.topSection}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: currentTheme.text }]}>Qual o Filme?</Text>
                <View style={[styles.timerContainer, { backgroundColor: currentTheme.timerBg }]}>
                  <Text style={[styles.timerText, { color: currentTheme.text }]}>⏳ {timeLeft}s</Text>
                </View>
              </View>

              {/* Área de dicas com altura fixa */}
              <View style={styles.hintsArea}>
                {error ? (
                  <Text style={[styles.error, { color: currentTheme.error }]}>{error}</Text>
                ) : (
                  <>
                    {showHint1 && (
                      <Text style={[styles.hint, { color: currentTheme.hint }]}>Dica 1: {dica1}</Text>
                    )}
                    {showHint2 && (
                      <Text style={[styles.hint, { color: currentTheme.hint }]}>Dica 2: {dica2}</Text>
                    )}
                    {showHint3 && (
                      <Text style={[styles.hint, { color: currentTheme.hint }]}>Dica 3: {dica3}</Text>
                    )}
                    {showHint4 && (
                      <Text style={[styles.hint, { color: currentTheme.hint }]}>
                        Dica 4: Produzido em {produzido}
                      </Text>
                    )}
                  </>
                )}
              </View>
              <View style={styles.wordArea}>
                <GameWord
                  word={titulo}
                  guessedLetters={guessedLetters}
                  textColor={currentTheme.text}
                />
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
                  <View style={[styles.usedLettersContainer, { backgroundColor: currentTheme.usedLettersBg }]}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.sectionTitle }]}>Letras utilizadas:</Text>
                    <Text style={[styles.lettersText, { color: currentTheme.text }]}>
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
            <View style={[styles.keyboardContainer, { backgroundColor: currentTheme.keyboardBg }]}>
              <Keyboard revealLetter={revealLetter} />
            </View>
          </>
        )}

        <Modal visible={isGameOver || isWinner} animationType="slide">
          <View style={[styles.modalContainer, { backgroundColor: currentTheme.modalBg }]}>
            <Text style={[styles.modalText, { color: currentTheme.buttonText }]}>
              {isWinner
                ? `🎉 Você venceu! O filme era: ${finalWord}`
                : gameOverByTime
                ? `⏰ Tempo esgotado! O filme era: ${finalWord}`
                : `☠️ Game Over! A palavra era: ${finalWord}`}
            </Text>
            <View style={{ flexDirection: "column", gap: 16, marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.customButton, { backgroundColor: currentTheme.button }]}
                onPress={handleShowMovieModal}
              >
                <Text style={[styles.customButtonText, { color: currentTheme.buttonText }]}>
                  Ver detalhes do filme
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.customButton,
                  styles.secondaryButton,
                  { backgroundColor: currentTheme.secondaryButton },
                ]}
                onPress={handlePlayAgain}
                disabled={loading}
              >
                <Text style={[styles.buttonText, { color: currentTheme.buttonText }]}>
                  {loading ? "Carregando..." : "Jogar Novamente"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showMovieModal}
          animationType="slide"
          onRequestClose={() => setShowMovieModal(false)}
        >
          <ScrollView contentContainerStyle={[styles.movieModalContent, { backgroundColor: currentTheme.movieModalBg }]}>
            {movie ? (
              <>
                <Text style={[styles.title, { color: currentTheme.text }]}>{movie.primary_title}</Text>
                <Text style={{ color: currentTheme.text }}>Ano: {movie.start_year}</Text>
                <Text style={{ color: currentTheme.text }}>Duração: {movie.runtime_minutes} min</Text>
                <Text style={{ color: currentTheme.text }}>
                  Tipo: {movie.type === "movie" ? "Filme" : movie.type === "tvSeries" ? "Série" : movie.type}
                </Text>
                <Text style={{ color: currentTheme.text }}>Adulto: {movie.is_adult ? "Sim" : "Não"}</Text>
                <Text style={{ color: currentTheme.text }}>
                  Gêneros: {movie.genres && movie.genres.map((g: string) => traduzirGenero(g)).join(", ")}
                </Text>
                <Text style={{ color: currentTheme.text, fontSize: 20 }}>
                  Nota: <Text style={{ color: "#FFD700", fontSize: 22 }}>★</Text> {movie.rating?.aggregate_rating} (
                  {movie.rating?.votes_count} votos)
                </Text>
                <Text style={{ marginTop: 10, color: currentTheme.text }}>
                  Sinopse: {movie.plot ? movie.plot : "Sinopse não disponível"}
                </Text>
                {movie.posters && movie.posters[0] && (
                  <View style={styles.centeredImage}>
                    {movie.posters && movie.posters[0] && movie.posters[0].url ? (
                      <Image
                        source={{ uri: movie.posters[0].url }}
                        style={{ width: 200, height: 300, marginVertical: 10 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <View
                        style={{
                          width: 200,
                          height: 300,
                          marginVertical: 10,
                          backgroundColor: "#ccc",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 8,
                        }}
                      >
                        <Text style={{ color: "#888" }}>Imagem não disponível</Text>
                      </View>
                    )}
                  </View>
                )}
                <Text style={{ marginTop: 10, fontWeight: "bold", color: currentTheme.text }}>
                  Diretores:
                </Text>
                {movie.directors &&
                  movie.directors.map((d: any, idx: number) => (
                    <Text key={idx} style={{ color: currentTheme.text }}>{d.name.display_name}</Text>
                  ))}
                <Text style={{ marginTop: 10, fontWeight: "bold", color: currentTheme.text }}>
                  Elenco:
                </Text>
                {movie.casts &&
                  movie.casts.map((c: any, idx: number) => (
                    <Text key={idx} style={{ color: currentTheme.text }}>
                      {c.name.display_name}{" "}
                      {c.characters && `(${c.characters.join(", ")})`}
                    </Text>
                  ))}
                <TouchableOpacity
                  style={[
                    styles.customButton,
                    { alignSelf: "center", marginTop: 20, backgroundColor: currentTheme.button },
                  ]}
                  onPress={() => setShowMovieModal(false)}
                >
                  <Text style={[styles.customButtonText, { color: currentTheme.buttonText }]}>Fechar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={{ color: currentTheme.text }}>Carregando...</Text>
            )}
          </ScrollView>
        </Modal>

        <StatusBar style={darkMode ? "light" : "dark"} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: "relative",
    paddingBottom: Platform.OS === "android" ? 20 : 0,
  },
  themeToggle: {
    position: "absolute",
    top: 40,
    right: 24,
    zIndex: 10,
    backgroundColor: "transparent",
    padding: 8,
  },
  startContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  timerContainer: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  timerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  hintsArea: {
    minHeight: 120,
    marginBottom: 20,
  },
  hint: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
  },
  wordArea: {
    minHeight: 100,
    justifyContent: "center",
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
    flexDirection: "row",
  },
  mainColumn: {
    flex: 3,
    paddingRight: 15,
  },
  hangmanColumn: {
    flex: 1,
    alignItems: "center",
  },
  usedLettersContainer: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
  lettersText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  keyboardContainer: {
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === "android" ? 30 : 10,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    minWidth: 200,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalText: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
    textAlign: "center",
    padding: 20,
  },
  customButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
    minWidth: 160,
  },
  secondaryButton: {
    backgroundColor: "#34C759",
  },
  customButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  movieModalContent: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  centeredImage: {
    alignItems: "center",
    justifyContent: "center",
  },
});