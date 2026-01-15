// Adicionar fundo vermelho à página
const style = document.createElement("style");
style.textContent = `
  .col-md-6 {
      width: 100% !important; 
  }
  .panel-body.fixed-height {
      height: 200px !important;
      max-height: 1520px !important;
  }
  body.inspinia  .page-content {
      padding: 0 30px 34px !important;
  }
`;
document.head.appendChild(style);

const userName = document.querySelectorAll('.user-name')[0].textContent;

const panels = document.querySelectorAll(".panel");
panels.forEach((panel) => {
  const heading = panel.querySelectorAll(".panel-heading")[0];
  const titleElement = heading.querySelectorAll(".panel-title")[0];

  if (heading && titleElement && titleElement.textContent.includes(userName)) {
    const archiveBtns = panel.querySelectorAll(".btn-warning");
    const button = document.createElement("button");
    button.textContent = "Arquivar todos";
    button.className = "btn-warning checkin-externa btn";
    heading.insertBefore(button, heading.children[1]);

    button.addEventListener("click", () => {
      if(archiveBtns.length === 0) {
        alert("Nenhum item para arquivar.");
        return;
      }
      confirm("Tem certeza que deseja arquivar todos os itens?") &&
        archiveBtns.forEach((btn) => btn.click());
    });
  }
});
