// Comentário apenas para forçar novo deploy v2
const firebaseConfig = {
  apiKey: "AIzaSyCPym-OjXGXY7IhA1u3DDPIOPi5tECDhR8", // Use sua chave real aqui
  authDomain: "architeck-e92b4.firebaseapp.com",
  databaseURL: "https://architeck-e92b4-default-rtdb.firebaseio.com/",
  projectId: "architeck-e92b4",
  storageBucket: "architeck-e92b4.firebasestorage.app",
  messagingSenderId: "97992394607", // Use seu senderId real aqui
  appId: "1:97992394607:web:130d060bdfff02d8474a9a", // Use seu appId real aqui
  measurementId: "G-N7T7B468Z9"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Deixa o banco de dados (db) e o storage prontos para usar
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
        if (isLoginPage) {
            window.location.href = "inicial.html";
        }
    } else {
        if (!isLoginPage) {
            window.location.href = "index.html";
        }
    }
});

//----- SCRIPT DA TELA DE CARREGAMENTO -----
window.addEventListener('load', () => {
    const splashScreen = document.getElementById("splash-screen");
    const mainContent = document.getElementById("main-content");
    if (splashScreen && mainContent) {
        const splashScreenTime = 1000;
        setTimeout(() => {
            if (splashScreen) { // Verifica se ainda existe antes de mexer
                splashScreen.classList.add("hidden");
                splashScreen.addEventListener("transitionend", () => {
                    if (splashScreen) { splashScreen.remove(); }
                    if (mainContent) mainContent.style.display = "grid";
                }, { once: true });
            } else if(mainContent) { // Se splash já sumiu, só mostra o conteúdo
                 mainContent.style.display = "grid";
            }
        }, splashScreenTime);
    } else if (mainContent){ // Se não tem splash, mostra conteúdo direto
         mainContent.style.display = "grid";
    }
});
//----- FIM DO SCRIPT DA TELA DE CARREGAMENTO -----

// --- SCRIPT ORIGINAL DA PÁGINA (inicial.html) ---
window.addEventListener('load', () => {
    const saudacaoTitulo = document.querySelector('.banner-destaque h2');
    if (saudacaoTitulo) { /* ... (código da saudação) ... */ }
    const menuItens = document.querySelectorAll('.menu-navegacao ul li');
    if (menuItens) { /* ... (código do menu) ... */ }
    // ... (outros scripts da inicial.html) ...
});

// =======================================================
//     LÓGICA DA PÁGINA 'automacao.html' (COM IA SÓ PARA IMAGEM - PDF REMOVIDO)
// =======================================================
window.addEventListener('load', function() {
    const btnSalvar = document.getElementById('btnSalvarArquivo');
    if (btnSalvar) {
        // Pega elementos
        const nomeArquivoInput = document.getElementById('nomeArquivo');
        const localizacaoInput = document.getElementById('localizacaoArquivo');
        const tipoArquivoInput = document.getElementById('tipoArquivo');
        const qrcodeDiv = document.getElementById('qrcode');
        const arquivoUploadInput = document.getElementById('arquivoUpload');
        const btnProcessarIA = document.getElementById('btnProcessarIA');
        const textoExtraidoIA = document.getElementById('textoExtraidoIA');
        const iaStatus = document.getElementById('iaStatus');

        // Lógica Botão IA (SÓ IMAGEM)
        if (btnProcessarIA) {
            btnProcessarIA.addEventListener('click', async function() {
                const file = arquivoUploadInput.files[0];
                if (!file || !file.type.startsWith("image/")) { // Só aceita imagem
                    alert("Por favor, anexe uma imagem (JPG ou PNG).");
                    return;
                }
                iaStatus.innerText = "Preparando IA...";
                btnProcessarIA.disabled = true;
                textoExtraidoIA.value = "";
                try {
                    const workerPath = 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js';
                    const langPath = 'https://tessdata.projectnaptha.com/4.0.0';
                    const worker = await Tesseract.createWorker('por', 1, { /* ... (config tesseract) ... */ });
                    iaStatus.innerText = "Lendo imagem...";
                    const { data: { text } } = await worker.recognize(file);
                    textoExtraidoIA.value = text;
                    iaStatus.innerText = "Leitura concluída!";
                    await worker.terminate();
                } catch (error) { /* ... (tratamento de erro) ... */ }
                finally { btnProcessarIA.disabled = false; }
            });
        }

        // Lógica Botão Salvar
        btnSalvar.addEventListener('click', function() { /* ... (código continua igual, salva textoIA) ... */ });

        // Função salvarNoBanco
        function salvarNoBanco(nome, local, tipo, textoIA) { /* ... (código continua igual) ... */ }
    }
});


// =======================================================
//     LÓGICA DA PÁGINA 'listar.html'
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const containerDaLista = document.getElementById('containerDaLista');
    if (containerDaLista) {
        // ... (código da lista continua aqui) ...
    }
});

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (COM QR CODE e CORREÇÃO CELULAR)
// =======================================================
window.addEventListener('load', function() {
    const nomeDisplay = document.getElementById('nomeArquivoDisplay');
    if (nomeDisplay) {
        // ... (código da página de detalhes continua aqui, incluindo gerar QR Code) ...

         // **** NOVO: MOSTRAR TEXTO DA IA (SE EXISTIR) ****
         const textoIADisplayContainer = document.getElementById('textoExtraidoIADisplayContainer'); // Precisa criar essa div no HTML
         if (textoIADisplayContainer) {
             const textoIADisplay = document.getElementById('textoExtraidoIADisplay'); // E um <pre> ou <span> dentro dela
             if (data && data.textoExtraido && textoIADisplay) {
                 textoIADisplay.textContent = data.textoExtraido; // Usar textContent
                 textoIADisplayContainer.style.display = 'block'; // Mostra a seção
             } else if (textoIADisplayContainer) {
                 textoIADisplayContainer.style.display = 'none'; // Esconde se não houver texto
             }
         }
         // **** FIM DO NOVO ****
    }
});

// =======================================================
//     LÓGICA DO CHATBOT DATALIA (COM MODELO CORRIGIDO)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    const enviarChatBtn = document.getElementById('enviarChatBtn');
    const chatCorpo = document.getElementById('chatCorpo');

    if (chatInput && enviarChatBtn && chatCorpo) {
        const API_KEY = "AIzaSy...(sua chave completa)..."; // COLE SUA CHAVE AQUI
        console.log("DEBUG: Usando API Key começando com:", API_KEY.substring(0, 8) + "...");

        let genAI;
        let model;

        async function initializeGemini() {
            try {
                 const { GoogleGenerativeAI } = await import('https://esm.run/@google/generative-ai');
                 if (!GoogleGenerativeAI) throw new Error("Classe GoogleGenerativeAI não encontrada.");

                 genAI = new GoogleGenerativeAI(API_KEY);
                 // **** CORREÇÃO FINAL DO MODELO ****
                 model = genAI.getGenerativeModel({ model: "gemini-pro" });
                 // **** FIM DA CORREÇÃO ****

                 console.log("DEBUG: SDK Gemini carregado e inicializado via import().");
                 chatInput.disabled = false;
                 enviarChatBtn.disabled = false;
                 chatInput.placeholder = "Digite sua mensagem...";

            } catch (error) { /* ... (tratamento de erro do SDK) ... */ }
        }

        function adicionarMensagem(texto, tipo = "ia", isLoading = false) { /* ... */ }

        async function enviarMensagem() {
            const mensagemUsuario = chatInput.value.trim();
            if (mensagemUsuario === "" || !model) { /* ... */ return; }

            adicionarMensagem(mensagemUsuario, "usuario");
            chatInput.value = "";
            enviarChatBtn.disabled = true;
            adicionarMensagem("Digitando", "ia", true);

            try {
                console.log("DEBUG: Enviando para Gemini:", mensagemUsuario);
                 const result = await model.generateContent(mensagemUsuario);
                 const response = await result.response;
                 const textoResposta = response.text();
                 console.log("DEBUG: Resposta do Gemini:", textoResposta);
                 // ... (remover loading, mostrar resposta) ...
            } catch (error) { /* ... (tratamento de erro da API) ... */ }
            finally { /* ... (habilitar botão) ... */ }
        }

        // ... (inicialização e event listeners) ...
        chatInput.placeholder = "Inicializando IA...";
        initializeGemini().then(() => { /* ... (remover loading inicial) ... */ });
        enviarChatBtn.addEventListener('click', enviarMensagem);
        chatInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') enviarMensagem(); });
    }
});


// =======================================================
//     LÓGICA DO BOTÃO "SAIR" (LOGOUT)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function(e) { /* ... (código do logout) ... */ });
    }
});