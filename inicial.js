// Comentário para forçar deploy v24 - FINAL SEM CHATBOT
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
// **** Usando window.load ****
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
            console.log("DEBUG: Botão Processar IA encontrado.");
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
                         logger: m => { /* ... (logger do tesseract) ... */ }
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
        } else { console.log("DEBUG: Botão Processar IA NÃO encontrado."); }

        // Lógica Botão Salvar
        btnSalvar.addEventListener('click', function() {
            const nome = nomeArquivoInput.value;
            const local = localizacaoInput.value;
            const tipo = tipoArquivoInput.value;
            const textoIA = textoExtraidoIA ? textoExtraidoIA.value : null; // Pega texto da IA se existir
            if (!nome || !local) { alert("Preencha Nome e Localização!"); return; }
            btnSalvar.innerText = "Salvando...";
            btnSalvar.disabled = true;
            salvarNoBanco(nome, local, tipo, textoIA);
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
                anexoUrl: null, // Não usamos mais
                textoExtraido: textoIA || null // Salva texto da IA
            })
            .then((snapshot) => {
                const docId = snapshot.key;
                console.log("Documento salvo com ID: ", docId);
                nomeArquivoInput.value = "";
                localizacaoInput.value = "";
                if(arquivoUploadInput) arquivoUploadInput.value = null;
                if(textoExtraidoIA) textoExtraidoIA.value = "";
                if(iaStatus) iaStatus.innerText = "";
                qrcodeDiv.innerHTML = "";
                const urlParaQR = `${window.location.origin}/arquivo.html?id=${docId}`;
                new QRCode(qrcodeDiv, { text: urlParaQR, width: 150, height: 150 });
                alert("Arquivo salvo com sucesso!");
                btnSalvar.innerText = "Salvar e Gerar QR Code";
                btnSalvar.disabled = false;
            })
            .catch((error) => { /* ... (tratamento erro salvar) ... */ });
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
        // Gera QR Code
        const qrcodeDetalhesDiv = document.getElementById('qrcodeDetalhes');
        if (qrcodeDetalhesDiv) { /* ... (código gerar QR Code real) ... */ }
        // Busca Dados (inclui texto IA)
        const arquivoRef = db.ref('arquivos/' + arquivoId);
        arquivoRef.on('value', (snapshot) => { /* ... (código mostrar dados E texto IA) ... */ });
        // Botão Atualizar Localização
        const btnAtualizar = document.getElementById('btnAtualizarLocal');
        if(btnAtualizar) { /* ... */ }
        // Botão "+ Adicionar Novo Arquivo"
        const btnIrParaCadastro = document.getElementById('btnIrParaCadastro');
        if(btnIrParaCadastro) { /* ... */ }
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