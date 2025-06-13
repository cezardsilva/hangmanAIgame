import React from "react";
import { View, Text } from "react-native";

interface GameWordProps {
  word: string;
  guessedLetters: string[];
  textColor?: string; // Permite receber a cor do tema
}

const GameWord: React.FC<GameWordProps> = ({ word, guessedLetters, textColor = "#222" }) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
      {word.split("").map((char, idx) => (
        <Text
          key={idx}
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: /[A-Za-zÀ-ÿ]/.test(char) ? textColor : "#888",
            marginHorizontal: 4,
            borderBottomWidth: /[A-Za-zÀ-ÿ]/.test(char) ? 2 : 0,
            borderBottomColor: "#bbb",
            minWidth: 24,
            textAlign: "center",
          }}
        >
          {guessedLetters.includes(char.toUpperCase()) || !/[A-Za-zÀ-ÿ]/.test(char) ? char : "_"}
        </Text>
      ))}
    </View>
  );
};

export default GameWord;