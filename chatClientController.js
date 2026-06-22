class ChatClientController {
  AREA_PARTNER_URL_PRODUCTION = "https://areapartner.softcomsistemas.com.br/";
  AREA_PARTNER_URL_ALTERNATIVE =
    "http://177.43.232.2:25123/area-partner/public/";

  AREA_PARTNER_BASE_URL = this.AREA_PARTNER_URL_PRODUCTION;

  buttonPreferences = {
    "toggle-btn-ocorrencia": true,
    "toggle-btn-ocorrencia-finalizada": true,
    "toggle-btn-ver-cliente": true,
    "toggle-btn-ver-prospectado": true,
  };

  iconImgElement;
  btnOcorrencia;
  btnVerCliente;
  btnOCFinalizada;
  btnVerProspectado;

  constructor({
    headerIdentifier,
    clientNameIdentifier,
    clientPhoneIdentifier,
    clientObservationsIdentifier,
    darkModeClass,
  }) {
    this.headerIdentifier = headerIdentifier;
    this.clientNameIdentifier = clientNameIdentifier;
    this.clientPhoneIdentifier = clientPhoneIdentifier;
    this.clientObservationsIdentifier = clientObservationsIdentifier;
    this.darkModeClass = darkModeClass;
  }

  init() {
    this.createIconImgElement();
    this.loadAreaPartnerUrlFromStorage();
    this.observeDarkModeChanges();
    this.createButtonElements();
    this.loadButtonPreferences();
    this.injectIntoHeader();
  }

  loadAreaPartnerUrlFromStorage() {
    // Carregar URL da Area Partner do storage
    chrome.storage.sync.get(["area-partner-use-alternative"], (result) => {
      const useAlternative = result["area-partner-use-alternative"] || false;
      this.AREA_PARTNER_BASE_URL = useAlternative
        ? this.AREA_PARTNER_URL_ALTERNATIVE
        : this.AREA_PARTNER_URL_PRODUCTION;

      // Atualizar href do ícone
      this.iconImgElement.href = this.AREA_PARTNER_BASE_URL;
    });
  }

  createIconImgElement() {
    this.iconImgElement = document.createElement("a");
    this.iconImgElement.id = "softcom-header-icon";
    this.iconImgElement.href = this.AREA_PARTNER_BASE_URL;
    this.iconImgElement.target = "_blank";
    this.iconImgElement.rel = "noopener noreferrer";
    this.iconImgElement.style.cssText = `
      margin-left: 5px;
      margin-right: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
    `;

    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("icon.png");
    img.alt = "Softcom Extensão";
    img.style.cssText = `
      width: 32px;
      height: 32px;
    `;
    this.iconImgElement.appendChild(img);
  }

  captureClientName() {
    const nameElement = getHTMLElement(this.clientNameIdentifier);
    if (!nameElement) {
      alert("Nome do cliente: elemento HTML não encontrado.");
      return null;
    }
    return nameElement.innerText.trim().replace(/\p{Emoji}/gu, ""); //remove emojis
  }

  captureClientCode() {
    const observacoesElement = getHTMLElement(
      this.clientObservationsIdentifier,
    );

    if (!observacoesElement) {
      alert("Observações: elemento HTML não encontrado.");
      return null;
    }

    const text = observacoesElement.value.trim();
    if (text.includes("\n")) {
      const lines = text.split("\n");
      const defaultChoice = "1";
      const choice = prompt(
        "Foram encontradas múltiplas linhas nas observações. Insira o número da linha que contém o código do cliente:\n" +
          lines.map((line, index) => `${index + 1}: ${line}`).join("\n"),
        defaultChoice,
      );
      if (choice !== null) {
        const lineNumber = parseInt(choice, 10);
        if (
          !isNaN(lineNumber) &&
          lineNumber > 0 &&
          lineNumber <= lines.length
        ) {
          return lines[lineNumber - 1].trim();
        } else {
          alert("Número de linha inválido.");
          return null;
        }
      } else {
        return null;
      }
    }

    return text;
  }

  captureClientPhone() {
    const phoneElement = getHTMLElement(this.clientPhoneIdentifier);
    if (!phoneElement) {
      alert("Telefone do cliente: elemento HTML não encontrado.");
      return null;
    }
    return phoneElement.innerHTML.trim();
  }

  captureCurrentClientInfo() {
    const client = {
      name: this.captureClientName(),
      code: this.captureClientCode(),
      phone: this.captureClientPhone(),
    };
    return client;
  }

  createButtonElements() {
    this.btnOcorrencia = createAnchorButton(
      "softcom-ocorrencia-btn",
      "Criar OC.",
      journalPlusSVG,
    );

    this.btnVerCliente = createAnchorButton(
      "softcom-ver-cliente-btn",
      "Ver Cliente",
      pencilSVG,
    );

    this.btnVerProspectado = createAnchorButton(
      "softcom-ver-prospectado-btn",
      "Ver Prospectado",
      pencilSVG,
    );
    this.addEventListenersToButtons();
  }

  addEventListenersToButtons() {
    this.btnOcorrencia.addEventListener("click", () => {
      const currentClientInfo = this.captureCurrentClientInfo();
      if (currentClientInfo.code === "") {
        this.btnOcorrencia.href = `${this.AREA_PARTNER_BASE_URL}cliente/index?&nome_cliente=${currentClientInfo.name}`;
        alert(
          "Código do cliente não encontrado. Insira o código nas observações.",
        );
        return;
      }
      this.btnOcorrencia.href = `${this.AREA_PARTNER_BASE_URL}agenda/form/id/${
        currentClientInfo.code
      }?name=${encodeURIComponent(currentClientInfo.name)}&assunto=TEC REMOTO`;
    });

    this.btnVerCliente.addEventListener("click", () => {
      const currentClientInfo = this.captureCurrentClientInfo();
      if (currentClientInfo.code === "") {
        this.btnVerCliente.href = `${this.AREA_PARTNER_BASE_URL}cliente/index?&nome_cliente=${currentClientInfo.name}`;
        alert(
          "Código do cliente não encontrado. Insira o código nas observações.",
        );
        return;
      }
      const url = `${this.AREA_PARTNER_BASE_URL}cliente/index/detail/id/${currentClientInfo.code}`;
      this.btnVerCliente.href = url;
    });

    this.btnVerProspectado.addEventListener("click", () => {
      const currentClientInfo = this.captureCurrentClientInfo();
      if (currentClientInfo.code === "") {
        this.btnVerProspectado.href = `${this.AREA_PARTNER_BASE_URL}comercial/prospectado?&nome_do_cliente=${currentClientInfo.name}`;
        alert(
          "Código do prospectado não encontrado. Insira o código nas observações.",
        );
        return;
      }
      const url = `${this.AREA_PARTNER_BASE_URL}comercial/prospectado/form/table/prospectado/id/${currentClientInfo.code}`;
      this.btnVerProspectado.href = url;
    });
  }

  isDarkModeActive() {
    const target = document.body || document.documentElement;
    if (!target) return false;
    return target.classList.contains(this.darkModeClass);
  }
  applyStyleMode() {
    const isDarkMode = this.isDarkModeActive();
    this.btnOcorrencia.classList.toggle("dark-mode", isDarkMode);
    this.btnVerCliente.classList.toggle("dark-mode", isDarkMode);
    this.btnVerProspectado.classList.toggle("dark-mode", isDarkMode);
  }

  // Observer para monitorar mudanças no modo escuro
  observeDarkModeChanges() {
    const bodyElement = document.body || document.documentElement;
    const observer = new MutationObserver(() => {
      this.applyStyleMode();
    });

    observer.observe(bodyElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  async loadButtonPreferences() {
    chrome.storage.sync.get(
      Object.keys(this.buttonPreferences),
      async (result) => {
        Object.keys(this.buttonPreferences).forEach((key) => {
          this.buttonPreferences[key] = result[key] !== false;
        });
        // Injetar após carregar preferências
        await this.injectIntoHeader();
      },
    );
  }

  async injectIntoHeader() {
    const header = getHTMLElement(this.headerIdentifier);
    const buttonsContainer = document.createElement("div");

    buttonsContainer.style.cssText = `
      display: flex;
      flex-direction: row;
    `;

    if (!header) {
      console.warn("elemento HEADER não encontrado. Tentando novamente em 4s");
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await sleep(4000);
      this.injectIntoHeader();
      return;
    }
    header.appendChild(buttonsContainer);

    // Usar cache de preferências (síncrono)
    const isOcorrenciaEnabled = this.buttonPreferences["toggle-btn-ocorrencia"];
    const isVerClienteEnabled =
      this.buttonPreferences["toggle-btn-ver-cliente"];
    const isVerProspectadoEnabled =
      this.buttonPreferences["toggle-btn-ver-prospectado"];

    // Evita duplicação e respeita preferências
    if (!document.getElementById("softcom-header-icon")) {
      buttonsContainer.appendChild(this.iconImgElement);
    }

    // Criar OC
    if (isOcorrenciaEnabled) {
      if (!document.getElementById("softcom-ocorrencia-btn")) {
        buttonsContainer.appendChild(this.btnOcorrencia);
      }
    } else {
      const btn = document.getElementById("softcom-ocorrencia-btn");
      if (btn) btn.remove();
    }

    // Ver Cliente
    if (isVerClienteEnabled) {
      if (!document.getElementById("softcom-ver-cliente-btn")) {
        buttonsContainer.appendChild(this.btnVerCliente);
      }
    } else {
      const btn = document.getElementById("softcom-ver-cliente-btn");
      if (btn) btn.remove();
    }

    // Ver Prospectado
    if (isVerProspectadoEnabled) {
      if (!document.getElementById("softcom-ver-prospectado-btn")) {
        buttonsContainer.appendChild(this.btnVerProspectado);
      }
    } else {
      const btn = document.getElementById("softcom-ver-prospectado-btn");
      if (btn) btn.remove();
    }
  }
}
