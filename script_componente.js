class AulasComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // valor de hoje (pode ser 'seg','ter','qua','qui','sex','sab','dom')
    this.hoje = "ter";
  }

  connectedCallback() {
    this.loadData();
  }

  async loadData() {
    try {
      // 1) tentar ler JSON embutido no HTML
      const embedded = document.getElementById('aulas-json');
      if (embedded && embedded.textContent.trim()) {
        const aulas = JSON.parse(embedded.textContent);
        this.render(aulas);
        return;
      }

      // 2) tentar variável global (opcional)
      if (window.AULAS && Array.isArray(window.AULAS)) {
        this.render(window.AULAS);
        return;
      }

      // 3) fallback para fetch (funciona quando estiver rodando por servidor)
      const response = await fetch('aulas.json');
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const aulas = await response.json();
      this.render(aulas);
    } catch (error) {
      console.error('Erro ao carregar os dados das aulas:', error);
      this.shadowRoot.innerHTML = `<div style="color:#900">Erro ao carregar dados. Veja o console.</div>`;
    }
  }


  /* retorna a cor de fundo para o chip de nota conforme a regra:
     nota < 6 -> vermelho
     6 <= nota < 8 -> laranja
     nota >= 8 -> verde
  */
  notaColor(notaRaw) {
    const n = Number(String(notaRaw).replace(',', '.')) || 0;
    if (n < 6) return '#e74c3c';       // vermelho
    if (n < 8) return '#f39c12';       // laranja
    return '#2ecc71';                  // verde
  }

  render(aulas) {
    const aulasDia = aulas.filter(a => a.data === this.hoje);

    // link externo de CSS (shadow DOM)
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'styles_componente.css';
    this.shadowRoot.appendChild(link);

    const container = document.createElement('div');
    container.className = 'wrapper';

    // monta o HTML de cada aula
    const html = aulasDia.map(a => {
      const provaDisplay = a.prova_alert ? '' : 'display: none;';
      const notaBg = this.notaColor(a.nota);
      // aplicar cor dinamicamente no label .lable-nota via style inline
      return `
        <article class="card comp-aula" data-id="${a.id}">
          <div class="titulo_aula">${a.disciplina}</div>
          <p class="p">Local e Horário: <b>${a.local} - ${a.horario}</b></p>
          <div class="lables">
            <div class="lable-frequencia p_lable">FALTAS: <b>${a.frequencia}</b></div>
            <!-- exemplo: nota alta usando classe que altera a variável --nota -->
            <div class="lable-nota p_lable" style="background-color: ${notaBg};">CR: <b>${a.nota}</b></div>
          </div>
        </article>
      `;
    }).join('');

    container.innerHTML = html || '<div style="color:#666">Nenhuma aula encontrada para hoje.</div>';
    this.shadowRoot.appendChild(container);
  }
}

customElements.define('aulas-component', AulasComponent);
