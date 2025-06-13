// /home/srvlinux/Git/Apps/Expo/testeai/ai/api/openRouter.tsx
import { useState } from 'react';

export const useMovieFetcher = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [produzido, setProduzido] = useState<number>(0);
  const [titulo, setTitulo] = useState<string>('Carregando filme...');
  const [dica1, setDica1] = useState<string>('');
  const [dica2, setDica2] = useState<string>('');
  const [dica3, setDica3] = useState<string>('');
  const [imdb_id, setImdb_id] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const parseMovieResponse = (response: string) => {
    const lines = response.split('\n');
    let titulo = '';
    let d1 = '';
    let d2 = '';
    let d3 = '';
    let imdbid = '';

    for (const line of lines) {
      if (line.startsWith('Dica1:')) {
        d1 = line.replace('Dica1:', '').trim();
      } else if (line.startsWith('Dica2:')) {
        d2 = line.replace('Dica2:', '').trim();
      } else if (line.startsWith('Dica3:')) {
        d3 = line.replace('Dica3:', '').trim();
      } else if (line.startsWith('Imdb_id:')) {
        imdbid = line.replace('Imdb_id:', '').trim();
      } else if (line.trim() && !titulo) {
        titulo = line.trim();
      }
    }

    return { titulo, dica1: d1, dica2: d2, dica3: d3, imdb_id: imdbid };
  };

  const fetchMovie = async () => {
    setLoading(true);
    try {
      const novoAno = Math.floor(Math.random() * (2024 - 1970 + 1)) + 1970;
      setProduzido(novoAno);

      console.log("Produzido em:", novoAno);

      const url = "https://openrouter.ai/api/v1/chat/completions";
      const headers = {
        "Authorization": `Bearer ${process.env.EXPO_PUBLIC_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      };
 const payload = { 
  "model": "meta-llama/llama-4-maverick", 
  "messages": [ 
  { "role": "system", "content": `Você vai retornar os seguintes parâmetros: 
  1. O nome de um filme produzido em ${novoAno} aleatoriamente. 
  Retorne apenas o título como foi lançado no Brasil, sem comentários, ano ou aspas; 
  2. Três informações sobre o filme no formato: 
  Dica1: [texto com até 6 palavras] ,
  Dica2: [texto com até 6 palavras] ,
  Dica3: [texto com até 6 palavras] ;
  3. O ano de produção do filme;
  4. O IMDB ID do filme no formato: Imdb_id: [ID_do_filme]. Use o título do filme em inglês para buscar o IMDB ID. 
  Se houverem títulos em inglês iguais, use o ano de produção do filme e as dicas para diferenciá-los. 
  Se não houver correlação entre o título do filme e o IMDB ID, reinicie a busca por outro filme;
  5. Você deve retornar apenas o título do filme, as dicas e o IMDB ID, sem comentários adicionais.`,
 }, 
 { "role": "user", "content": "Qual filme?" }
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
      
      const { titulo, dica1, dica2, dica3, imdb_id } = parseMovieResponse(responseContent);
      
      setTitulo(titulo);
      console.log("Título do filme:", titulo);
      setDica1(dica1);
      console.log("Dica 1:", dica1);
      setDica2(dica2);
      console.log("Dica 2:", dica2);
      setDica3(dica3);
      console.log("Dica 3:", dica3);
      setImdb_id(imdb_id);
      console.log("IMDB ID:", imdb_id)
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
    imdb_id,
    error,
    fetchMovie
  };
};