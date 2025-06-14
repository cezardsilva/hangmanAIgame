import React from "react";
import { View, Text } from "react-native";

const Hangman = ({ wrongGuesses }: { wrongGuesses: number }) => {
  // Cada parte do boneco é um Text separado para colorir membros/tronco
  return (
    <View style={{ alignItems: "center", marginVertical: 20 }}>
      {/* Cabeça */}
      {wrongGuesses > 0 && (
        <Text style={{ fontSize: 25, textAlign: "center" }}>😵</Text>
      )}
      {/* Tronco */}
      {wrongGuesses > 1 && (
        <Text style={{ fontSize: 35, color: "red", lineHeight: 30 }}>|</Text>
      )}
      {/* Braço esquerdo */}
      {wrongGuesses > 2 && (
        <Text style={{ fontSize: 25, color: "red", position: "absolute", left: 3, top: 34 }}>/</Text>
      )}
      {/* Braço direito */}
      {wrongGuesses > 3 && (
        <Text style={{ fontSize: 25, color: "red", position: "absolute", right: 2, top: 34 }}>\</Text>
      )}
      {/* Perna esquerda */}
      {wrongGuesses > 4 && (
        <Text style={{ fontSize: 30, color: "red", position: "absolute", left: 4, top: 50 }}>/</Text>
      )}
      {/* Perna direita */}
      {wrongGuesses > 5 && (
        <Text style={{ fontSize: 30, color: "red", position: "absolute", right: 6, top: 50 }}>\</Text>
      )}
      {/* Espaço para manter altura */}
      <View style={{ height: 80 }} />
    </View>
  );
};

export default Hangman;