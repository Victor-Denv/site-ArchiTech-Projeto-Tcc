// Comentário para forçar deploy v15 - TESTE LOADING RADICAL
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
const storage = firebase.storage(); // Mantém definição
const db = firebase.database();     // Mantém definição
const auth = firebase.auth();       // Mantém definição
console.log("Firebase Conectado com SUCESSO a partir do inicial.js!");

// =======================================================
//     O "SEGURANÇA" (PROTETOR DE PÁGINA) - MANTÉM ATIVO
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


//----- SCRIPT DA TELA DE CARREGAMENTO (Usa window.load) - MANTÉM ATIVO -----
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


/* // --- SCRIPT ORIGINAL DA PÁGINA (inicial.html) --- COMENTADO
document.addEventListener('DOMContentLoaded', () => {
    // ... (código da saudação, menu, etc.) ...
});
*/

/* // =======================================================
//     LÓGICA DA PÁGINA 'automacao.html' - COMENTADO
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    // ... (código da IA, salvar, etc.) ...
});
*/

/* // =======================================================
//     LÓGICA DA PÁGINA 'listar.html' - COMENTADO
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    // ... (código da lista) ...
});
*/

/* // =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' - COMENTADO
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    // ... (código detalhes, QR Code, etc.) ...
});
*/

/* // =======================================================
//     LÓGICA COMPLETA DO CHATBOT DATALIA - COMENTADO
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    // ... (código chatbot, Gemini API) ...
});
*/

/* // =======================================================
//     LÓGICA DO BOTÃO "SAIR" (LOGOUT) - COMENTADO
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    // ... (código logout) ...
});
*/