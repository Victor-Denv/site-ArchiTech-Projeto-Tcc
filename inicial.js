// Comentário para forçar deploy v19 - FINAL Chat DOMContentLoaded
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
window.addEventListener('load', () => { /* ... (código loading continua igual) ... */ });
//----- FIM DO SCRIPT DA TELA DE CARREGAMENTO -----

// --- SCRIPT ORIGINAL DA PÁGINA (inicial.html) ---
// **** Usando window.load como estava funcionando antes ****
window.addEventListener('load', () => { /* ... (código scripts inicial.html continua igual) ... */ });

// =======================================================
//     LÓGICA DA PÁGINA 'automacao.html' (IA SÓ PARA IMAGEM)
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() { /* ... (código automacao.html continua igual) ... */ });

// =======================================================
//     LÓGICA DA PÁGINA 'listar.html'
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() { /* ... (código listar.html continua igual) ... */ });

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (COM QR CODE e TEXTO IA)
// =======================================================
// **** Usando DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() { /* ... (código arquivo.html continua igual) ... */ });

// =======================================================
//     LÓGICA COMPLETA DO CHATBOT DATALIA (SEMPRE VISÍVEL - CORREÇÃO DOMContentLoaded)
// =======================================================
// **** CORREÇÃO AQUI: Voltando para DOMContentLoaded ****
document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos do Chat ---
    const chatInput = document.getElementById('chatInput');
    const enviarChatBtn = document.getElementById('enviarChatBtn');
    const chatCorpo = document.getElementById('chatCorpo');
    const chatJanela = document.getElementById('chatJanela');

    if (chatJanela && chatInput && enviarChatBtn && chatCorpo) {
        console.log("DEBUG: Elementos do Chat encontrados (DOMContentLoaded). Iniciando lógica Gemini.");

        // --- Lógica da Conexão Gemini ---
        // **** !!!!! COLOQUE SUA API KEY REAL AQUI !!!!! ****
        const API_KEY = "COLE_SUA_CHAVE_API_COMPLETA_AQUI"; 
        // **** !!!!! COLOQUE SUA API KEY REAL AQUI !!!!! ****
        console.log("DEBUG: Usando API Key começando com:", API_KEY.substring(0, 8) + "...");

        let genAI;
        let model;

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
                 const initMsg = document.getElementById('init-message');
                 if (initMsg) initMsg.remove();
            } catch (error) { /* ... (tratamento erro SDK) ... */ }
        }

        function adicionarMensagem(texto, tipo = "ia", isLoading = false) { /* ... (código igual) ... */ }
        async function enviarMensagem() {
             console.log("DEBUG: Função enviarMensagem FOI CHAMADA!");
             // ... (resto da função igual, com logs) ...
         }

        // Inicialização e Event Listeners
        chatInput.placeholder = "Inicializando IA...";
        chatInput.disabled = true;
        enviarChatBtn.disabled = true;
        // Adiciona mensagem inicial de loading
        adicionarMensagem("Inicializando IA...", "ia", true); 
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
document.addEventListener('DOMContentLoaded', function() { /* ... (código logout continua igual) ... */ });