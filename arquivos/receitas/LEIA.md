# Receitas das imagens da Kilo

O visual da Kilo é a tipografia e a peça 3D, que é feita em código (`src/gl/`): não existe modelo 3D, vídeo nem
imagem por trás dela. As únicas imagens do site são as **três fotos da seção Estrutura**
(`public/fotos/salao.webp`, `peso-livre.webp` e `tatame.webp`), geradas por IA a partir dos prompts de `prompts/`
(em inglês, que é como os geradores de imagem respondem melhor).

**No site de verdade, use fotos da sua academia.** Foto gerada mostra um lugar que não existe, e quem visita a
academia percebe na hora.

## Usar as suas fotos

1. Escolha três fotos (o salão, a área de peso livre ou a sala principal, e a sala de aula ou o tatame). Foto de
   celular serve, de preferência com gente treinando, tirada de dia ou com as luzes acesas. A página mostra tudo em
   preto e branco, então a cor da foto não precisa combinar com nada.
2. Converta, da raiz do projeto: `npm install -D -E sharp@0.35.5` (uma vez) e depois
   `node arquivos/fonte/fotos.mjs salao.jpg peso-livre.jpg tatame.jpg`. Ele recorta cada foto num quadrado de
   1000 px e grava em `public/fotos/` com os nomes que o HTML já usa. Para trocar só uma, passe `-` no lugar das outras.
3. Troque as legendas e o texto alternativo (`alt`) em `src/sections/estrutura.html`.

Confira antes de publicar: nenhuma marca de terceiros em destaque (logotipo em camiseta, tênis ou aparelho) e
autorização de quem aparece de rosto.

## Gerar fotos de exemplo

Se ainda não houver fotos, dá para gerar um jogo novo como o da demo:

1. Junte o texto de `prompts/_estilo.txt` (o parágrafo de estilo, igual para as três) com o de cada cena
   (`salao.prompt.txt`, `peso-livre.prompt.txt`, `tatame.prompt.txt`). O estilo pede foto de celular, torta e sem
   tratamento: é o que faz a imagem parecer foto de verdade, e não foto de banco.
2. Gere em qualquer gerador de imagem (o do ChatGPT, o Gemini, o Midjourney, o Ideogram), em formato quadrado.
3. Olhe com zoom antes de usar: mãos, rostos ao fundo e, principalmente, **marcas** (o gerador costuma desenhar um
   logotipo parecido com o de uma marca famosa nos tênis). As duas fotos de gente da demo foram recortadas acima dos
   pés por isso.
4. Converta com o mesmo `fotos.mjs` do passo anterior.

Custo aproximado: três gerações de imagem.

## A peça 3D não tem receita

As sete formas (anilha, halter, kettlebell, saco de pancada, bola, cadeado e cronômetro) são funções escritas em
`src/gl/formas.js`. Para mudar uma forma ou criar outra, peça à IA que edite esse arquivo (o guia explica) e veja o
resultado em `laboratorio.html`. Não tente trocar a peça por um arquivo de modelo 3D: a troca de forma depende de
ela ser uma função.
