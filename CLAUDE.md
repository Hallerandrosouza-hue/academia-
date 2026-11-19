# Guia do projeto — Kilo

(Salve como `CLAUDE.md` na raiz do projeto se você usa o Claude Code, ou como `AGENTS.md` se usa o Codex, o Cursor ou outro agente. O conteúdo é o mesmo.)

Landing page da Kilo, uma academia fictícia de musculação, cross e lutas. Vite sem framework, Lenis, fontes Big Shoulders Stencil e Geist, e nenhuma biblioteca de 3D. **Uma peça só, de borracha preta e brilhante, desenhada ao vivo por um shader próprio, é o "O" do título do hero, acompanha a página inteira e toma a forma do equipamento de cada seção, até pousar no "O" do nome no rodapé.** O código já vem pronto em `arquivos/src/`, a página no `arquivos/index.html` e a marca e as fotos em `arquivos/public/`: o trabalho é montar, conferir e, depois, personalizar. A régua é site de premiação: a peça e o jeito como ela se mexe são o produto. Se algo parece "ok", ainda não está pronto.

## Arquitetura
- **Uma seção por arquivo.** O `index.html` só tem o `<head>`, a ordem das seções (`<!-- @secao hero -->` etc.) e o `<canvas class="peca">`; o plugin `secoes` do `vite.config.js` troca cada marca pelo `src/sections/<nome>.html` no dev e no build. Os textos estão nesses HTML; cada seção tem a sua folha `src/sections/<nome>.css`. A grade de aulas e o WhatsApp ficam em `src/config.js`.
- **O CSS é uma folha só**, `src/styles/site.css` (por `@import`: as fontes, `fontes.css`, `tokens.css`, `base.css`, `botao.css` e uma folha por seção), ligada por `<link>` no `<head>`. Antes dela, inline: o script que lê `?tema=` e pinta a cor de fundo, e a trava `.js .marco, .js .sobe { opacity: 0 }` (os textos que entram por marco só se escondem com o JS no ar; a trava cai sozinha em 4 s se ele não subir). Nunca importe CSS pelo JS: no dev do Vite ele chega depois dos módulos e a página pinta crua por um instante a cada recarregamento.
- **Módulos** (cada um explica o que faz no cabeçalho):

  | arquivo | o que faz |
  |---|---|
  | `src/main.js` | liga tudo e roda o único laço de quadros: a rolagem suave anda, e o manifesto, a cena das modalidades e a peça leem a mesma posição. Cria a peça antes de esperar as fontes; sem WebGL2, põe `.sem-peca` no `<html>` |
  | `src/config.js` | o WhatsApp que recebe o pedido e a grade de aulas de cada dia |
  | `src/gl/formas.js` | as sete formas da peça e a recartilha, como funções de distância em GLSL; a lista `FORMAS` dá o nome de cada uma |
  | `src/gl/peca.js` | o desenho: o shader (traçado de raios, estúdio no reflexo, oclusão, borda lisa, luz de fundo), o canvas e as contas de rotação (`quat`) |
  | `src/gl/poses.js` | o ângulo de descanso de cada forma |
  | `src/motion/percurso.js` | leva a peça de vaga em vaga: mede as vagas, calcula posição e tamanho pela rolagem, e conduz por tempo a troca de forma, a pose, a volta, a inclinação pelo mouse e a entrada rolando |
  | `src/motion/modalidades.js` | a cena presa: troca de passo por marcos da rolagem, botões Anterior e Próxima |
  | `src/motion/manifesto.js`, `marcos.js` | as palavras que acendem com a rolagem; os textos e títulos que entram por tempo quando chegam à tela |
  | `src/motion/horarios.js`, `duvidas.js`, `contato.js` | as abas da grade, a sanfona das dúvidas, o pedido (máscara, erros, mensagem do WhatsApp) |
  | `src/motion/smooth.js`, `guia.js`, `rolando.js`, `scrollbar.js` | o Lenis (só roda e trackpad; toque nativo), o teto de velocidade da roda, o hover que descansa enquanto a página rola, a barra de rolagem própria |
  | `src/motion/barra.js`, `ancoras.js` | a barra do topo (o fundo fora do hero, o link da seção atual) e os links de âncora |
- **As vagas** (não apague): cada seção tem um `<span class="vaga" data-vaga="nome" data-forma="...">`. É o lugar onde a peça pousa e a forma que ela toma ali; o tamanho e a posição vêm do CSS da vaga (`.vaga--o`, `.vaga--mod`, `.vaga--planos`…). Atributos: `data-pose="x y z"` (ângulo de descanso, em graus), `data-voo="0.6 1"` (o trecho, entre esta vaga e a seguinte, em que a peça voa; o padrão é de 0,16 a 0,84), e, na cena presa, `data-formas="halter kettlebell saco"` com `data-preso` (um passo por forma; o palco preso leva `data-palco`). Vaga com largura zero é pulada.
- **Página de trabalho**: `laboratorio.html` (fora do build) mostra todas as formas lado a lado; `?forma=2` mostra uma só, grande; `?mix=0,2,0.5` mostra a troca parada no meio; `?gx=20&gy=-30` fixa o giro; `?fundo=f01810` troca o fundo.
- **Parâmetro de URL**: `?tema=mono`, `osso`, `brasa` ou `cobalto` prova as outras paletas.

## Design system
- **Cores em papéis** (`tokens.css`): `--fundo` `#070707`, `--cartao`, `--tinta` `#f2f0ea`, `--apoio` (texto secundário), `--fio` (linhas finas), `--acento` `#d7ff3d` com `--sobre-acento`, `--destaque` e `--sobre-destaque` (o cartão invertido do plano do meio). A peça lê as dela daqui: `--peca` (a borracha), `--peca-luz` (as caixas de luz), `--peca-contra` (a contraluz) e `--peca-halo` (a luz no fundo atrás dela; 0 desliga, e é o que destaca a peça preta do fundo preto). Cada tema é um bloco `html[data-tema='nome']` que troca esses papéis.
- **Tipos**: Big Shoulders Stencil (`--f-display`: títulos em 800–900, caixa alta) e Geist (`--f-texto`). A família `'Big Shoulders L'` (`fontes.css`) responde só pela letra L, com a versão sem corte. Rótulos em 13 px, caixa alta, espaçados.
- **Escala**: as seções usam `--su` (1 px até 1280 de largura, encolhe abaixo, nunca cresce): título de seção 64 px (40 no celular; 80 no contato), corpo 16–18, conteúdo até 1200 px. O hero, a cena das modalidades e o nome do rodapé usam `--u` (acompanha a tela) ou `vw`: são as cenas da página, as letras ficam gigantes de propósito.
- **Botões** (`botao.css`): retos, 52 px; no hover e no foco, a cor sobe de baixo (`::before` em `translateY`) e a seta anda. Variantes: `--cheio` (acento), `--linha`, `--largo`. `.elo` é o link de texto com seta.
- **Máscara dos títulos** (`.mascara` > `.sobe`, em `base.css`): a linha sobe por trás de uma máscara que tem folga em cima e embaixo. A folga existe para os acentos ("Ê", "É") e para a cedilha e a perna do Q: sem ela, a máscara corta a letra.

## A peça 3D: o que não quebra
- **Ela é uma função, não um modelo.** Cada forma devolve a distância de um ponto até a superfície; trocar de forma é misturar as distâncias. Não troque por um `.glb`, por uma imagem nem por um SVG: a troca de forma deixa de existir.
- **Toda forma cabe numa esfera de raio ~1** (o shader só traça raios dentro de uma esfera de raio 1,3: o que passar disso é cortado) e nasce de frente para a câmera (eixo z). A vaga define o tamanho: o raio 1 da forma vira metade do menor lado da vaga.
- **O canvas fica por cima da página e não pega clique** (`pointer-events: none`), abaixo da barra do topo. Em repouso, a peça não cobre texto corrido nem campo de formulário; a exceção de propósito é o começo do nome gigante da modalidade. Se um texto novo ficar embaixo dela, mude a vaga (posição ou tamanho no CSS), não o texto.
- **Posição pela rolagem, forma por tempo.** Onde a peça está é uma conta sobre a posição da rolagem (rolar depressa só passa o mesmo voo mais rápido). A forma, a pose, a volta e a inclinação pelo mouse correm por tempo, com mola: ela nunca fica parada numa forma pela metade. A duração da troca fica no alto de `percurso.js` (`TROCA_VOO`, 1,5 s, e `TROCA_PRESA`, 1,2 s); a volta, a pose e o balanço da borracha esticam junto. Não encurte: troca rápida no meio de um voo, com a peça andando e crescendo, parece um tranco.
- **A mesma borracha em todas as seções.** Uma cor e um material do começo ao fim; o que muda é a forma.
- **Desempenho**: só o quadrado em volta da peça é desenhado; DPR no máximo 2; se o aparelho não acompanha (quadros acima de 24 ms), a peça passa a ser desenhada em menos pixels, sozinha (`definirQualidade`). A recartilha some quando a peça fica pequena e de raspão, para não virar chuvisco.
- **A luz de fundo** (o halo) sai do shader como branco com alfa, nunca como soma com alfa zero: no Safari, a soma estoura as cores quando passa sobre um cartão claro.

## Regras de movimento
- **Peça por rolagem, texto por marco.** Os textos entram uma vez só, por tempo, quando chegam à tela (`.marco`, `.sobe`); nunca escorregam com a rolagem. Na cena presa, a rolagem só decide o passo; a troca do número, do nome e dos textos é por tempo.
- **A abertura não trava nada**: as linhas sobem e a anilha entra rolando em 1,5 s; a rolagem funciona desde o primeiro instante.
- **Rolagem**: Lenis com teto de ~2 telas por segundo na roda (`guia.js`). Nada de parada que engole o gesto, nada de scroll-snap (no trilho dos planos, no celular, ele prendia o gesto vertical).
- **Giro calmo**: a peça só balança devagar; a única volta inteira é a de cada troca de forma, e ela morre sozinha. Não ponha a peça para girar sem parar.
- `prefers-reduced-motion`: sem Lenis, sem abertura, sem volta e sem balanço; a peça continua indo de vaga em vaga e trocando de forma.

## Celular: regras que não se quebram
- **Nunca rolar para o lado**, em nenhum momento. Se algo vazar, conserte a origem; `overflow-x: clip` no `html` e no `body` é só a rede de segurança (`clip`, não `hidden`). O único trilho lateral é o dos planos, dentro do contêiner dele.
- **O canvas fica em `100lvh`** e a altura da tela só é lida de novo quando a largura muda: a barra do navegador sumindo e voltando não mexe na peça no meio da rolagem. Nada de `100vh` nem `dvh` nas seções; o hero e o palco das modalidades usam `100svh`.
- **No toque, a rolagem é a do aparelho** (o Lenis não conduz o dedo) e os links de âncora usam a rolagem nativa. Nunca cancele o `touchend`.
- Composição própria: o título do hero em três linhas (MAIS / UM / QUIL + a anilha); a cena das modalidades em coluna (linha gigante, peça, texto, três itens, botões; nas telas baixas os itens somem para os botões caberem); a peça pequena no canto direito do título de cada seção; os planos num trilho; do contato ao rodapé a peça só levanta voo no fim (`data-voo`), para não passar por cima do formulário.
- Hover só com mouse (`@media (hover: hover)` e nunca enquanto rola). Alvos de toque de 40 px ou mais; campos com fonte de 16 px ou mais (abaixo disso o iPhone dá zoom).
- Conferir em 390 × 844, 393 × 659 e 375 × 553.

## Como checar
- `npm run build` sem erro e sem aviso.
- `npx vite preview`: as linhas do título sobem e a anilha entra rolando até o "O"; recarregar nunca mostra a página crua; console limpo.
- Rolando de cima a baixo, devagar e depressa: cada momento do prompt acontece; a peça nunca cobre texto em repouso; nenhum título aparece com acento ou cedilha cortados.
- Mouse e teclado: a peça se inclina para o cursor; botões, abas da grade (clique e setas), sanfona, formulário (erro, preenchido, enviado), Tab em tudo.
- Celular nos três tamanhos e o `dist/` numa subpasta, com um servidor estático de verdade (o prompt diz como): sem 404.

## Personalizar

Vale para qualquer mudança, agora ou depois.

### As três perguntas
1. É a demo, a academia da pessoa, ou peças soltas?
2. Que material ela já tem (nome, logo, cor, modalidades, planos e preços, grade de aulas, números da casa, depoimentos, perguntas, endereço, WhatsApp, fotos do espaço) e o que falta?
3. O que ela quer manter da demo (a peça no lugar de uma letra do título, as formas, a cena presa das modalidades, o nome gigante no rodapé)?

### O que muda e onde

| o quê | onde | precisa de material novo? |
|---|---|---|
| Nome da marca | `barra.html` (as letras e o anel), `rodape.html` (o nome gigante e o ©), `manifesto.html`, o `<title>` e a `description` do `index.html`, `public/marca.svg` | não. O nome gigante do rodapé se ajusta pela `font-size` em `rodape.css` (46,4vw serve a "KIL" + a peça): com outro nome, diminua até caber de ponta a ponta |
| Onde a peça entra no nome | a vaga (`.vaga--o` no hero, `.vaga--rodape` no rodapé) fica no lugar da letra que ela substitui | não. Nome sem "O": ponha a vaga no lugar de outra letra redonda, ou antes ou depois da palavra, como um ponto. O texto para leitor de tela fica no `<span class="so-leitor">` |
| Título e textos do hero | `hero.html` | não. O título tem duas linhas (uma por `.mascara`); a primeira se espalha de ponta a ponta (um `<span>` por palavra). Se a frase mudar de tamanho, ajuste a `font-size` do `.hero__titulo` em `hero.css` (computador e celular) |
| Manifesto | `manifesto.html` (o texto depois da vaga) | não. As palavras acendem sozinhas |
| Modalidades | `modalidades.html`: para cada passo, o número e o nome gigantes, o `<article class="mod__passo">` e a `<ul class="mod__lista">`, sempre na mesma ordem; a forma de cada passo em `data-formas` da vaga | não. Nome gigante curto (até 6 letras) para caber ao lado da peça. Com mais ou menos passos, troque o `3` da altura em `.mod` (`modalidades.css`) pelo número de passos |
| Fotos e números | `estrutura.html` e `public/fotos/` | três fotos da academia (`arquivos/receitas/LEIA.md`) |
| Planos | `planos.html` (nome, preço, frase, itens, botão; o do meio leva `plano--destaque` e o selo) | os preços dela; sem eles, `[preencher]` |
| Grade de aulas | `src/config.js` (`grade`: hora, aula, professor e sala, duração, por dia) | a grade dela |
| Depoimentos | `depoimentos.html` | falas de alunos de verdade, com autorização; sem elas, `[preencher]` |
| Dúvidas | `duvidas.html` (um `<details class="duvida">` por pergunta) | não |
| Pedido e WhatsApp | `src/config.js` (`whatsapp`: só números, com 55 e o DDD) e as opções em `contato.html` | o número dela. Vazio, o formulário só mostra "Pedido anotado" e não manda nada |
| Rodapé | `rodape.html` (endereço, horário, links do WhatsApp e das redes) | os dados dela |
| Cores | `tokens.css` (os papéis; ou comece por um dos temas) e o `theme-color` e a lista `FUNDOS` do script do `index.html` | não. Fundo claro ou colorido: `--peca-halo: 0` (a peça preta já se destaca sozinha) |
| Fontes | os `@import` de `site.css`, `fontes.css` e `--f-display`, `--f-texto` em `tokens.css` | não. Outra display muda a largura das letras: confira o hero, a linha gigante das modalidades e o rodapé nos dois tamanhos. Se a nova fonte não for estêncil, apague `fontes.css` e a família `'Big Shoulders L'` |
| Formas da peça | `src/gl/formas.js` (ver abaixo), `src/gl/poses.js` e o `data-forma` de cada vaga | não: é código |

### Trocar ou criar uma forma da peça
A peça serve a qualquer negócio: as formas é que são de academia. Para outro nicho (ou outro equipamento), escreva formas novas.
1. Em `src/gl/formas.js`, escreva uma função `float nome(vec3 p)` que devolve a distância do ponto até a superfície, com as peças prontas do arquivo (`caixa3`, `cil`, `capsula`, `arco`, toro por `length(vec2(length(p.xy) - R, p.z)) - r`) unidas por `smin` (união com emenda macia) e cortadas por `smax`. A forma tem de caber numa esfera de raio 1 e ficar de frente para o eixo z.
2. Ligue a função em `forma()` com o próximo número, ponha o nome no fim da lista `FORMAS` (a ordem da lista é o número) e uma pose em `poses.js`, na mesma posição. Relevo é opcional (`relevoDe`).
3. Veja em `laboratorio.html?forma=N` e ajuste as medidas olhando; depois veja a troca com as vizinhas em `?mix=A,B,0.5`.
4. Use o nome no `data-forma` (ou `data-formas`) da vaga.
Formas simples e gordas leem melhor que formas cheias de detalhe: a peça costuma ter de 100 a 500 px. Mantenha as distâncias honestas (some e corte formas, não estique o espaço com multiplicações grandes), senão a superfície aparece com buracos.

### Material da pessoa
- **A peça não precisa de material**: é código. Não troque por vídeo, imagem nem modelo.
- **As três fotos da estrutura** são o único material visual: fotos da academia dela, convertidas com `node arquivos/fonte/fotos.mjs <salão> <peso livre> <tatame>` (uma vez antes: `npm install -D -E sharp@0.35.5`). A página mostra em preto e branco (filtro em `estrutura.css`). Sem fotos, a seção funciona só com os números: apague o bloco `.estrutura__fotos`.

### Regras ao trocar
- Nada de dado inventado como se fosse da pessoa: preços, números da casa, nomes e falas de alunos, horários, endereço e contatos que ela não mandou ficam `[preencher]` (nunca no título do hero). Depoimento só com autorização do aluno.
- Mantenha o que dá o efeito: as vagas, a peça no lugar de uma letra, uma forma por seção com um porquê (o cadeado aberto dos planos é "sem fidelidade", o cronômetro é a grade), a folga das máscaras, o texto por marco, a posição pela rolagem.
- Depois de mexer em texto ou em tamanho, role a página inteira no computador e no celular: em repouso a peça não pode cobrir texto. Se cobrir, mude a vaga.
- Nenhuma cidade ou estado na demo; no site da pessoa, use os dados dela.
- Termine com a lista do que ainda é da demo: nome e marca, frase do hero, manifesto, modalidades, fotos, números, planos e preços, grade de aulas, depoimentos, dúvidas, WhatsApp, endereço e redes.
