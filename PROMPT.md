# Kilo: academia, com uma peça 3D de borracha preta que acompanha a página inteira e muda de forma a cada seção

## Antes de começar: pergunte

Antes de escrever qualquer código, faça estas perguntas, uma por vez e em linguagem simples (a pessoa pode não ser programadora):

1. **O que você quer fazer com este site?**
   - **Montar a demo como ela é**, para ver funcionando e trocar depois.
   - **Fazer o site da minha academia** (ou do meu estúdio, box de cross, escola de lutas ou trabalho de personal) com esta estrutura e este movimento.
   - **Usar só algumas peças** (a peça 3D que muda de forma e viaja pela página, o título com a peça no lugar de uma letra, a cena presa das modalidades, a grade de horários em abas, o pedido que abre o WhatsApp) num site que já tenho.
2. Se for a academia dela: o nome, a frase principal, as modalidades (três, com um nome curto, um parágrafo e cinco itens cada), três planos com preço, a grade de aulas da semana, os números da casa (área, aparelhos, salas, horário), três depoimentos de alunos, as perguntas mais comuns, o endereço, o WhatsApp e as redes, e **o que já tem** (logo, cor da marca, fotos do espaço). Avise desde já:
   - a peça 3D é feita em código e não precisa de modelo, vídeo nem imagem: as sete formas da demo (anilha, halter, kettlebell, saco de pancada, bola, cadeado e cronômetro) já vêm prontas, e dá para pedir outras;
   - as três fotos da seção de estrutura devem ser da academia dela (`arquivos/receitas/LEIA.md` explica o formato); as da demo são geradas e mostram um lugar que não existe;
   - preços, números, depoimentos e contatos são dados de verdade: sem os dela, ficam `[preencher]`, nunca inventados.
3. Se forem peças: quais, e onde está o site que vai recebê-las.

Depois, em qualquer caminho, **monte primeiro a demo completa como descrita abaixo** e confira que ela roda: é o caminho testado e fica de referência. Só então aplique a marca ou extraia as peças, seguindo a seção "Personalizar" do guia. Termine com uma lista curta do que ainda é da demo e do que falta a pessoa mandar.

## A demo

Construa a landing page da **Kilo** (marca fictícia), uma academia de musculação, cross e lutas. Leia antes o guia do projeto desta pasta (`CLAUDE.md`, ou `AGENTS.md` no Codex e outros agentes: arquitetura, design system, as regras da peça 3D e do celular, como conferir e como personalizar) e olhe as imagens em `arquivos/conceito/`: são prints do site pronto, o alvo de cada momento, em `-desktop` e `-mobile` (`01-hero`, `02-manifesto`, `03-forca`, `04-troca`, `05-cross`, `06-luta`, `07-estrutura`, `08-planos`, `09-horarios`, `10-depoimentos`, `11-duvidas`, `12-contato`, `13-rodape`).

**Tudo o que o site usa já vem pronto em `arquivos/`:** o `index.html`, o `vite.config.js` (com o plugin que monta as seções), o código inteiro em `arquivos/src/` (as seções em HTML, as folhas de estilo, o motor da peça 3D e os módulos de movimento) e a marca e as fotos em `arquivos/public/`. Use tudo isso como está: não gere imagem nova, não reescreva o motor e não troque nada por uma versão "mais simples" (sem 3D, com a peça em imagem, em SVG ou num modelo pronto). O trabalho é montar o projeto, instalar as dependências com as versões certas, copiar os arquivos para o lugar e conferir.

A ideia da página: **uma peça só, de borracha preta e brilhante, atravessa a página inteira e toma a forma do equipamento de cada seção.**
- no hero, o título "MAIS UM QUILO" ocupa a tela de ponta a ponta em duas linhas, e o "O" de QUILO é uma anilha em 3D: ela entra rolando da direita e para no lugar da letra;
- ao rolar, a anilha sai do título, vira a capitular do parágrafo seguinte e, na cena das modalidades, **derrete e toma outra forma** a cada passo: halter (força), kettlebell (cross), saco de pancada (luta). A linha é um número e um nome gigantes, com a peça no meio, por cima do começo do nome;
- depois ela é bola de arremesso na frente das fotos, cadeado aberto ao lado dos planos ("sem fidelidade"), cronômetro na grade de horários, kettlebell nos depoimentos e halter nas dúvidas;
- no fim, volta a ser a anilha e pousa no "O" do nome KILO, que ocupa o rodapé de ponta a ponta: o fecho é a abertura ao contrário;
- a peça não é um modelo: cada forma é uma função (um campo de distância) desenhada ao vivo num canvas WebGL2, e trocar de forma é misturar duas funções. Por isso ela passa de uma forma com furo para uma sem furo sem emenda, e o site inteiro pesa menos de 1 MB.

Nível de acabamento: site de premiação. Fundo preto, letra branca e um limão só no botão principal; nada de grito de guerra, promessa de corpo ou "transforme sua vida" nos textos.

---

## Parte 1 — O site

### Marca e tom
- Marca **Kilo** (fictícia), em português do Brasil. O nome é a unidade que se levanta, com K; o "O" é sempre a anilha: um anel grosso na barra do topo (SVG), a peça 3D no hero e no rodapé. Frase da casa: "mais um quilo".
- Tom de professor: direto, frases curtas, o que a casa tem e como funciona. Nenhuma cidade ou estado; o endereço do rodapé é de exemplo.
- Cores em papéis (`src/styles/tokens.css`), nunca em nomes de cor: fundo `#070707`, tinta `#f2f0ea`, apoio (a tinta a 62%), fio (a 20%), acento limão `#d7ff3d` (botão principal, selo do plano, aspas, aba ativa, foco). A peça: borracha `#171718`, caixas de luz brancas e uma luz fraca no fundo atrás dela. Outras quatro paletas prontas pela URL: `?tema=mono`, `osso`, `brasa` (vermelho com tinta preta) e `cobalto`.
- Tipos (livres para uso comercial, pelo Fontsource): **Big Shoulders Stencil** nos títulos (800–900, caixa alta; os cortes de estêncil são a cara da marca) e **Geist** no texto. A letra "L" vem da Big Shoulders sem corte (`src/styles/fontes.css`): no estêncil o pé do L fica solto e, no tamanho do título, lê-se "I.".

### A peça 3D (os números)
- Um canvas só, fixo, transparente, por cima da página e sem roubar clique (`pointer-events: none`), abaixo da barra do topo. Só o quadrado em volta da peça é desenhado a cada quadro.
- Cada forma cabe numa esfera de raio 1 e é um campo de distância em GLSL (`src/gl/formas.js`). O desenho é por traçado de raios: até 80 passos (64 no celular), normal por diferença em tetraedro, oclusão em quatro amostras, borda lisa por cobertura do pixel.
- Material: borracha preta envernizada. Não há luzes de verdade: o estúdio existe só no reflexo (uma caixa de luz grande e macia no teto, uma janela nítida na frente, uma tira de cada lado e duas contraluzes atrás, que desenham a borda), com Fresnel. A recartilha (losangos em relevo) só inclina a normal: na face da anilha ela segue uma espiral logarítmica, para os losangos ficarem quadrados em qualquer raio.
- Troca de forma: a distância das duas formas misturada pelo peso de cada uma; no meio do caminho entra uma esfera na mistura (a peça passa por uma bolha de borracha) e a superfície balança. Dura 1,5 s quando a peça está em voo entre duas seções e 1,2 s na cena presa: troca curta, com a peça andando e crescendo, parece um tranco. A cada troca a peça dá uma volta, que vai morrendo no mesmo ritmo.
- Percurso: em cada seção há uma **vaga** (`<span class="vaga" data-vaga data-forma="...">`), posicionada pelo CSS. A peça fica grudada na vaga, voa entre 16% e 84% do trecho até a seguinte e pousa; a posição é uma conta sobre a rolagem. A forma, a pose e a volta correm por tempo.
- O mouse inclina a peça na direção dele, com mola (passa um pouco do ponto e volta); a rolagem a tomba conforme a velocidade; parada, ela balança devagar.

### 01 — Hero ("Mais um quilo")
- A página pinta pronta, em preto. As duas linhas do título sobem por trás de uma máscara (1,05 s, 90 ms entre elas) e a anilha entra rolando da direita, girando o quanto anda, até parar no "O" (1,5 s). Nada trava a rolagem.
- Linha 1: "MAIS" à esquerda e "UM" à direita, de ponta a ponta. Linha 2: "QUIL" e a anilha no lugar do "O". À direita da anilha, o texto, o botão limão "Agendar aula experimental" e "Ver planos"; no pé, os horários em rótulos.
- Barra no topo: KIL + o anel, as seções (a atual sublinhada) e "Aula experimental"; ganha o fundo ao sair do hero.

### 02 — Manifesto
- Uma frase só, na display, com a anilha de capitular (flutuada à esquerda, três linhas de altura). As palavras acendem uma a uma conforme a seção atravessa a tela.

### 03 — Modalidades (cena presa, três passos)
- A tela prende por três passos de 0,78 tela. A linha gigante: o número ("01", "02", "03") à esquerda e o nome ("FORÇA", "CROSS", "LUTA") à direita, sobre um fio; a peça no meio, grande, por cima do começo do nome. Embaixo do fio: o subtítulo e um parágrafo à esquerda, cinco itens em rótulos à direita e "Anterior" e "Próxima".
- A rolagem troca de passo por marcos: o número e o nome sobem por máscara, o texto e a lista entram em fila, e a peça troca de forma (halter, kettlebell, saco de pancada). Os botões levam a rolagem até o passo vizinho.

### 04 — Estrutura ("Espaço de sobra para treinar pesado")
- Três fotos em preto e branco (a do meio mais alta), com legenda; a bola de arremesso em 3D fica na frente do canto da terceira. Embaixo, quatro números grandes com legenda.

### 05 — Planos ("Três planos, nenhuma pegadinha")
- Três cartões retos (Leve, Livre, Anual) com preço, uma frase, a lista do que inclui e o botão; o do meio invertido, com o selo "Mais escolhido". O cadeado aberto em 3D ao lado do título. No celular, os cartões viram um trilho que rola de lado.

### 06 — Horários ("A grade da semana")
- À esquerda, o título, o texto e o cronômetro em 3D; à direita, os dias em abas (abre no dia de hoje) e as aulas do dia em linhas: hora, aula, professor e sala, duração. Clique, toque e setas do teclado trocam o dia; as linhas entram em fila.

### 07 — Depoimentos ("Quem treina aqui, fica")
- Três falas lado a lado, cada uma sob um fio, com aspas em limão; o kettlebell em 3D ao lado do título.

### 08 — Dúvidas ("Antes de vir")
- O título e o halter em 3D à esquerda; à direita, cinco perguntas numa sanfona (`<details>`, com a altura animada).

### 09 — Contato ("A primeira aula é por nossa conta")
- O título maior, a anilha de volta e o pedido: nome, WhatsApp (com máscara), modalidade e período em botões de escolha, e "Agendar aula experimental". Erro embaixo do campo, e, enviado, a mensagem "Pedido anotado". Com o número em `src/config.js`, o envio abre a conversa no WhatsApp com a mensagem pronta.

### 10 — Rodapé
- Endereço, horário, contatos e links em quatro colunas; embaixo, "KIL" de ponta a ponta e a anilha pousando no lugar do "O".

### Rolagem, interações e acessibilidade
- No computador, rolagem suave (Lenis) com teto de velocidade (~2 telas por segundo); no toque, a rolagem é a nativa do aparelho.
- Botões retos, sem raio: no hover e no foco, a cor sobe de baixo e a seta anda; o hover descansa enquanto a página rola. Foco de teclado visível em tudo o que é clicável; o canvas é decorativo (`aria-hidden`), e o "o" de "quilo" existe em texto para leitor de tela.
- `prefers-reduced-motion`: sem rolagem suave, sem abertura, sem volta e sem balanço; os textos à mostra e a peça só troca de forma. Sem WebGL2 ou sem JavaScript, a página aparece inteira, com um anel desenhado no lugar do "O".

---

## Parte 2 — Como construir (stack)

- **Vite sem framework**: HTML, CSS e JS puros, sem biblioteca de 3D (a peça é um shader próprio). Crie o arquivo `package.json` escrevendo-o direto (não use `npm init` nem um template do `npm create`, que trazem campos e arquivos a mais), com `"type": "module"`, `"private": true` e os scripts `"dev": "vite"`, `"build": "vite build"` e `"preview": "vite preview"` (nome e versão à sua escolha), e instale com versão travada, escrito por extenso (`npm install`, não `npm i`), um comando por linha:
  - `npm install -E lenis@1.3.26 @fontsource-variable/big-shoulders-stencil@5.3.0 @fontsource-variable/big-shoulders@5.3.0 @fontsource-variable/geist@5.3.0`;
  - `npm install -E -D vite@8.3.3` (dependência de desenvolvimento).
- **Copie os arquivos** com `cp` (as pastas inteiras de uma vez, um comando por linha, sem encadear com `&&`: em sessões com permissões restritas, comando composto pede aprovação):

  | de | para |
  |---|---|
  | `arquivos/index.html` | a raiz |
  | `arquivos/vite.config.js` | a raiz (o plugin `secoes` troca cada `<!-- @secao nome -->` do `index.html` por `src/sections/nome.html`; `base: './'`: o `dist/` abre em qualquer pasta da hospedagem) |
  | `arquivos/laboratorio.html` | a raiz (página de trabalho com todas as formas da peça; não entra no `dist/`) |
  | `arquivos/src/` (a pasta inteira) | `src/` |
  | `arquivos/public/` (a pasta inteira) | `public/` |

  Os comandos, da raiz do projeto: `cp arquivos/index.html .`, `cp arquivos/vite.config.js .`, `cp arquivos/laboratorio.html .`, `cp -R arquivos/src src` e `cp -R arquivos/public public` (sem barra no fim do nome da pasta). Copie antes de existir uma pasta `src/` ou `public/` na raiz (senão o `cp -R` cria `src/src/`); se alguma já existir de uma tentativa anterior, apague-a antes de copiar. A pasta `arquivos/` continua onde está: não entra no site nem no `dist/`.

  Confira depois da cópia: `src/main.js` e `src/config.js`; `src/gl/` com 3 módulos (`formas.js`, `peca.js`, `poses.js`); `src/motion/` com 13 (`ancoras.js`, `barra.js`, `contato.js`, `duvidas.js`, `guia.js`, `horarios.js`, `manifesto.js`, `marcos.js`, `modalidades.js`, `percurso.js`, `rolando.js`, `scrollbar.js`, `smooth.js`); `src/sections/` com 23 arquivos: 11 HTML (`barra`, `hero`, `manifesto`, `modalidades`, `estrutura`, `planos`, `horarios`, `depoimentos`, `duvidas`, `contato`, `rodape`) e 12 CSS (os mesmos nomes e `botao.css`); `src/styles/` com `site.css`, `tokens.css`, `base.css` e `fontes.css`; `public/marca.svg`; e `public/fotos/` com `salao.webp`, `peso-livre.webp` e `tatame.webp`.
- **CSS numa folha só, por `<link>`**: o `arquivos/index.html` já traz no `<head>` o script que escolhe o tema e pinta a cor de fundo, a trava dos textos que entram por marco (que só esconde com o JS no ar e cai sozinha em 4 s se ele não subir) e, depois, `<link rel="stylesheet" href="/src/styles/site.css">` (as fontes, os tokens e as seções por `@import`). Mantenha assim e nunca importe CSS pelo JS: no dev do Vite ele chega depois dos módulos e a página aparece crua por um instante a cada recarregamento.
- **A fonte do "L"**: `src/styles/fontes.css` aponta para o arquivo da Big Shoulders dentro de `node_modules/` (`../../node_modules/@fontsource-variable/big-shoulders/files/big-shoulders-latin-wght-normal.woff2`). O caminho só existe depois do `npm install`; se o build reclamar dele, confira que o pacote `@fontsource-variable/big-shoulders` foi instalado na versão acima.
- **O motor da peça** (`src/gl/`): `formas.js` tem as sete formas e a recartilha, em GLSL; `peca.js` desenha (o shader, o estúdio no reflexo, a borda lisa) e traz as contas de rotação; `poses.js` guarda o ângulo de descanso de cada forma. `src/motion/percurso.js` leva a peça de vaga em vaga. Leia o cabeçalho de cada módulo antes de mexer; o mapa está no guia.
- `arquivos/conceito/` e `arquivos/receitas/` não entram no site; `arquivos/fonte/` só serve para converter fotos novas (ver o guia).
- No fim:
  - `npm run build` passa sem erro e sem aviso;
  - os servidores das conferências (`npx vite preview` e o `python3 -m http.server` da subpasta) rodam em segundo plano ou num outro terminal, porque ficam no ar enquanto você confere; no fim, derrube os dois (Ctrl+C no terminal deles, ou encerre o processo);
  - `npx vite preview` abre o site e a abertura roda inteira: as duas linhas do título sobem e a anilha entra rolando até o lugar do "O"; o console fica limpo (sem erro e sem aviso) e recarregar nunca mostra a página sem estilo;
  - rolando devagar e depressa: a anilha sai do título e vira a capitular do manifesto; nas modalidades, o número e o nome trocam e a peça vira halter, kettlebell e saco de pancada, sem ficar parada numa forma pela metade; depois bola, cadeado, cronômetro, kettlebell, halter e, no rodapé, a anilha no "O" de KILO; em repouso, a peça nunca cobre texto corrido nem campo de formulário (só o começo do nome gigante da modalidade, de propósito);
  - com o mouse e o teclado: a peça se inclina para o cursor; os botões enchem de baixo para cima; "Anterior" e "Próxima" andam um passo; os dias da grade trocam por clique e pelas setas; as perguntas abrem e fecham com a altura animada; o pedido mostra o erro nos dois campos vazios, aceita nome e WhatsApp e termina em "Pedido anotado"; Tab mostra o foco em tudo o que é clicável;
  - nada rola para o lado no celular (390 × 844, e também nas telas baixas, 393 × 659 e 375 × 553): o título do hero em três linhas com a anilha no "O", a cena das modalidades em coluna (linha gigante, peça, texto, itens, botões), os planos num trilho que rola de lado, a peça pequena ao lado do título de cada seção;
  - os acentos e a cedilha dos títulos aparecem inteiros ("TRÊS", "É", "FORÇA"): a máscara por onde a linha sobe tem folga em cima e embaixo, não a tire;
  - o `dist/` sobe em qualquer hospedagem estática, inclusive numa subpasta. Confira com um servidor estático de verdade, não com o `vite preview` (ele devolve o `index.html` para qualquer caminho e esconde arquivo faltando): crie uma pasta de teste ao lado da pasta do projeto (`mkdir ../teste-subpasta`), copie o `dist/` para dentro dela com o nome `kilo/` (`cp -R dist ../teste-subpasta/kilo`), rode `python3 -m http.server 8765 --directory ../teste-subpasta` (ou outra porta, se essa estiver ocupada), abra `http://localhost:8765/kilo/` e confira o console sem nenhum 404, as três fotos e a peça na página. Depois derrube o servidor e apague a pasta de teste;
  - as conferências de tela (abertura, rolagem, mouse e teclado, celular) pedem um navegador. Se você não tiver como ver a página, abra o site para a pessoa e confira com ela, item por item, em vez de dar por conferido.
