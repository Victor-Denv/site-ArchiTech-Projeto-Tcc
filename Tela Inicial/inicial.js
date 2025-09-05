// --- SCRIPT DA TELA DE CARREGAMENTO ---
window.addEventListener('load', () => {
    // Seleciona os elementos pelos novos IDs em português
    const telaCarregamento = document.getElementById('tela-carregamento');
    const conteudoPrincipal = document.getElementById('conteudo-principal-container');

    const duracaoCarregamento = 2500; // 2.5 segundos

    setTimeout(() => {
        // Adiciona a classe para iniciar a transição de desaparecimento
        telaCarregamento.classList.add('escondida');

        // Mostra o conteúdo principal após a transição da tela de carregamento
        telaCarregamento.addEventListener('transitionend', () => {
            if (telaCarregamento) {
                telaCarregamento.remove(); 
            }
            if (conteudoPrincipal) {
                conteudoPrincipal.style.display = 'grid';
            }
        }, { once: true });

    }, duracaoCarregamento);
});

// --- SCRIPT ORIGINAL DA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    // Atualiza a saudação no banner
    const saudacaoTitulo = document.querySelector('.banner-destaque h2');
    if (saudacaoTitulo) {
        const horaAtual = new Date().getHours();
        let saudacao = '';

        if (horaAtual >= 5 && horaAtual < 12) {
            saudacao = 'Bom dia, Arquivista!';
        } else if (horaAtual >= 12 && horaAtual < 18) {
            saudacao = 'Boa tarde, Arquivista!';
        } else {
            saudacao = 'Boa noite, Arquivista!';
        }

        const textoOriginal = "Veja algumas das atualizações do nosso acervo enquanto você esteve fora...";
        saudacaoTitulo.textContent = `${saudacao} ${textoOriginal}`;
    }

    // Lógica para ativar item do menu ao clicar
    const menuItens = document.querySelectorAll('.menu-navegacao ul li');
    menuItens.forEach(item => {
        item.addEventListener('click', (evento) => {
            // Se o link não for para outra página, previne o comportamento padrão
            const link = item.querySelector('a');
            if (link && link.getAttribute('href') === '#') {
                evento.preventDefault();
            }

            // Remove a classe 'ativo' de todos os itens
            menuItens.forEach(i => i.classList.remove('ativo'));
            // Adiciona a classe 'ativo' apenas no item clicado
            item.classList.add('ativo');
        });
    });

    // Botão "Saiba mais" do banner
    const botaoSaibaMais = document.querySelector('.banner-destaque .botao-principal');
    if (botaoSaibaMais) {
        botaoSaibaMais.addEventListener('click', () => {
            alert('Funcionalidade "Saiba Mais" será implementada em breve!');
        });
    }

    // Ícone de notificações no cabeçalho
    const iconeNotificacoes = document.querySelector('.icones-cabecalho .fa-bell');
    if (iconeNotificacoes) {
        iconeNotificacoes.addEventListener('click', () => {
            alert('Novas notificações serão exibidas aqui!');
        });
    }

    // Card de mensagem da assistente IA
    const previaMensagem = document.querySelector('.previa-mensagem');
    if (previaMensagem) {
        previaMensagem.addEventListener('click', () => {
            alert('O chat com a assistente DataLia será aberto em uma nova janela.');
        });
    }
});