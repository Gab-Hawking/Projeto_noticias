# NewsFilter — Notícias Inteligentes

Interface web moderna e minimalista para buscar notícias filtradas por **região**, **período** e **assunto**, exibindo resultados em cards elegantes e responsivos.

## Funcionalidades

- **24 regiões** — países individuais e macro-regiões (América do Sul, Europa, Oriente Médio, etc.)
- **5 períodos** — hoje, esta semana, este mês, este trimestre, este ano
- **11 categorias** — política, economia, IA, tecnologia, saúde, clima, ciência, esportes, entretenimento, crime e mais
- **Cards visuais** com imagem, título, subtítulo, fonte, data e badges de região/assunto
- **Modo demonstração** — funciona sem chave de API
- **Responsivo** — desktop (3-4 colunas), tablet (2 colunas), mobile (1 coluna)
- **Loading skeleton** animado durante as buscas

## Como usar

### 1. Abrir diretamente no navegador

```
Abra o arquivo index.html no seu navegador.
```

### 2. Obter uma chave de API gratuita

O app usa a [GNews API](https://gnews.io):
1. Acesse **gnews.io** e crie uma conta gratuita
2. Copie sua chave de API no painel
3. No app, clique em **"Configurar API"** no cabeçalho
4. Cole a chave e clique em **Salvar**

O plano gratuito oferece **100 requisições/dia** e até 10 artigos por busca.

### 3. Modo demonstração

Sem chave de API, clique em **"Usar modo demo"** para explorar a interface com 12 artigos de exemplo.

## Estrutura

```
Projeto_noticias/
├── index.html      # Estrutura HTML
├── styles.css      # Estilos completos
├── app.js          # Lógica, filtros e integração com API
└── README.md
```

## Tecnologias

- HTML5 semântico
- CSS3 puro (variáveis, Grid, Flexbox, animações)
- JavaScript vanilla (ES2020+)
- [GNews API](https://gnews.io) — fonte de notícias em tempo real
- [Google Fonts — Inter](https://fonts.google.com/specimen/Inter)
