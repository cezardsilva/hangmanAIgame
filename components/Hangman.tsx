import React from "react";
import { View, Text } from "react-native";

const Hangman = ({ wrongGuesses }: { wrongGuesses: number }) => {
  const stages = [
    " ",
    "😵",
    "😵\n |",
    "😵\n/|",
    "😵\n/|\\",
    "😵\n/|\\\n/",
    "😵\n/|\\\n/ \\"
  ];

  return (
    <View style={{ alignItems: "center", marginVertical: 20 }}>
      <Text style={{ fontSize: 30, textAlign: "center" }}>{stages[wrongGuesses]}</Text>
    </View>
  );
};

export default Hangman;
