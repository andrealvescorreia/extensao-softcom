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

const panels = document.querySelectorAll(".panel");
panels.forEach((panel) => {
  const heading = panel.querySelectorAll(".panel-heading")[0];

  if (heading) {
    const button = document.createElement("button");
    button.textContent = "Arquivar todos";
    heading.insertBefore(button, heading.children[1]);

    const archiveBtns = panel.querySelectorAll(".btn-warning");
    button.addEventListener("click", () => {
      confirm("Tem certeza que deseja arquivar todos os itens?") &&
        archiveBtns.forEach((btn) => btn.click());
    });
  }
});
