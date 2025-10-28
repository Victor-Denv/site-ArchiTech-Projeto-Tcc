// Comentário para forçar deploy v25 - FINAL CHAT VISÍVEL
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
            if (splashScreen) { // Verifica se ainda existe
                splashScreen.classList.add("hidden");
                splashScreen.addEventListener("transitionend", () => {
                    if (splashScreen) { splashScreen.remove(); }
                    if (mainContent) mainContent.style.display = "grid";
                }, { once: true });
            } else if(mainContent) {
                 mainContent.style.display = "grid";
            }
        }, splashScreenTime);
    } else if (mainContent){
         mainContent.style.display = "grid"; // Se não tem splash, mostra direto
    }
});
//----- FIM DO SCRIPT DA TELA DE CARREGAMENTO -----


// --- SCRIPT ORIGINAL DA PÁGINA (inicial.html) ---
// **** Usando window.load como estava funcionando antes ****
window.addEventListener('load', () => {
    console.log("DEBUG: window.load disparado (para Scripts da inicial.html).");
    // ... (código da saudação, menu, etc. igual ao que você mandou) ...
});

// =======================================================
//     LÓGICA DA PÁGINA 'automacao.html' (IA SÓ PARA IMAGEM)
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() {
    // ... (código da automacao.html igual ao que você mandou) ...
});


// =======================================================
//     LÓGICA DA PÁGINA 'listar.html'
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() {
    // ... (código da listar.html igual ao que você mandou) ...
});

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (COM QR CODE e TEXTO IA)
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() {
    // ... (código da arquivo.html igual ao que você mandou) ...
});

// =======================================================
//     LÓGICA COMPLETA DO CHATBOT DATALIA (SEMPRE VISÍVEL - CORREÇÃO)
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos do Chat (SEM PREVIEW e FECHARBTN) ---
    const chatInput = document.getElementById('chatInput');
    const enviarChatBtn = document.getElementById('enviarChatBtn');
    const chatCorpo = document.getElementById('chatCorpo');
    const chatJanela = document.getElementById('chatJanela'); // Pegamos só para garantir que existe

    // --- Verifica se os elementos ESSENCIAIS do chat existem ---
    if (chatJanela && chatInput && enviarChatBtn && chatCorpo) {
        console.log("DEBUG: Elementos do Chat (sempre visível) encontrados. Iniciando lógica Gemini.");

        // --- Lógica da Conexão Gemini ---
        // **** !!!!! COLOQUE SUA API KEY REAL AQUI !!!!! ****
        const API_KEY = "COLE_SUA_CHAVE_API_COMPLETA_AQUI"; 
        // **** !!!!! COLOQUE SUA API KEY REAL AQUI !!!!! ****
        console.log("DEBUG: Usando API Key começando com:", API_KEY.substring(0, 8) + "...");

        let genAI;
        let model;

        // Função para inicializar o Gemini
        async function initializeGemini() {
             try {
                 // **** USA O import() DINÂMICO ****
                 const { GoogleGenerativeAI } = await import('https://esm.run/@google/generative-ai');
                 if (!GoogleGenerativeAI) throw new Error("Classe GoogleGenerativeAI não encontrada.");
                 if (!API_KEY || API_KEY === "COLE_SUA_CHAVE_API_COMPLETA_AQUI") throw new Error("API Key inválida!");
                 genAI = new GoogleGenerativeAI(API_KEY);
                 model = genAI.getGenerativeModel({ model: "gemini-pro" });
                 console.log("DEBUG: SDK Gemini carregado e inicializado.");
                 chatInput.disabled = false;
                 enviarChatBtn.disabled = false;
                 chatInput.placeholder = "Digite sua mensagem...";
                 const initMsg = document.getElementById('loading-message'); // Procura msg de loading
                 if (initMsg) initMsg.remove(); // Remove
            } catch (error) {
                 console.error("Erro CRÍTICO ao carregar ou inicializar o SDK:", error);
                 adicionarMensagem(`Erro ao carregar IA: ${error.message}`, "ia");
                 chatInput.disabled = true;
                 enviarChatBtn.disabled = true;
                 chatInput.placeholder = "IA indisponível";
                 const initMsg = document.getElementById('loading-message');
                 if (initMsg) initMsg.remove();
            }
        }

        // Função para adicionar mensagens
        function adicionarMensagem(texto, tipo = "ia", isLoading = false) {
             const divMensagem = document.createElement('div');
             divMensagem.classList.add('mensagem', tipo);
             if (isLoading) { divMensagem.classList.add('loading'); divMensagem.id = 'loading-message'; }
             divMensagem.textContent = texto;
             chatCorpo.appendChild(divMensagem);
             chatCorpo.scrollTop = chatCorpo.scrollHeight;
        }

        // Função principal para enviar mensagem (com logs)
        async function enviarMensagem() {
            console.log("DEBUG: Função enviarMensagem FOI CHAMADA!");
            const mensagemUsuario = chatInput.value.trim();
            if (mensagemUsuario === "" || !model) {
                 if(!model) console.error("DEBUG: ERRO - Modelo Gemini não carregado!");
                 else console.log("DEBUG: Mensagem vazia, não enviando.");
                 if (model && enviarChatBtn) enviarChatBtn.disabled = false;
                 return;
            }
            adicionarMensagem(mensagemUsuario, "usuario");
            chatInput.value = "";
            enviarChatBtn.disabled = true;
            adicionarMensagem("Digitando", "ia", true);
            try {
                console.log("DEBUG: PREPARANDO para enviar para Gemini:", mensagemUsuario);
                const result = await model.generateContent(mensagemUsuario);
                console.log("DEBUG: Resposta BRUTA do Gemini recebida:", result);
                const response = result?.response;
                if (!response) throw new Error("Resposta da API vazia.");
                const textoResposta = response?.text();
                if (textoResposta === undefined || textoResposta === null) throw new Error("Texto da resposta vazio.");
                console.log("DEBUG: Texto extraído:", textoResposta.substring(0, 50) + "...");
                const loadingMsg = document.getElementById('loading-message');
                if (loadingMsg) loadingMsg.remove();
                adicionarMensagem(textoResposta, "ia");
            } catch (error) {
                 console.error("DEBUG: ERRO CAPTURADO no catch:", error);
                 const loadingMsg = document.getElementById('loading-message');
                 if (loadingMsg) loadingMsg.remove();
                 adicionarMensagem(`Desculpe, ocorreu um erro: ${error.message || 'Erro desconhecido'}`, "ia");
            } finally {
                 console.log("DEBUG: Bloco finally executado.");
                 enviarChatBtn.disabled = false;
                 if(chatInput) chatInput.focus();
            }
        }

        // Inicialização e Event Listeners
        chatInput.placeholder = "Inicializando IA...";
        chatInput.disabled = true;
        enviarChatBtn.disabled = true;
        adicionarMensagem("Inicializando IA...", "ia", true); // Mensagem inicial de loading
        initializeGemini(); // Chama a inicialização

        // Listener de clique com log
        enviarChatBtn.addEventListener('click', function() {
            console.log("DEBUG: Botão ENVIAR foi CLICADO!");
            enviarMensagem();
        });
        // Listener de Enter
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log("DEBUG: Tecla ENTER pressionada!");
                enviarMensagem();
            }
        });
        console.log("DEBUG: Event listeners de envio adicionados.");

    } else {
        console.log("DEBUG: Elementos do Chat NÃO encontrados nesta página.");
    }
}); // Fim do DOMContentLoaded para o Chatbot


// =======================================================
//     LÓGICA DO BOTÃO "SAIR" (LOGOUT)
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() {
    // ... (código do logout continua igual) ...
});