// Comentário para forçar deploy v16 - Voltando ao estado funcional (sem chat send)
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
    const saudacaoTitulo = document.querySelector('.banner-destaque h2');
    if (saudacaoTitulo) { /* ... (código da saudação) ... */ }
    const menuItens = document.querySelectorAll('.menu-navegacao ul li');
    if (menuItens) { /* ... (código do menu) ... */ }
    // ... (outros scripts da inicial.html) ...
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
                if (!file || !file.type.startsWith("image/")) {
                    alert("Por favor, anexe uma imagem (JPG ou PNG).");
                    return;
                }
                iaStatus.innerText = "Preparando IA...";
                btnProcessarIA.disabled = true;
                textoExtraidoIA.value = "";
                try {
                    const workerPath = 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js';
                    const langPath = 'https://tessdata.projectnaptha.com/4.0.0';
                    const worker = await Tesseract.createWorker('por', 1, {
                         workerPath: workerPath,
                         langPath: langPath,
                         gzip: false,
                         logger: m => {
                              console.log(m);
                             if(m.status === 'recognizing text') {
                                iaStatus.innerText = `Lendo ${m.progress === 1 ? 'concluído' : `(${Math.round(m.progress * 100)}%)`}...`;
                             } else if (m.status === 'loading language traineddata') {
                                 iaStatus.innerText = `Baixando idioma (${Math.round(m.progress * 100)}%)...`;
                             } else {
                                 iaStatus.innerText = m.status;
                             }
                          }
                    });
                    iaStatus.innerText = "Lendo imagem...";
                    const { data: { text } } = await worker.recognize(file);
                    textoExtraidoIA.value = text;
                    iaStatus.innerText = "Leitura concluída!";
                    await worker.terminate();
                } catch (error) {
                     console.error("Erro no Tesseract:", error);
                     iaStatus.innerText = "Erro ao ler a imagem.";
                     alert("Ocorreu um erro ao processar a imagem.");
                } finally {
                    btnProcessarIA.disabled = false;
                }
            });
        }

        // Lógica Botão Salvar
        btnSalvar.addEventListener('click', function() {
            const nome = nomeArquivoInput.value;
            const local = localizacaoInput.value;
            const tipo = tipoArquivoInput.value;
            const textoIA = textoExtraidoIA.value; // Pega o texto da IA
            if (!nome || !local) { alert("Preencha Nome e Localização!"); return; }
            btnSalvar.innerText = "Salvando...";
            btnSalvar.disabled = true;
            salvarNoBanco(nome, local, tipo, textoIA); // Passa o texto da IA
        });

        // Função salvarNoBanco (Salva textoExtraido)
        function salvarNoBanco(nome, local, tipo, textoIA) {
            console.log("Salvando no REALTIME DATABASE (com texto da IA)...");
            btnSalvar.innerText = "Salvando dados...";
            const arquivosRef = db.ref('arquivos');
            arquivosRef.push({
                nome: nome,
                localizacao: local,
                tipo: tipo,
                dataCadastro: firebase.database.ServerValue.TIMESTAMP,
                anexoUrl: null, // Não salvamos mais anexo
                textoExtraido: textoIA || null // Salva o texto da IA
            })
            .then((snapshot) => {
                const docId = snapshot.key;
                console.log("Documento salvo com ID: ", docId);
                nomeArquivoInput.value = "";
                localizacaoInput.value = "";
                if(arquivoUploadInput) arquivoUploadInput.value = null; // Limpa input file
                if(textoExtraidoIA) textoExtraidoIA.value = ""; // Limpa campo IA
                if(iaStatus) iaStatus.innerText = ""; // Limpa status IA
                qrcodeDiv.innerHTML = "";
                const urlParaQR = `${window.location.origin}/arquivo.html?id=${docId}`; // URL relativa
                new QRCode(qrcodeDiv, { text: urlParaQR, width: 150, height: 150 });
                alert("Arquivo salvo com sucesso!");
                btnSalvar.innerText = "Salvar e Gerar QR Code";
                btnSalvar.disabled = false;
            })
            .catch((error) => {
                console.error("Erro ao salvar documento: ", error);
                btnSalvar.innerText = "Salvar e Gerar QR Code";
                btnSalvar.disabled = false;
            });
        }
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
        // ... (código para montar lista continua igual) ...
        const arquivosRef = db.ref('arquivos');
        arquivosRef.once('value', (snapshot) => {
             const dados = snapshot.val();
             containerDaLista.innerHTML = "";
             if (dados) {
                 Object.keys(dados).forEach(key => {
                     const arquivo = dados[key];
                     const itemHtml = `...`; // Seu HTML da lista aqui
                     containerDaLista.innerHTML += itemHtml;
                 });
             } else {
                 containerDaLista.innerHTML = "<p>Nenhum arquivo cadastrado.</p>";
             }
        }).catch((error) => { console.error("Erro lista:", error); });
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
        // ... (código pegar ID) ...
        const params = new URLSearchParams(window.location.search);
        const arquivoId = params.get('id');
        if (!arquivoId) { /* ... (erro ID) ... */ return; }

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

        // Busca Dados (inclui anexo Base64 e texto IA)
        const arquivoRef = db.ref('arquivos/' + arquivoId);
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
        console.log("DEBUG: Elementos do Chat encontrados (DOMContentLoaded). Iniciando lógica Gemini.");
        // --- Lógica da Conexão Gemini ---
        const API_KEY = "AIzaSyDmrqBe2d5vHpYH95a9Zb-YAdL4Tl0TTrc"; // COLE SUA CHAVE AQUI!!!
        console.log("DEBUG: Usando API Key começando com:", API_KEY.substring(0, 8) + "...");

        let genAI;
        let model;

        async function initializeGemini() { /* ... (código igual, com import() e model="gemini-pro") ... */ }
        function adicionarMensagem(texto, tipo = "ia", isLoading = false) { /* ... (código igual) ... */ }
        async function enviarMensagem() {
             console.log("DEBUG: Função enviarMensagem FOI CHAMADA!"); // Log
             const mensagemUsuario = chatInput.value.trim();
             // ... (resto da função igual, com logs detalhados) ...
         }

        // Inicialização e Event Listeners
        chatInput.placeholder = "Inicializando IA...";
        chatInput.disabled = true;
        enviarChatBtn.disabled = true;
        initializeGemini().then(() => { /* ... */ });

        // **** LISTENER COM LOG ****
        enviarChatBtn.addEventListener('click', function() {
            console.log("DEBUG: Botão ENVIAR foi CLICADO!"); // Log
            enviarMensagem(); // Chama a função
        });
        chatInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') enviarMensagem(); });
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
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        console.log("DEBUG: Botão Logout encontrado.");
        btnLogout.addEventListener('click', function(e) { /* ... (código do logout) ... */ });
    } else {
         console.log("DEBUG: Botão Logout NÃO encontrado.");
    }
});