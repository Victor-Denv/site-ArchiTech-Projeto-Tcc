// Comentário para forçar deploy v6
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
auth.onAuthStateChanged(function(user) { /* ... (código continua igual) ... */ });

//----- SCRIPT DA TELA DE CARREGAMENTO -----
window.addEventListener('load', () => { /* ... (código continua igual) ... */ });
//----- FIM DO SCRIPT DA TELA DE CARREGAMENTO -----

// --- SCRIPT ORIGINAL DA PÁGINA (inicial.html) ---
window.addEventListener('load', () => { /* ... (código continua igual) ... */ });

// =======================================================
//     LÓGICA DA PÁGINA 'automacao.html' (IA SÓ PARA IMAGEM)
// =======================================================
window.addEventListener('load', function() { /* ... (código continua igual) ... */ });

// =======================================================
//     LÓGICA DA PÁGINA 'listar.html'
// =======================================================
// **** CORREÇÃO: Usando window.load ****
window.addEventListener('load', function() {
    const containerDaLista = document.getElementById('containerDaLista');
    if (containerDaLista) {
        console.log("DEBUG: Iniciando lógica da página listar.html.");
        const arquivosRef = db.ref('arquivos');
        arquivosRef.once('value', (snapshot) => {
             console.log("DEBUG: Busca de lista concluída.");
             const dados = snapshot.val();
             containerDaLista.innerHTML = ""; // Limpa antes
             if (dados) {
                 console.log("DEBUG: Montando lista...");
                 Object.keys(dados).forEach(key => { /* ... (monta itemHtml) ... */ containerDaLista.innerHTML += itemHtml; });
                 console.log("DEBUG: Lista montada.");
             } else {
                 console.log("DEBUG: Nenhum arquivo encontrado.");
                 containerDaLista.innerHTML = "<p>Nenhum arquivo cadastrado.</p>";
             }
        }).catch((error) => { console.error("DEBUG: Erro ao buscar lista:", error); });
    }
});

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (QR CODE REAL e TEXTO IA)
// =======================================================
window.addEventListener('load', function() {
    const nomeDisplay = document.getElementById('nomeArquivoDisplay');
    if (nomeDisplay) {
        console.log("Página arquivo.html: buscando ID...");
        const params = new URLSearchParams(window.location.search);
        const arquivoId = params.get('id');
        if (!arquivoId) { /* ... (erro ID) ... */ return; }
        console.log("ID encontrado:", arquivoId);

        // **** CORREÇÃO: GERA QR CODE REAL ****
        const qrcodeDetalhesDiv = document.getElementById('qrcodeDetalhes');
        if (qrcodeDetalhesDiv) {
            const urlAtual = window.location.href;
            qrcodeDetalhesDiv.innerHTML = ""; // Limpa a div
            try {
                new QRCode(qrcodeDetalhesDiv, { text: urlAtual, width: 128, height: 128 });
                console.log("QR Code gerado para:", urlAtual);
            } catch (error) { console.error("Erro ao gerar QR Code:", error); }
        } else { console.error("DEBUG: Div 'qrcodeDetalhes' NÃO encontrada!"); }
        // **** FIM DA CORREÇÃO ****

        const arquivoRef = db.ref('arquivos/' + arquivoId);
        // Busca Dados (inclui anexo Base64 e texto IA)
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
window.addEventListener('load', function() {
    // --- Elementos do Chat ---
    const chatInput = document.getElementById('chatInput');
    const enviarChatBtn = document.getElementById('enviarChatBtn');
    const chatCorpo = document.getElementById('chatCorpo');
    const chatJanela = document.getElementById('chatJanela');

    if (chatJanela && chatInput && enviarChatBtn && chatCorpo) {
        console.log("DEBUG: Elementos do Chat encontrados. Iniciando lógica Gemini.");

        // --- Lógica da Conexão Gemini ---
        // **** !!!!! COLOQUE SUA API KEY REAL AQUI !!!!! ****
        const API_KEY = "AIzaSyDmrqBe2d5vHpYH95a9Zb-YAdL4Tl0TTrc"; 
        // **** !!!!! COLOQUE SUA API KEY REAL AQUI !!!!! ****
        
        console.log("DEBUG: Usando API Key começando com:", API_KEY.substring(0, 8) + "..."); // Mostra só o começo por segurança

        let genAI;
        let model;

        async function initializeGemini() {
             try {
                 const { GoogleGenerativeAI } = await import('https://esm.run/@google/generative-ai');
                 if (!GoogleGenerativeAI) throw new Error("Classe GoogleGenerativeAI não encontrada.");
                 genAI = new GoogleGenerativeAI(API_KEY);
                 model = genAI.getGenerativeModel({ model: "gemini-pro" });
                 console.log("DEBUG: SDK Gemini carregado e inicializado.");
                 chatInput.disabled = false;
                 enviarChatBtn.disabled = false;
                 chatInput.placeholder = "Digite sua mensagem...";
            } catch (error) {
                 console.error("Erro CRÍTICO ao carregar ou inicializar o SDK:", error);
                 adicionarMensagem("Erro: Não foi possível carregar a IA.", "ia");
                 chatInput.disabled = true;
                 enviarChatBtn.disabled = true;
                 chatInput.placeholder = "IA indisponível";
            }
        }

        function adicionarMensagem(texto, tipo = "ia", isLoading = false) {
             const divMensagem = document.createElement('div');
             divMensagem.classList.add('mensagem', tipo);
             if (isLoading) { divMensagem.classList.add('loading'); divMensagem.id = 'loading-message'; }
             divMensagem.textContent = texto; // Usar textContent
             chatCorpo.appendChild(divMensagem);
             chatCorpo.scrollTop = chatCorpo.scrollHeight;
        }

        async function enviarMensagem() {
             const mensagemUsuario = chatInput.value.trim();
            if (mensagemUsuario === "" || !model) {
                 if(!model) console.error("DEBUG: Modelo Gemini não carregado.");
                 return;
            }
            adicionarMensagem(mensagemUsuario, "usuario");
            chatInput.value = "";
            enviarChatBtn.disabled = true;
            adicionarMensagem("Digitando", "ia", true);
            try {
                console.log("DEBUG: Enviando para Gemini:", mensagemUsuario);
                const result = await model.generateContent(mensagemUsuario);
                const response = await result.response;
                const textoResposta = response.text();
                console.log("DEBUG: Resposta do Gemini recebida.");
                const loadingMsg = document.getElementById('loading-message');
                if (loadingMsg) loadingMsg.remove();
                adicionarMensagem(textoResposta, "ia");
            } catch (error) {
                 console.error("Erro ao gerar conteúdo:", error);
                 const loadingMsg = document.getElementById('loading-message');
                 if (loadingMsg) loadingMsg.remove();
                 adicionarMensagem("Desculpe, ocorreu um erro.", "ia");
            } finally {
                enviarChatBtn.disabled = false;
                if(chatInput) chatInput.focus();
            }
        }

        // Inicialização e Event Listeners
        chatInput.placeholder = "Inicializando IA...";
        chatInput.disabled = true;
        enviarChatBtn.disabled = true;
        initializeGemini().then(() => {
            if (!model) { /* Mantém desabilitado se falhou */ }
            // Saudação inicial já está no HTML
        });
        enviarChatBtn.addEventListener('click', enviarMensagem);
        chatInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') enviarMensagem(); });
        console.log("DEBUG: Event listeners de envio adicionados.");

    } else {
        console.log("DEBUG: Elementos do Chat NÃO encontrados nesta página.");
    }
}); // Fim do window.load para o Chatbot


// =======================================================
//     LÓGICA DO BOTÃO "SAIR" (LOGOUT)
// =======================================================
// **** CORREÇÃO: Usando window.load ****
window.addEventListener('load', function() {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        console.log("DEBUG: Botão Logout encontrado.");
        btnLogout.addEventListener('click', function(e) {
             e.preventDefault();
             console.log("Usuário clicou em Sair...");
             auth.signOut().then(() => {
                 console.log("Logout feito com sucesso.");
                 window.location.href = "index.html";
             }).catch((error) => {
                 console.error("Erro no logout:", error);
             });
        });
    } else {
         console.log("DEBUG: Botão Logout NÃO encontrado nesta página.");
    }
});