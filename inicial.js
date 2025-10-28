// Comentário para forçar deploy v10 - Final
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
//     O "SEGURANÇA" (PROTETOR DE PÁGINA)
// =======================================================
auth.onAuthStateChanged(function(user) {
    const isLoginPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('login.html');
    if (user) {
        console.log("Usuário está LOGADO:", user.email);
        if (isLoginPage) window.location.href = "inicial.html";
    } else {
        if (!isLoginPage) window.location.href = "index.html";
    }
});

//----- SCRIPT DA TELA DE CARREGAMENTO (Usa window.load - ESSENCIAL) -----
window.addEventListener('load', () => {
    console.log("DEBUG: Evento window.load disparado (para Splash).");
    const splashScreen = document.getElementById("splash-screen");
    const mainContent = document.getElementById("main-content");
    if (splashScreen && mainContent) {
        const splashScreenTime = 1000;
        setTimeout(() => {
            if (splashScreen) {
                splashScreen.classList.add("hidden");
                splashScreen.addEventListener("transitionend", () => {
                    if (splashScreen) { splashScreen.remove(); }
                    if (mainContent) mainContent.style.display = "grid";
                }, { once: true });
            } else if(mainContent) { mainContent.style.display = "grid"; }
        }, splashScreenTime);
    } else if (mainContent){ mainContent.style.display = "grid"; }
});
//----- FIM DO SCRIPT DA TELA DE CARREGAMENTO -----

// --- SCRIPT ORIGINAL DA PÁGINA (inicial.html) ---
// **** Usando window.load como estava funcionando antes ****
window.addEventListener('load', () => {
    console.log("DEBUG: window.load disparado (para Scripts da inicial.html).");
    const saudacaoTitulo = document.querySelector('.banner-destaque h2');
    if (saudacaoTitulo) { /* ... (código da saudação) ... */ }
    const menuItens = document.querySelectorAll('.menu-navegacao ul li');
    if (menuItens) { /* ... (código do menu) ... */ }
    // ... (outros scripts da inicial.html) ...
});

// =======================================================
//     LÓGICA DA PÁGINA 'automacao.html' (IA SÓ PARA IMAGEM)
// =======================================================
// **** Usando DOMContentLoaded aqui ****
document.addEventListener('DOMContentLoaded', function() {
    const btnSalvar = document.getElementById('btnSalvarArquivo');
    if (btnSalvar) { // Só roda na automacao.html
        console.log("DEBUG: Iniciando lógica da página automacao.html (DOMContentLoaded).");
        // ... (Pega elementos: nomeArquivoInput, ..., iaStatus) ...
        const btnProcessarIA = document.getElementById('btnProcessarIA');
        // Lógica Botão IA (SÓ IMAGEM)
        if (btnProcessarIA) { /* ... (código IA Tesseract para imagem) ... */ }
        // Lógica Botão Salvar
        btnSalvar.addEventListener('click', function() { /* ... (código salvar com textoIA) ... */ });
        // Função salvarNoBanco
        function salvarNoBanco(nome, local, tipo, textoIA) { /* ... (código salvar no DB) ... */ }
    }
});


// =======================================================
//     LÓGICA DA PÁGINA 'listar.html'
// =======================================================
// **** Usando DOMContentLoaded aqui ****
document.addEventListener('DOMContentLoaded', function() {
    const containerDaLista = document.getElementById('containerDaLista');
    if (containerDaLista) {
        console.log("DEBUG: Iniciando lógica da página listar.html (DOMContentLoaded).");
        const arquivosRef = db.ref('arquivos');
        arquivosRef.once('value', (snapshot) => { /* ... (código para montar lista) ... */ })
        .catch((error) => { /* ... (tratamento erro lista) ... */ });
    }
});

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (COM QR CODE e TEXTO IA)
// =======================================================
// **** Usando DOMContentLoaded aqui ****
document.addEventListener('DOMContentLoaded', function() {
    const nomeDisplay = document.getElementById('nomeArquivoDisplay');
    if (nomeDisplay) { // Estamos na página arquivo.html
        console.log("DEBUG: Iniciando lógica da página arquivo.html (DOMContentLoaded).");
        // ... (código pegar ID) ...
        // Gera QR Code
        const qrcodeDetalhesDiv = document.getElementById('qrcodeDetalhes');
        if (qrcodeDetalhesDiv) { /* ... (código gerar QR Code real) ... */ }
        // ... (Busca Dados, Botão Atualizar, Botão Adicionar Novo) ...
    }
});

// =======================================================
//     LÓGICA COMPLETA DO CHATBOT DATALIA (SEMPRE VISÍVEL)
// =======================================================
// **** Usando DOMContentLoaded aqui ****
// =======================================================
//     LÓGICA COMPLETA DO CHATBOT DATALIA (SEMPRE VISÍVEL)
// =======================================================
// **** Usando window.load para garantir que tudo está pronto ****
window.addEventListener('load', function() { 
    // --- Elementos do Chat ---
    const chatInput = document.getElementById('chatInput');
    const enviarChatBtn = document.getElementById('enviarChatBtn');
    const chatCorpo = document.getElementById('chatCorpo');
    const chatJanela = document.getElementById('chatJanela'); 

    if (chatJanela && chatInput && enviarChatBtn && chatCorpo) {
        console.log("DEBUG: Elementos do Chat encontrados (window.load). Iniciando lógica Gemini.");

        // --- Lógica da Conexão Gemini ---
        // ... (API_KEY, initializeGemini, adicionarMensagem...) ...

        async function enviarMensagem() {
             console.log("DEBUG: Função enviarMensagem FOI CHAMADA!"); // Log
             // ... (resto da função) ...
         }

        // Inicialização e Event Listeners
        // ... (initializeGemini) ...
        enviarChatBtn.addEventListener('click', function() { // Log no clique
            console.log("DEBUG: Botão ENVIAR foi CLICADO!"); 
            enviarMensagem(); 
        });
        chatInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') enviarMensagem(); });
        console.log("DEBUG: Event listeners de envio adicionados.");

    } else {
        console.log("DEBUG: Elementos do Chat NÃO encontrados nesta página (window.load).");
    }
}); // Fim do window.load para o Chatbot
// =======================================================
//     LÓGICA DO BOTÃO "SAIR" (LOGOUT)
// =======================================================
// **** Usando DOMContentLoaded aqui ****
document.addEventListener('DOMContentLoaded', function() {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        console.log("DEBUG: Botão Logout encontrado.");
        btnLogout.addEventListener('click', function(e) { /* ... (código do logout) ... */ });
    } else {
         console.log("DEBUG: Botão Logout NÃO encontrado.");
    }
});