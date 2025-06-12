// /home/srvlinux/Git/Apps/Expo/testeai/ai/api/openRouter.tsx
import { useState } from 'react';

export const useMovieFetcher = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [produzido, setProduzido] = useState<number>(0);
  const [titulo, setTitulo] = useState<string>('Carregando filme...');
  const [dica1, setDica1] = useState<string>('');
  const [dica2, setDica2] = useState<string>('');
  const [dica3, setDica3] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const parseMovieResponse = (response: string) => {
    const lines = response.split('\n');
    let titulo = '';
    let d1 = '';
    let d2 = '';
    let d3 = '';

    for (const line of lines) {
      if (line.startsWith('Dica1:')) {
        d1 = line.replace('Dica1:', '').trim();
      } else if (line.startsWith('Dica2:')) {
        d2 = line.replace('Dica2:', '').trim();
      } else if (line.startsWith('Dica3:')) {
        d3 = line.replace('Dica3:', '').trim();
      } else if (line.trim() && !titulo) {
        titulo = line.trim();
      }
    }

    return { titulo, dica1: d1, dica2: d2, dica3: d3 };
  };

  const fetchMovie = async () => {
    setLoading(true);
    try {
      const novoAno = Math.floor(Math.random() * (2024 - 1970 + 1)) + 1970;
      setProduzido(novoAno);

      const url = "https://openrouter.ai/api/v1/chat/completions";
      const headers = {
        "Authorization": `Bearer ${process.env.EXPO_PUBLIC_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      };
      const payload = {
        "model": "meta-llama/llama-4-maverick",
        "messages": [
          {
            "role": "system",
            "content": `Você vai retornar:
1. O nome de um filme produzido em ${novoAno} aleatoriamente (apenas o título como foi lançado no Brasil, sem comentários, ano ou aspas)
2. Três informações sobre o filme no formato:
Dica1: [texto com até 6 palavras]
Dica2: [texto com até 6 palavras]
Dica3: [texto com até 6 palavras]`
          },
          {
            "role": "user",
            "content": "Qual filme?"
          }
        ],
        "temperature": 2
      };

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      const responseContent = data.choices?.[0]?.message?.content || "Filme não encontrado";
      
      const { titulo, dica1, dica2, dica3 } = parseMovieResponse(responseContent);
      
      setTitulo(titulo);
      setDica1(dica1);
      setDica2(dica2);
      setDica3(dica3);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar filme:", err);
      setError("Erro ao carregar o filme. Verifique o console para mais detalhes.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    produzido,
    titulo,
    dica1,
    dica2,
    dica3,
    error,
    fetchMovie
  };
};