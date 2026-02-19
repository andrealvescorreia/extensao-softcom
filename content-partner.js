function widePanels() {
  const style = document.createElement("style");
  style.textContent = `
  .col-md-6 {
    width: 100% !important; 
  }
  .panel-body.fixed-height {
    height: 240px !important;
    max-height: 1520px !important;
  }
  body.inspinia  .page-content {
    padding: 0 40px 44px !important;
  }
`;
  document.head.appendChild(style);
}

function hidePosVendasPanels() {
  const posVendasPanels = document.querySelectorAll("#filter");

  const targetPanel = posVendasPanels[0];
  const parent = targetPanel.parentElement;
  const grandParent = parent ? parent.parentElement : null;
  if (grandParent) {
    grandParent.appendChild(parent);
  }
  if (posVendasPanels.length == 2) {
    posVendasPanels[1].style.display = "none";
  }
}

function moveCurrentUserPanelToTop() {
  const userName = document.querySelectorAll(
    areaPartnerHTMLSelectors.userNameClass,
  )[0].textContent;
  const panels = document.querySelectorAll(".panel");
  panels.forEach((panel) => {
    const heading = panel.querySelectorAll(".panel-heading")[0];
    const titleElement = heading.querySelectorAll(".panel-title")[0];
    if (
      heading &&
      titleElement &&
      titleElement.textContent.includes(userName)
    ) {
      const parent = panel.parentElement;
      const grandParent = parent.parentElement;
      grandParent.insertBefore(parent, grandParent.firstChild);
    }
  });
}

function addArchiveAllButton() {
  const userName = document.querySelectorAll(
    areaPartnerHTMLSelectors.userNameClass,
  )[0].textContent;

  const panels = document.querySelectorAll(".panel");
  panels.forEach((panel) => {
    const heading = panel.querySelectorAll(".panel-heading")[0];
    const titleElement = heading.querySelectorAll(".panel-title")[0];

    if (
      heading &&
      titleElement &&
      titleElement.textContent.includes(userName)
    ) {
      const archiveBtns = panel.querySelectorAll(".btn-warning");
      const button = document.createElement("button");
      button.textContent = "Arquivar todos";
      button.className = "btn-warning checkin-externa btn";
      heading.insertBefore(button, heading.children[1]);

      button.addEventListener("click", () => {
        if (archiveBtns.length === 0) {
          alert("Nenhum item para arquivar.");
          return;
        }
        confirm("Tem certeza que deseja arquivar todos os itens?") &&
          archiveBtns.forEach((btn) => btn.click());
      });
    }
  });
}

function applyChanges() {
  hidePosVendasPanels();
  addArchiveAllButton();

  // Verificar se deve mover o painel ao topo
  chrome.storage.sync.get(["move-panel-to-top-enabled"], (result) => {
    const isEnabled =
      result["move-panel-to-top-enabled"] !== false &&
      result["move-panel-to-top-enabled"] !== undefined; // Padrão: false
    if (isEnabled) {
      moveCurrentUserPanelToTop();
    }
  });

  // Verificar se deve deixar os painéis largos
  chrome.storage.sync.get(["wide-panels-enabled"], (result) => {
    const isEnabled =
      result["wide-panels-enabled"] !== false &&
      result["wide-panels-enabled"] !== undefined; // Padrão: false
    if (isEnabled) {
      widePanels();
    }
  });
}
applyChanges();

// Listener para mudanças no toggle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleWidePanels") {
    if (request.isEnabled) {
      widePanels();
    } else {
      // Recarregar a página para reverter
      location.reload();
    }
  }
});

// Listener para mudanças no toggle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleMovePanelToTop") {
    if (request.isEnabled) {
      moveCurrentUserPanelToTop();
    } else {
      // Recarregar a página para reverter
      location.reload();
    }
  }
});
