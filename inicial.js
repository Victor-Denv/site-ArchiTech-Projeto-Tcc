// Comentário para forçar deploy v7
const firebaseConfig = {
  apiKey: "AIzaSyCPym-OjXGXY7IhA1u3DDPIOPi5tECDhR8", // COLE SUA CHAVE REAL AQUI
  authDomain: "architeck-e92b4.firebaseapp.com",
  databaseURL: "https://architeck-e92b4-default-rtdb.firebaseio.com/",
  projectId: "architeck-e92b4",
  storageBucket: "architeck-e92b4.firebasestorage.app",
  messagingSenderId: "97992394607", // COLE SEU SENDER ID REAL AQUI
  appId: "1:97992394607:web:130d060bdfff02d8474a9a", // COLE SEU APP ID REAL AQUI
  measurementId: "G-N7T7B468Z9"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.database();
const auth = firebase.auth();
console.log("Firebase Conectado com SUCESSO a partir do inicial.js!");

// =======================================================
//     O "SEGURANÇA" (PROTETOR DE PÁGINA) - Roda imediatamente
// =======================================================
auth.onAuthStateChanged(function(user) { /* ... (código segurança continua igual) ... */ });

//----- SCRIPT DA TELA DE CARREGAMENTO (Usa window.load) -----
window.addEventListener('load', () => {
    console.log("DEBUG: Evento window.load disparado (para Splash)."); // Log
    const splashScreen = document.getElementById("splash-screen");
    const mainContent = document.getElementById("main-content");
    if (splashScreen && mainContent) {
        const splashScreenTime = 1000;
        setTimeout(() => {
            if (splashScreen) {
                console.log("DEBUG: Escondendo Splash Screen..."); // Log
                splashScreen.classList.add("hidden");
                splashScreen.addEventListener("transitionend", () => {
                    if (splashScreen) { splashScreen.remove(); }
                    if (mainContent) mainContent.style.display = "grid";
                    console.log("DEBUG: Splash Screen removida, conteúdo visível."); // Log
                }, { once: true });
            } else if(mainContent) { mainContent.style.display = "grid"; }
        }, splashScreenTime);
    } else if (mainContent){
         mainContent.style.display = "grid"; // Se não tem splash, mostra direto
         console.log("DEBUG: Splash não encontrada, mostrando conteúdo direto."); // Log
    } else {
         console.log("DEBUG: Nem Splash nem Main Content encontrados no load."); // Log de erro
    }
});
//----- FIM DO SCRIPT DA TELA DE CARREGAMENTO -----

// --- SCRIPT ORIGINAL DA PÁGINA (inicial.html) ---
// **** VOLTOU PARA DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOMContentLoaded disparado (para Scripts da inicial.html)."); // Log
    const saudacaoTitulo = document.querySelector('.banner-destaque h2');
    if (saudacaoTitulo) { /* ... (código da saudação) ... */ }
    const menuItens = document.querySelectorAll('.menu-navegacao ul li');
    if (menuItens) { /* ... (código do menu) ... */ }
    // ... (outros scripts da inicial.html) ...
});

// =======================================================
//     LÓGICA DA PÁGINA 'automacao.html' (IA SÓ PARA IMAGEM)
// =======================================================
// **** VOLTOU PARA DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() {
    const btnSalvar = document.getElementById('btnSalvarArquivo');
    if (btnSalvar) { // Só roda na automacao.html
        console.log("DEBUG: Iniciando lógica da página automacao.html."); // Log
        // ... (Pega elementos: nomeArquivoInput, ..., iaStatus) ...
        const btnProcessarIA = document.getElementById('btnProcessarIA');
        // Lógica Botão IA (SÓ IMAGEM)
        if (btnProcessarIA) {
            console.log("DEBUG: Botão Processar IA encontrado."); // Log
            btnProcessarIA.addEventListener('click', async function() { /* ... (código IA Tesseract para imagem) ... */ });
        } else { console.log("DEBUG: Botão Processar IA NÃO encontrado."); }
        // Lógica Botão Salvar
        btnSalvar.addEventListener('click', function() { /* ... (código salvar com textoIA) ... */ });
        // Função salvarNoBanco
        function salvarNoBanco(nome, local, tipo, textoIA) { /* ... (código salvar no DB) ... */ }
    }
});


// =======================================================
//     LÓGICA DA PÁGINA 'listar.html'
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() {
    const containerDaLista = document.getElementById('containerDaLista');
    if (containerDaLista) {
        console.log("DEBUG: Iniciando lógica da página listar.html.");
        const arquivosRef = db.ref('arquivos');
        arquivosRef.once('value', (snapshot) => { /* ... (código para montar lista) ... */ })
        .catch((error) => { /* ... (tratamento erro lista) ... */ });
    }
});

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (COM QR CODE e TEXTO IA)
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() {
    const nomeDisplay = document.getElementById('nomeArquivoDisplay');
    if (nomeDisplay) { // Estamos na página arquivo.html
        console.log("DEBUG: Iniciando lógica da página arquivo.html.");
        // ... (código pegar ID) ...
        const params = new URLSearchParams(window.location.search);
        const arquivoId = params.get('id');
        if (!arquivoId) { /* ... (erro ID) ... */ return; }
        console.log("ID encontrado:", arquivoId);

        // Gera QR Code
        const qrcodeDetalhesDiv = document.getElementById('qrcodeDetalhes');
        if (qrcodeDetalhesDiv) {
             const urlAtual = window.location.href;
             qrcodeDetalhesDiv.innerHTML = "";
             try {
                 new QRCode(qrcodeDetalhesDiv, { text: urlAtual, width: 128, height: 128 });
                 console.log("QR Code gerado para:", urlAtual);
             } catch (error) { console.error("Erro ao gerar QR Code:", error); }
        } else { console.error("DEBUG: Div 'qrcodeDetalhes' NÃO encontrada!"); }

        const arquivoRef = db.ref('arquivos/' + arquivoId);
        // Busca Dados (inclui anexo Base64 e texto IA)
        arquivoRef.on('value', (snapshot) => { /* ... (código mostrar dados continua igual) ... */ });
        // Botão Atualizar Localização
        const btnAtualizar = document.getElementById('btnAtualizarLocal');
        if(btnAtualizar) { btnAtualizar.addEventListener('click', function() { /* ... */ }); }
        // Botão "+ Adicionar Novo Arquivo"
        const btnIrParaCadastro = document.getElementById('btnIrParaCadastro');
        if(btnIrParaCadastro) { btnIrParaCadastro.addEventListener('click', function() { /* ... */ }); }
    }
});

// =======================================================
//     LÓGICA COMPLETA DO CHATBOT DATALIA (SEMPRE VISÍVEL)
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos do Chat ---
    const chatInput = document.getElementById('chatInput');
    const enviarChatBtn = document.getElementById('enviarChatBtn');
    const chatCorpo = document.getElementById('chatCorpo');
    const chatJanela = document.getElementById('chatJanela');

    if (chatJanela && chatInput && enviarChatBtn && chatCorpo) {
        console.log("DEBUG: Elementos do Chat encontrados. Iniciando lógica Gemini.");
        // --- Lógica da Conexão Gemini ---
        const API_KEY = "AIzaSyDmrqBe2d5vHpYH95a9Zb-YAdL4Tl0TTrc"; // COLE SUA CHAVE AQUI!!!
        // ... (resto do código do chatbot continua igual) ...
    } else {
        console.log("DEBUG: Elementos do Chat NÃO encontrados nesta página.");
    }
});

// =======================================================
//     LÓGICA DO BOTÃO "SAIR" (LOGOUT)
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        console.log("DEBUG: Botão Logout encontrado.");
        btnLogout.addEventListener('click', function(e) { /* ... (código do logout continua igual) ... */ });
    } else {
         console.log("DEBUG: Botão Logout NÃO encontrado nesta página.");
    }
});