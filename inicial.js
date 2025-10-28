// Comentário apenas para forçar novo deploy v3
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

// Deixa o banco de dados (db) e o storage prontos para usar
const storage = firebase.storage(); // Mesmo não usando para upload, pode ser útil depois
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
            console.log("Usuário logado na página de login. Redirecionando para inicial.html...");
            window.location.href = "inicial.html";
        }
    } else {
        if (!isLoginPage) {
            console.log("Usuário NÃO está logado. Redirecionando para o login...");
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
            } else if(mainContent) {
                 mainContent.style.display = "grid";
            }
        }, splashScreenTime);
    } else if (mainContent){
         mainContent.style.display = "grid";
    }
});
//----- FIM DO SCRIPT DA TELA DE CARREGAMENTO -----


// --- SCRIPT ORIGINAL DA PÁGINA (inicial.html) ---
// **** CORREÇÃO: Usando window.load ****
window.addEventListener('load', () => {
    const saudacaoTitulo = document.querySelector('.banner-destaque h2');
    if (saudacaoTitulo) {
        const horaAtual = new Date().getHours();
        let saudacao = '';
        if (horaAtual >= 5 && horaAtual < 12) saudacao = 'Bom dia, Arquivista!!';
        else if (horaAtual >= 12 && horaAtual < 18) saudacao = 'Boa Tarde, Arquivista!!';
        else saudacao = 'Boa Noite, Arquivista!!';
        const textoOriginal = "Veja algumas das atualizações do nosso acervo enquanto você esteve fora...";
        saudacaoTitulo.textContent = `${saudacao} ${textoOriginal}`;
    }

    const menuItens = document.querySelectorAll('.menu-navegacao ul li');
    if (menuItens) {
        menuItens.forEach(item => {
            item.addEventListener('click', () => {
                const itemAtivoAtual = document.querySelector('.menu-navegacao li.ativo');
                if (itemAtivoAtual) itemAtivoAtual.classList.remove('ativo');
                item.classList.add('ativo');
            });
        });
    }

    const botaoSaibaMais = document.querySelector('.banner-destaque .botao-principal');
    if (botaoSaibaMais) botaoSaibaMais.addEventListener('click', () => alert('Funcionalidade "Saiba Mais" será implementada!'));
    const iconeNotificacoes = document.querySelector('.icones-cabecalho .fa-bell');
    if (iconeNotificacoes) iconeNotificacoes.addEventListener('click', () => alert('Notificações serão exibidas aqui!'));

    // Remover listener antigo do preview do chat se existir
    // const previewMensagem = document.querySelector('.preview-mensagem');
    // if (previewMensagem) { /* O listener está no bloco do chatbot agora */ }
});

// =======================================================
//     LÓGICA DA PÁGINA 'automacao.html' (IA SÓ PARA IMAGEM)
// =======================================================
window.addEventListener('load', function() {
    const btnSalvar = document.getElementById('btnSalvarArquivo');
    if (btnSalvar) { // Só roda na automacao.html
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
document.addEventListener('DOMContentLoaded', function() {
    const containerDaLista = document.getElementById('containerDaLista');
    if (containerDaLista) {
        console.log("DEBUG: Entrou na lógica da página listar.html.");
        const arquivosRef = db.ref('arquivos');
        console.log("DEBUG: Tentando buscar dados em /arquivos...");
        arquivosRef.once('value', (snapshot) => {
            console.log("DEBUG: Busca no Firebase concluída.");
            const dados = snapshot.val();
            console.log("DEBUG: Dados recebidos:", dados);
            containerDaLista.innerHTML = "";
            if (dados) {
                console.log("DEBUG: Dados encontrados. Montando lista...");
                Object.keys(dados).forEach(key => {
                    const arquivo = dados[key];
                    const itemHtml = `
                        <div class="item-lista-arquivo">
                            <div class="item-info">
                                <strong>Nome:</strong> ${arquivo.nome || 'Sem nome'} <br>
                                <strong>Local:</strong> ${arquivo.localizacao || 'Não informado'}
                            </div>
                            <div class="item-link">
                                <a href="arquivo.html?id=${key}" class="btn-detalhes">
                                    Ver Detalhes
                                </a>
                            </div>
                        </div>
                    `;
                    containerDaLista.innerHTML += itemHtml;
                });
                console.log("DEBUG: Lista montada com sucesso!");
            } else {
                console.log("DEBUG: Nenhum dado encontrado no Firebase.");
                containerDaLista.innerHTML = "<p>Nenhum arquivo cadastrado no sistema ainda.</p>";
            }
        }).catch((error) => {
            console.error("DEBUG: Erro ao buscar arquivos:", error);
            containerDaLista.innerHTML = "<p style='color: red;'>Erro ao carregar a lista.</p>";
        });
    }
});

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (COM QR CODE e CORREÇÃO CELULAR e TEXTO IA)
// =======================================================
window.addEventListener('load', function() {
    const nomeDisplay = document.getElementById('nomeArquivoDisplay');
    if (nomeDisplay) {
        console.log("Estamos na página arquivo.html, procurando ID...");
        const params = new URLSearchParams(window.location.search);
        const arquivoId = params.get('id');

        if (!arquivoId) {
             console.error("Nenhum ID de arquivo encontrado na URL!");
             const formCadastro = document.getElementById('formularioCadastro');
             if(formCadastro) formCadastro.innerHTML = "<h2>Erro: ID não encontrado na URL.</h2>";
             return;
        }
        console.log("ID encontrado:", arquivoId);

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

        const arquivoRef = db.ref('arquivos/' + arquivoId);

        // Busca Dados (incluindo texto da IA)
        arquivoRef.on('value', (snapshot) => {
            const data = snapshot.val();
            const anexoContainer = document.getElementById('anexoContainer');
            if(anexoContainer) anexoContainer.innerHTML = "";

            // Seleciona os elementos SÓ UMA VEZ para performance
            const localDisplay = document.getElementById('localizacaoAtualDisplay');
            const tipoDisplay = document.getElementById('tipoArquivoDisplay');
            const dataDisplay = document.getElementById('dataCadastroDisplay');
            const textoIADisplayContainer = document.getElementById('textoExtraidoIADisplayContainer'); // Precisa criar essa div no HTML
            const textoIADisplay = document.getElementById('textoExtraidoIADisplay'); // E um <pre> ou <span> dentro dela

            if (data) {
                console.log("Dados recebidos:", data);
                if(nomeDisplay) nomeDisplay.innerText = data.nome || 'Sem nome';
                if(localDisplay) localDisplay.innerText = data.localizacao || 'Não informado';
                if(tipoDisplay) tipoDisplay.innerText = data.tipo || 'Não informado';
                if(dataDisplay && data.dataCadastro) {
                     const dataCadastro = new Date(data.dataCadastro);
                     dataDisplay.innerText = dataCadastro.toLocaleString('pt-BR');
                } else if(dataDisplay) {
                     dataDisplay.innerText = 'Data indisponível';
                }

                // Anexo Base64 (Correção Celular)
                if (data.anexoUrl && anexoContainer) {
                    let nomeDoArquivo = data.nome || "anexo";
                    if (data.anexoUrl.startsWith("data:image/jpeg")) nomeDoArquivo += ".jpg";
                    else if (data.anexoUrl.startsWith("data:image/png")) nomeDoArquivo += ".png";
                    else if (data.anexoUrl.startsWith("data:application/pdf")) nomeDoArquivo += ".pdf";
                    anexoContainer.innerHTML = `<p style="margin-top: 15px;"><strong>Anexo:</strong> <a href="${data.anexoUrl}" download="${nomeDoArquivo}" class="item-link" style="display: inline-block; margin-left: 10px;"><button class="btn-detalhes" style="background-color: #007bff;">Baixar Anexo</button></a></p>`;
                }

                 // MOSTRAR TEXTO DA IA
                 if (textoIADisplayContainer) {
                     if (data.textoExtraido && textoIADisplay) {
                         textoIADisplay.textContent = data.textoExtraido;
                         textoIADisplayContainer.style.display = 'block';
                     } else {
                         textoIADisplayContainer.style.display = 'none';
                     }
                 }

            } else {
                console.error("Nenhum dado encontrado para este ID.");
                if(nomeDisplay) nomeDisplay.innerText = "Arquivo não encontrado.";
            }
        });

        // Botão Atualizar Localização
        const btnAtualizar = document.getElementById('btnAtualizarLocal');
        const novaLocalizacaoInput = document.getElementById('novaLocalizacaoInput');
        if(btnAtualizar && novaLocalizacaoInput){
            btnAtualizar.addEventListener('click', function() { /* ... (código continua igual) ... */ });
        }

        // Botão "+ Adicionar Novo Arquivo"
        const btnIrParaCadastro = document.getElementById('btnIrParaCadastro');
        if(btnIrParaCadastro){
            btnIrParaCadastro.addEventListener('click', function() { window.location.href = "automacao.html"; });
        }
    }
});

// =======================================================
//     LÓGICA COMPLETA DO CHATBOT DATALIA (SEMPRE VISÍVEL)
// =======================================================
window.addEventListener('load', function() {

    // --- Elementos do Chat (sem preview e fechar) ---
    const chatInput = document.getElementById('chatInput');
    const enviarChatBtn = document.getElementById('enviarChatBtn');
    const chatCorpo = document.getElementById('chatCorpo');
    const chatJanela = document.getElementById('chatJanela'); // Pegamos só para garantir que existe

    // --- Verifica se os elementos ESSENCIAIS do chat existem ---
    if (chatJanela && chatInput && enviarChatBtn && chatCorpo) {

        console.log("DEBUG: Elementos do Chat (sempre visível) encontrados. Iniciando lógica Gemini.");

        // --- Lógica da Conexão Gemini ---
        const API_KEY = "AIzaSyDmrqBe2d5vHpYH95a9Zb-YAdL4Tl0TTrc"; // COLE SUA CHAVE AQUI!!!
        // ... (resto do código da IA: initializeGemini, adicionarMensagem, enviarMensagem, listeners de envio) ...

    } else {
        console.log("DEBUG: Elementos do Chat NÃO encontrados nesta página.");
    }
}); // Fim do window.load para o Chatbot
        // --- Lógica da Conexão Gemini ---
        const API_KEY = "AIzaSyDmrqBe2d5vHpYH95a9Zb-YAdL4Tl0TTrc"; // COLE SUA CHAVE AQUI
        console.log("DEBUG: Usando API Key começando com:", API_KEY.substring(0, 8) + "...");

        let genAI;
        let model;

        async function initializeGemini() {
             try {
                 const { GoogleGenerativeAI } = await import('https://esm.run/@google/generative-ai');
                 if (!GoogleGenerativeAI) throw new Error("Classe GoogleGenerativeAI não encontrada.");
                 genAI = new GoogleGenerativeAI(API_KEY);
                 model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Garante gemini-pro
                 console.log("DEBUG: SDK Gemini carregado e inicializado.");
                 chatInput.disabled = false;
                 enviarChatBtn.disabled = false;
                 chatInput.placeholder = "Digite sua mensagem...";
            } catch (error) { /* ... (tratamento erro SDK) ... */ }
        }

        function adicionarMensagem(texto, tipo = "ia", isLoading = false) { /* ... */ }

        async function enviarMensagem() {
             const mensagemUsuario = chatInput.value.trim();
            if (mensagemUsuario === "" || !model) { return; }
            adicionarMensagem(mensagemUsuario, "usuario");
            chatInput.value = "";
            enviarChatBtn.disabled = true;
            adicionarMensagem("Digitando", "ia", true);
            try {
                const result = await model.generateContent(mensagemUsuario);
                const response = await result.response;
                const textoResposta = response.text();
                const loadingMsg = document.getElementById('loading-message');
                if (loadingMsg) loadingMsg.remove();
                adicionarMensagem(textoResposta, "ia");
            } catch (error) { /* ... (tratamento erro API) ... */ }
             finally { /* ... (habilitar botão) ... */ }
        }

        // Inicialização e Event Listeners
        chatInput.placeholder = "Inicializando IA...";
        chatInput.disabled = true;
        enviarChatBtn.disabled = true;
        initializeGemini().then(() => { /* ... (remover loading inicial) ... */ });
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
document.addEventListener('DOMContentLoaded', function() {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function(e) { /* ... (código do logout) ... */ });
    }
});