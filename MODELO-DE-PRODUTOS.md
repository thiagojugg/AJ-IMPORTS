# Modelo de cadastro de produtos — AJ IMPORTS

O card da vitrine e a página individual são gerados automaticamente pelo site. Para adicionar um produto, copie o objeto de `data/modelo-produto.json` e cole como um novo item dentro do array de `data/products.json`, separando os itens com vírgula.

## Campos
- `id`: identificador único, sem espaços (ex.: `camiseta-preta-aj`).
- `name`: nome exibido no card e na página.
- `category`: categoria exibida no card.
- `price`: preço numérico em reais (ex.: `129.90`).
- `createdAt`: data/hora ISO; produtos mais recentes aparecem primeiro.
- `description`: descrição na página individual.
- `image`: imagem principal do card.
- `images`: imagens da galeria geral.
- `variants`: cada opção de cor/modelo e suas imagens.
- `sizes`: tamanhos disponíveis.
- `hasSizes`: use `false` para ocultar a seleção de tamanho; `true` para exibi-la.
- `tags`: palavras-chave para pesquisa e identificação.

## Imagens
Envie as imagens para a pasta `assets/` e use o caminho relativo, por exemplo `assets/nome-da-foto.jpeg`. Confira a grafia e a extensão do arquivo.

## Observações
- Mantenha o produto dentro do array JSON e valide vírgulas e aspas.
- Para um produto com uma única opção, mantenha apenas uma entrada em `variants`.
- Para produtos sem tamanhos, defina `"hasSizes": false`.
- O layout dos cards e da página individual permanece padronizado; não é necessário criar um HTML novo para cada produto.
