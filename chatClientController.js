class ChatClientController {
  AREA_PARTNER_URL_PRODUCTION = "https://areapartner.softcomsistemas.com.br/";
  AREA_PARTNER_URL_ALTERNATIVE =
    "http://177.43.232.2:25123/area-partner/public/";

  AREA_PARTNER_BASE_URL = AREA_PARTNER_URL_PRODUCTION;

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

  constructor(
    headerIdentifier,
    clientNameIdentifier,
    clientPhoneIdentifier,
    clientObservationsIdentifier,
    darkModeClass,
  ) {
    this.headerIdentifier = headerIdentifier;
    this.clientNameIdentifier = clientNameIdentifier;
    this.clientPhoneIdentifier = clientPhoneIdentifier;
    this.clientObservationsIdentifier = clientObservationsIdentifier;
    this.darkModeClass = darkModeClass;

    this.createIconImgElement();
    this.loadAreaPartnerUrlFromStorage();
    this.createButtonElements();
    this.observeDarkModeChanges();
    this.loadButtonPreferences();
    this.injectIntoHeader();
  }

  loadAreaPartnerUrlFromStorage() {
    // Carregar URL da Area Partner do storage
    chrome.storage.sync.get(["area-partner-use-alternative"], (result) => {
      const useAlternative = result["area-partner-use-alternative"] || false;
      AREA_PARTNER_BASE_URL = useAlternative
        ? AREA_PARTNER_URL_ALTERNATIVE
        : AREA_PARTNER_URL_PRODUCTION;

      // Atualizar href do ícone
      iconImg.href = AREA_PARTNER_BASE_URL;
    });
  }

  createIconImgElement() {
    this.iconImgElement = document.createElement("a");
    iconImg.id = "softcom-header-icon";
    iconImg.href = AREA_PARTNER_BASE_URL;
    iconImg.target = "_blank";
    iconImg.rel = "noopener noreferrer";
    iconImg.style.cssText = `
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

  createButtonElements() {
    this.btnOcorrencia = createAnchorButton(
      "softcom-ocorrencia-btn",
      "Criar OC.",
      journalPlusSVG,
    );

    this.btnOCFinalizada = createAnchorButton(
      "softcom-ocorrencia-finalizada-btn",
      "OC. Finalizada",
      checkSVG,
    );

    // Criar ícone de help com interrogação
    const helpIconOCFinalizada = document.createElement("span");
    helpIconOCFinalizada.innerText = "?";
    helpIconOCFinalizada.style.cssText = `
  align-items: center;
  color: white;
  font-size: 13px;
  font-weight: bold;
  cursor: help;
  position: absolute;
  margin-top: -18px;
  margin-right: -6px;
  text-shadow:
    -1px -1px 0 #000, 
     1px -1px 0 #000,
    -1px  1px 0 #000, 
     1px  1px 0 #000;
`;
    helpIconOCFinalizada.title = "Clique aqui para mais informações.";
    helpIconOCFinalizada.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      alert(`
    Captura horários de chegada e saída da conversa atual para preencher no formulário da OC. Funciona tanto com mensagens enviadas quanto com notas internas.
    O horário de chegada é identificado quando é usada uma das seguintes frases:
    ${arrivalMessages.map((msg) => `\n- "${msg}"`).join("")}
    O horário de saída é identificado quando é usada uma das seguintes frases:
    ${departureMessages.map((msg) => `\n- "${msg}"`).join("")}
    `);
    });
    btnOCFinalizada.appendChild(helpIconOCFinalizada);

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
      const currentClientInfo = captureCurrentClientInfo();
      if (currentClientInfo.code === "") {
        this.btnOcorrencia.href = `${AREA_PARTNER_BASE_URL}cliente/index?&nome_cliente=${currentClientInfo.name}`;
        alert(
          "Código do cliente não encontrado. Insira o código nas observações.",
        );
        return;
      }
      this.btnOcorrencia.href = `${AREA_PARTNER_BASE_URL}agenda/form/id/${
        currentClientInfo.code
      }?name=${encodeURIComponent(currentClientInfo.name)}&assunto=TEC REMOTO`;
    });

    this.btnOCFinalizada.addEventListener("click", () => {
      const currentClientInfo = captureCurrentClientInfo();
      const { arrivalTime, departureTime } = captureArrivalAndDepartureTime();
      if (currentClientInfo.code === "") {
        this.btnOCFinalizada.href = `${AREA_PARTNER_BASE_URL}cliente/index?&nome_cliente=${currentClientInfo.name}`;
        alert(
          "Código do cliente não encontrado. Insira o código nas observações.",
        );
        return;
      }
      this.btnOCFinalizada.href = `${AREA_PARTNER_BASE_URL}agenda/form/id/${
        currentClientInfo.code
      }?name=${encodeURIComponent(
        currentClientInfo.name,
      )}&assunto=TEC REMOTO&arrivalTime=${encodeURIComponent(
        arrivalTime || "",
      )}&departureTime=${encodeURIComponent(departureTime || "")}`;
    });

    this.btnVerCliente.addEventListener("click", () => {
      const currentClientInfo = captureCurrentClientInfo();
      if (currentClientInfo.code === "") {
        this.btnVerCliente.href = `${AREA_PARTNER_BASE_URL}cliente/index?&nome_cliente=${currentClientInfo.name}`;
        alert(
          "Código do cliente não encontrado. Insira o código nas observações.",
        );
        return;
      }
      const url = `${AREA_PARTNER_BASE_URL}cliente/index/detail/id/${currentClientInfo.code}`;
      this.btnVerCliente.href = url;
    });

    this.btnVerProspectado.addEventListener("click", () => {
      const currentClientInfo = captureCurrentClientInfo();
      if (currentClientInfo.code === "") {
        this.btnVerProspectado.href = `${AREA_PARTNER_BASE_URL}comercial/prospectado?&nome_do_cliente=${currentClientInfo.name}`;
        alert(
          "Código do prospectado não encontrado. Insira o código nas observações.",
        );
        return;
      }
      const url = `${AREA_PARTNER_BASE_URL}comercial/prospectado/form/table/prospectado/id/${currentClientInfo.code}`;
      this.btnVerProspectado.href = url;
    });
  }

  isDarkModeActive() {
    const target = document.body || document.documentElement;
    if (!target) return false;
    return target.classList.contains(this.darkModeClass);
  }
  applyStyleMode() {
    const isDarkMode = isDarkModeActive();
    btnOcorrencia.classList.toggle("dark-mode", isDarkMode);
    btnOCFinalizada.classList.toggle("dark-mode", isDarkMode);
    btnVerCliente.classList.toggle("dark-mode", isDarkMode);
    btnVerProspectado.classList.toggle("dark-mode", isDarkMode);
  }

  // Observer para monitorar mudanças no modo escuro
  observeDarkModeChanges() {
    const bodyElement = document.body || document.documentElement;
    const observer = new MutationObserver(() => {
      applyStyleMode();
    });

    observer.observe(bodyElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  async loadButtonPreferences() {
    chrome.storage.sync.get(Object.keys(buttonPreferences), async (result) => {
      Object.keys(buttonPreferences).forEach((key) => {
        buttonPreferences[key] = result[key] !== false;
      });
      // Injetar após carregar preferências
      await injectIntoHeader();
    });
  }

  async injectIntoHeader() {
    const header = getHTMLElement(this.headerIdentifier);

    if (!header) {
      console.error("elemento HEADER não encontrado. Tentando novamente em 4s");
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await sleep(4000);
      injectIntoHeader();
      return;
    }

    // Usar cache de preferências (síncrono)
    const isOcorrenciaEnabled = buttonPreferences["toggle-btn-ocorrencia"];
    const isOCFinalizadaEnabled =
      buttonPreferences["toggle-btn-ocorrencia-finalizada"];
    const isVerClienteEnabled = buttonPreferences["toggle-btn-ver-cliente"];
    const isVerProspectadoEnabled =
      buttonPreferences["toggle-btn-ver-prospectado"];

    // Evita duplicação e respeita preferências
    if (!document.getElementById("softcom-header-icon")) {
      header.insertBefore(iconImg, header.children[1]);
    }

    // Criar OC
    if (isOcorrenciaEnabled) {
      if (!document.getElementById("softcom-ocorrencia-btn")) {
        header.insertBefore(btnOcorrencia, header.children[2]);
      }
    } else {
      const btn = document.getElementById("softcom-ocorrencia-btn");
      if (btn) btn.remove();
    }

    // OC Finalizada
    if (isOCFinalizadaEnabled) {
      if (!document.getElementById("softcom-ocorrencia-finalizada-btn")) {
        header.insertBefore(btnOCFinalizada, header.children[3]);
      }
    } else {
      const btn = document.getElementById("softcom-ocorrencia-finalizada-btn");
      if (btn) btn.remove();
    }

    // Ver Cliente
    if (isVerClienteEnabled) {
      if (!document.getElementById("softcom-ver-cliente-btn")) {
        header.insertBefore(btnVerCliente, header.children[4]);
      }
    } else {
      const btn = document.getElementById("softcom-ver-cliente-btn");
      if (btn) btn.remove();
    }

    // Ver Prospectado
    if (isVerProspectadoEnabled) {
      if (!document.getElementById("softcom-ver-prospectado-btn")) {
        header.insertBefore(btnVerProspectado, header.children[5]);
      }
    } else {
      const btn = document.getElementById("softcom-ver-prospectado-btn");
      if (btn) btn.remove();
    }
  }
}
