Projeto: Componente Aulas (web component)
Arquivos incluídos:
- index.html                -> página de exemplo que usa o componente
- aulas.json                -> arquivo de dados (lista de aulas)
- styles_componente.css     -> estilos aplicados dentro do shadow DOM do componente
- script_componente.js      -> web component + lógica para cor dinâmica da nota

Melhoria implementada:
- O chip '.lable-nota' tem agora cor dinâmica conforme a nota:
    nota < 6  -> vermelho
    6 <= nota < 8 -> laranja
    nota >= 8 -> verde

Como testar:
1) Extraia os arquivos e abra 'index.html' em um navegador (arraste o arquivo para o navegador ou abra via servidor local).
2) O componente busca 'aulas.json' via fetch. Se abrir o arquivo local diretamente (file://) alguns navegadores podem bloquear fetch; nesse caso execute um servidor simples:
   - Python 3: `python -m http.server 8000` dentro da pasta do projeto e acesse http://localhost:8000
3) Para mudar o "hoje", edite a variável `this.hoje = "ter";` em 'script_componente.js' para outro dia curto (e.g. 'seg', 'qua') e atualize.

Observação:
- Mantive a estrutura de uso do shadow DOM para encapsular estilos.
- As cores podem ser ajustadas em script_componente.js se preferir outras tonalidades.
