// Adicionar fundo vermelho à página
const style = document.createElement('style');
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
