// =======================================================
//     COLE ISSO NO COMEÇO DO SEU ARQUIVO inicial.js
// =======================================================

// Sua configuração do Firebase (copie e cole do site do Firebase)
const firebaseConfig = {
    apiKey: "COLE_SUA_API_KEY_COMPLETA_AQUI", // Pegue da tela do Firebase
    authDomain: "architech-vitor-tcc.firebaseapp.com",
    projectId: "architech-vitor-tcc",
    storageBucket: "architech-vitor-tcc.appspot.com",
    messagingSenderId: "COLE_SEU_MESSAGING_SENDER_ID_COMPLETO_AQUI", // Pegue da tela do Firebase
    appId: "COLE_SEU_APP_ID_COMPLETO_AQUI", // Pegue da tela do Firebase
    measurementId: "G-Q77B66GZ03"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Deixa o banco de dados (db) e o storage prontos para usar
const db = firebase.firestore();
const storage = firebase.storage();

console.log("Firebase Conectado com SUCESSO a partir do inicial.js!"); 


// ----- O RESTO DO SEU CÓDIGO DO 'inicial.js' VEM DEPOIS DAQUI -----
// ...
// ...
// --- SCRIPT DA TELA DE CARREGAMENTO ---
window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    // Define o tempo que a splash screen ficará visível (em milissegundos)
    const splashDuration = 2500; // 2.5 segundos

    setTimeout(() => {
        // Adiciona a classe para iniciar a transição de desaparecimento
        splashScreen.classList.add('hidden');

        // Mostra o conteúdo principal após a transição da splash screen
        splashScreen.addEventListener('transitionend', () => {
            // Garante que a splash seja removida do DOM após a animação
            if (splashScreen) {
                splashScreen.remove(); 
            }
            mainContent.style.display = 'grid'; // Usa 'grid' como no seu CSS original
        }, { once: true }); // O evento só será executado uma vez

    }, splashDuration);
});


// --- SCRIPT ORIGINAL DA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    const saudacaoTitulo = document.querySelector('.banner-destaque h2');
    if (saudacaoTitulo) {
        const horaAtual = new Date().getHours();
        let saudacao = '';

        if (horaAtual >= 5 && horaAtual < 12) {
            saudacao = 'Bom dia, Arquivista!!';
        } else if (horaAtual >= 12 && horaAtual < 18) {
            saudacao = 'Boa Tarde, Arquivista!!';
        } else {
            saudacao = 'Boa Noite, Arquivista!!';
        }

        const textoOriginal = "Veja algumas das atualizações do nosso acervo enquanto você esteve fora...";
        saudacaoTitulo.textContent = `${saudacao} ${textoOriginal}`;
    }

    const menuItens = document.querySelectorAll('.menu-navegacao ul li');
    menuItens.forEach(item => {
        item.addEventListener('click', () => {
            const itemAtivoAtual = document.querySelector('.menu-navegacao li.ativo');
            if (itemAtivoAtual) {
                itemAtivoAtual.classList.remove('ativo');
            }
            item.classList.add('ativo');
        });
    });

    const botaoSaibaMais = document.querySelector('.banner-destaque .botao-principal');
    if (botaoSaibaMais) {
        botaoSaibaMais.addEventListener('click', () => {
            alert('Funcionalidade "Saiba Mais" será implementada em breve!');
        });
    }

    const iconeNotificacoes = document.querySelector('.icones-cabecalho .fa-bell');
    if (iconeNotificacoes) {
        iconeNotificacoes.addEventListener('click', () => {
            alert('Novas notificações serão exibidas aqui!');
        });
    }

    const previewMensagem = document.querySelector('.preview-mensagem');
    if (previewMensagem) {
        previewMensagem.addEventListener('click', () => {
            alert('O chat com a assistente DataLia será aberto em uma nova janela.');
        });
    }
});