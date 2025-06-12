// api/generateWord.ts
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function generateWord() {
  try {
    const categories = ["Animais", "Filmes", "Cidades"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const docRef = doc(collection(db, "words"), randomCategory);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error("Categoria não encontrada.");
    }

    const wordList = snapshot.data()?.list || [];
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];

    console.log(`🚀 Palavra selecionada: ${randomWord} | Categoria: ${randomCategory}`);

    return { word: randomWord, category: randomCategory };
  } catch (error) {
    console.error("Erro ao gerar palavra:", error);
    return { word: "Erro", category: "Desconhecido" };
  }
}

