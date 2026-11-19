// Converte as três fotos da seção Estrutura para o formato que a página usa: WebP quadrado de 1000 px.
// A página mostra as fotos em preto e branco (filtro no CSS): mande a foto colorida mesmo.
//
// uso, da raiz do projeto (uma vez antes: npm install -D -E sharp@0.35.5):
//   node arquivos/fonte/fotos.mjs <foto do salão> <foto do peso livre> <foto do tatame>
// Para trocar só uma, passe "-" no lugar das outras:  node arquivos/fonte/fotos.mjs - minha-foto.jpg -
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const NOMES = ['salao', 'peso-livre', 'tatame'];
const fotos = process.argv.slice(2);
if (!fotos.length) {
  console.log('uso: node arquivos/fonte/fotos.mjs <salão> <peso livre> <tatame>   ("-" pula uma foto)');
  process.exit(2);
}
mkdirSync('public/fotos', { recursive: true });
for (const [i, caminho] of fotos.slice(0, 3).entries()) {
  if (caminho === '-') continue;
  // o recorte quadrado procura a parte mais interessante da foto (gente, contraste), não só o meio
  const info = await sharp(caminho).rotate().resize(1000, 1000, { fit: 'cover', position: 'attention' }).webp({ quality: 76 }).toFile(`public/fotos/${NOMES[i]}.webp`);
  console.log(`public/fotos/${NOMES[i]}.webp  ${Math.round(info.size / 1024)} kB`);
}
