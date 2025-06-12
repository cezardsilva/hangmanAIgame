// /home/srvlinux/Git/Apps/Expo/testeai/ai/components/Keyboard.tsx
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const letters = "QWERTYUIOPASDFGHJKLÇZXCVBNMÁÉÓÚÍÀÃÕÂÊÔ,.;()-=+#!%<>:{}/*'&?@0123456789".split("");

const Keyboard = ({ revealLetter }: { revealLetter: (letter: string) => void }) => {
  return (
    <View style={styles.container}>
      {letters.map((letter) => (
        <TouchableOpacity
          key={letter}
          style={styles.key}
          onPress={() => revealLetter(letter)}
        >
          <Text style={styles.keyText}>{letter}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 5,
    gap: 3
  },
  key: {
    width: 28,
    height: 32,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Keyboard;