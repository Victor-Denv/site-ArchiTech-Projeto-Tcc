// Comentário para forçar deploy v12 - FINAL REORGANIZADO
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
    // ... (código da tela de loading continua igual) ...
    if (splashScreen && mainContent) { /* ... */ }
    else if (mainContent) { mainContent.style.display = "grid"; }
});
//----- FIM DO SCRIPT DA TELA DE CARREGAMENTO -----

// --- SCRIPT ORIGINAL DA PÁGINA (inicial.html) ---
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOMContentLoaded disparado (para Scripts da inicial.html).");
    // ... (código da saudação, menu, etc. continua igual) ...
});

// =======================================================
//     LÓGICA DA PÁGINA 'automacao.html' (IA SÓ PARA IMAGEM)
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() {
    const btnSalvar = document.getElementById('btnSalvarArquivo');
    if (btnSalvar) { // Só roda na automacao.html
        console.log("DEBUG: Iniciando lógica da página automacao.html (DOMContentLoaded).");
        // ... (Pega elementos, Lógica Botão IA, Lógica Botão Salvar, Função salvarNoBanco) ...
    }
});

// =======================================================
//     LÓGICA DA PÁGINA 'listar.html'
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() {
    const containerDaLista = document.getElementById('containerDaLista');
    if (containerDaLista) {
        console.log("DEBUG: Iniciando lógica da página listar.html (DOMContentLoaded).");
        // ... (código para montar lista) ...
    }
});

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (COM QR CODE e TEXTO IA)
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() {
    const nomeDisplay = document.getElementById('nomeArquivoDisplay');
    if (nomeDisplay) { // Estamos na página arquivo.html
        console.log("DEBUG: Iniciando lógica da página arquivo.html (DOMContentLoaded).");
        // ... (código pegar ID, Gerar QR Code Real, Busca Dados, Botões Atualizar/Adicionar Novo) ...
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
        console.log("DEBUG: Elementos do Chat encontrados (DOMContentLoaded). Iniciando lógica Gemini.");
        // --- Lógica da Conexão Gemini ---
        const API_KEY = "AIzaSyDmrqBe2d5vHpYH95a9Zb-YAdL4Tl0TTrc"; // COLE SUA CHAVE AQUI!!!
        // ... (resto do código do chatbot: initializeGemini, adicionarMensagem, enviarMensagem com logs, listeners) ...
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
        btnLogout.addEventListener('click', function(e) { /* ... (código do logout) ... */ });
    } else {
         console.log("DEBUG: Botão Logout NÃO encontrado.");
    }
});