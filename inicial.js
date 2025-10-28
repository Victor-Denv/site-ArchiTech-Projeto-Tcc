// Comentário para forçar deploy v8
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
auth.onAuthStateChanged(function(user) { /* ... (código segurança continua igual) ... */ });

//----- SCRIPT DA TELA DE CARREGAMENTO (Usa window.load - ESSENCIAL) -----
window.addEventListener('load', () => {
    console.log("DEBUG: Evento window.load disparado (para Splash).");
    const splashScreen = document.getElementById("splash-screen");
    const mainContent = document.getElementById("main-content");
    // ... (código da tela de loading continua igual) ...
});
//----- FIM DO SCRIPT DA TELA DE CARREGAMENTO -----

// --- SCRIPT ORIGINAL DA PÁGINA (inicial.html) ---
// **** Usando DOMContentLoaded aqui está OK ****
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOMContentLoaded disparado (para Scripts da inicial.html).");
    // ... (código da saudação, menu, etc. continua igual) ...
});

// =======================================================
//     LÓGICA DA PÁGINA 'automacao.html' (IA SÓ PARA IMAGEM)
// =======================================================
// **** Usando window.load aqui é mais seguro por causa da IA ****
window.addEventListener('load', function() {
    const btnSalvar = document.getElementById('btnSalvarArquivo');
    if (btnSalvar) { // Só roda na automacao.html
        console.log("DEBUG: Iniciando lógica da página automacao.html (window.load).");
        // ... (Pega elementos: nomeArquivoInput, ..., iaStatus) ...
        const btnProcessarIA = document.getElementById('btnProcessarIA');
        // Lógica Botão IA (SÓ IMAGEM)
        if (btnProcessarIA) { /* ... (código IA Tesseract para imagem continua igual) ... */ }
        // Lógica Botão Salvar
        btnSalvar.addEventListener('click', function() { /* ... (código salvar com textoIA continua igual) ... */ });
        // Função salvarNoBanco
        function salvarNoBanco(nome, local, tipo, textoIA) { /* ... (código salvar no DB continua igual) ... */ }
    }
});


// =======================================================
//     LÓGICA DA PÁGINA 'listar.html'
// =======================================================
// **** Usando DOMContentLoaded aqui está OK ****
document.addEventListener('DOMContentLoaded', function() {
    const containerDaLista = document.getElementById('containerDaLista');
    if (containerDaLista) {
        console.log("DEBUG: Iniciando lógica da página listar.html (DOMContentLoaded).");
        const arquivosRef = db.ref('arquivos');
        arquivosRef.once('value', (snapshot) => { /* ... (código para montar lista continua igual) ... */ })
        .catch((error) => { /* ... (tratamento erro lista) ... */ });
    }
});

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (COM QR CODE e TEXTO IA)
// =======================================================
// **** Usando window.load aqui é mais seguro por causa do QR Code e busca de dados ****
window.addEventListener('load', function() {
    const nomeDisplay = document.getElementById('nomeArquivoDisplay');
    if (nomeDisplay) { // Estamos na página arquivo.html
        console.log("DEBUG: Iniciando lógica da página arquivo.html (window.load).");
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
// **** Usando window.load aqui é ESSENCIAL ****
window.addEventListener('load', function() {
    // --- Elementos do Chat ---
    const chatInput = document.getElementById('chatInput');
    const enviarChatBtn = document.getElementById('enviarChatBtn');
    const chatCorpo = document.getElementById('chatCorpo');
    const chatJanela = document.getElementById('chatJanela');

    if (chatJanela && chatInput && enviarChatBtn && chatCorpo) {
        console.log("DEBUG: Elementos do Chat encontrados. Iniciando lógica Gemini (window.load).");

        // --- Lógica da Conexão Gemini ---
        const API_KEY = "AIzaSy...(sua chave completa)..."; // COLE SUA CHAVE AQUI!!!
        console.log("DEBUG: Usando API Key começando com:", API_KEY.substring(0, 8) + "...");

        let genAI;
        let model;

        async function initializeGemini() { /* ... (código continua igual) ... */ }
        function adicionarMensagem(texto, tipo = "ia", isLoading = false) { /* ... (código continua igual) ... */ }
        async function enviarMensagem() {
             // **** Adicionando LOG aqui ****
             console.log("DEBUG: Função enviarMensagem FOI CHAMADA!");
             const mensagemUsuario = chatInput.value.trim();
             // ... (resto da função continua igual) ...
         }

        // Inicialização e Event Listeners
        chatInput.placeholder = "Inicializando IA...";
        chatInput.disabled = true;
        enviarChatBtn.disabled = true;
        initializeGemini().then(() => { /* ... */ });

        // **** Adicionando LOG aqui ****
        enviarChatBtn.addEventListener('click', function() {
            console.log("DEBUG: Botão ENVIAR foi CLICADO!");
            enviarMensagem(); // Chama a função
        });
        chatInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') enviarMensagem(); });
        console.log("DEBUG: Event listeners de envio adicionados.");

    } else {
        console.log("DEBUG: Elementos do Chat NÃO encontrados nesta página.");
    }
});

// =======================================================
//     LÓGICA DO BOTÃO "SAIR" (LOGOUT)
// =======================================================
// **** Usando DOMContentLoaded aqui está OK ****
document.addEventListener('DOMContentLoaded', function() {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        console.log("DEBUG: Botão Logout encontrado.");
        btnLogout.addEventListener('click', function(e) { /* ... (código do logout continua igual) ... */ });
    } else {
         console.log("DEBUG: Botão Logout NÃO encontrado.");
    }
});