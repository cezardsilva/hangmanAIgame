import React from "react";
import { View, Text } from "react-native";

const GameWord = ({ word, guessedLetters }: { word: string; guessedLetters: string[] }) => {
  // console.log("🔍 Palavra carregada:", word);
  // console.log("🔠 Letras adivinhadas:", guessedLetters);

const renderWord = () => {
  return word
    ? word.toUpperCase().split("").map((letter) =>
        letter === " " ? " " : guessedLetters.includes(letter.toUpperCase()) || letter === " " 
          ? letter.toUpperCase() 
          : "_"
      ).join(" ")
    : "Clique em GERAR PALAVRA!";
};

  return (
    <View style={{ alignItems: "center", marginVertical: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{renderWord()}</Text>
    </View>
  );
};

export default GameWord;
