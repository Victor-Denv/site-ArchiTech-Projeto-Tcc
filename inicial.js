// Comentário para forçar deploy v11 - FINAL
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

//----- SCRIPT DA TELA DE CARREGAMENTO (Usa window.load) -----
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
// **** Usando window.load ****
window.addEventListener('load', () => {
    console.log("DEBUG: window.load disparado (para Scripts da inicial.html).");
    // ... (código da saudação, menu, etc. continua igual) ...
});

// =======================================================
//     LÓGICA DA PÁGINA 'automacao.html' (IA SÓ PARA IMAGEM)
// =======================================================
// **** Usando DOMContentLoaded aqui ****
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
// **** Usando DOMContentLoaded aqui ****
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
// **** Usando DOMContentLoaded aqui ****
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
// **** Usando window.load aqui ****
window.addEventListener('load', function() {
    // --- Elementos do Chat ---
    const chatInput = document.getElementById('chatInput');
    const enviarChatBtn = document.getElementById('enviarChatBtn');
    const chatCorpo = document.getElementById('chatCorpo');
    const chatJanela = document.getElementById('chatJanela');

    if (chatJanela && chatInput && enviarChatBtn && chatCorpo) {
        console.log("DEBUG: Elementos do Chat encontrados (window.load). Iniciando lógica Gemini.");

        // --- Lógica da Conexão Gemini ---
        const API_KEY = "AIzaSyDmrqBe2d5vHpYH95a9Zb-YAdL4Tl0TTrc"; // COLE SUA CHAVE AQUI!!!
        console.log("DEBUG: Usando API Key começando com:", API_KEY.substring(0, 8) + "...");

        let genAI;
        let model;

        async function initializeGemini() { /* ... (código continua igual) ... */ }

        function adicionarMensagem(texto, tipo = "ia", isLoading = false) { /* ... (código continua igual) ... */ }

        // **** FUNÇÃO enviarMensagem DEFINIDA AQUI DENTRO ****
        async function enviarMensagem() {
            console.log("DEBUG: Função enviarMensagem FOI CHAMADA!");
            const mensagemUsuario = chatInput.value.trim();
            if (mensagemUsuario === "" || !model) { /* ... */ return; }
            adicionarMensagem(mensagemUsuario, "usuario");
            chatInput.value = "";
            enviarChatBtn.disabled = true;
            adicionarMensagem("Digitando", "ia", true);
            try {
                console.log("DEBUG: PREPARANDO para enviar para Gemini:", mensagemUsuario);
                const result = await model.generateContent(mensagemUsuario);
                console.log("DEBUG: Resposta BRUTA do Gemini recebida:", result);
                const response = await result.response;
                if (!response) throw new Error("Resposta da API vazia.");
                console.log("DEBUG: Tentando extrair texto da resposta...");
                const textoResposta = response.text();
                console.log("DEBUG: Texto da resposta extraído:", textoResposta.substring(0, 50) + "...");
                const loadingMsg = document.getElementById('loading-message');
                if (loadingMsg) loadingMsg.remove();
                adicionarMensagem(textoResposta, "ia");
            } catch (error) {
                 console.error("DEBUG: ERRO CAPTURADO no bloco catch:", error);
                 console.error("DEBUG: Mensagem de erro específica:", error.message);
                 const loadingMsg = document.getElementById('loading-message');
                 if (loadingMsg) loadingMsg.remove();
                 adicionarMensagem("Desculpe, ocorreu um erro.", "ia");
            } finally {
                 console.log("DEBUG: Bloco finally executado, reabilitando botão.");
                 enviarChatBtn.disabled = false;
                 if(chatInput) chatInput.focus();
            }
        }
        // **** FIM DA FUNÇÃO enviarMensagem ****

        // Inicialização e Event Listeners
        chatInput.placeholder = "Inicializando IA...";
        chatInput.disabled = true;
        enviarChatBtn.disabled = true;
        initializeGemini().then(() => { /* ... */ });

        // **** LISTENER CHAMA A FUNÇÃO DEFINIDA ACIMA ****
        enviarChatBtn.addEventListener('click', function() {
            console.log("DEBUG: Botão ENVIAR foi CLICADO!");
            enviarMensagem(); // Agora ele acha a função
        });
        chatInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') enviarMensagem(); });
        console.log("DEBUG: Event listeners de envio adicionados.");

    } else {
        console.log("DEBUG: Elementos do Chat NÃO encontrados nesta página.");
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