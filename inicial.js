// Comentário apenas para forçar novo deploy
const firebaseConfig = {
  apiKey: "AIzaSyCPym-OjXGXY7IhA1u3DDPIOPi5tECDhR8",
  authDomain: "architeck-e92b4.firebaseapp.com",
  databaseURL: "https://architeck-e92b4-default-rtdb.firebaseio.com/",
  projectId: "architeck-e92b4",
  storageBucket: "architeck-e92b4.firebasestorage.app",
  messagingSenderId: "97992394607",
  appId: "1:97992394607:web:130d060bdfff02d8474a9a",
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
            splashScreen.classList.add("hidden");
            splashScreen.addEventListener("transitionend", () => {
                if (splashScreen) { splashScreen.remove(); }
                mainContent.style.display = "grid";
            }, { once: true });
        }, splashScreenTime);
    }
});
//----- FIM DO SCRIPT DA TELA DE CARREGAMENTO -----


// --- SCRIPT ORIGINAL DA PÁGINA (inicial.html) ---
// **** CORREÇÃO AQUI: de 'DOMContentLoaded' para 'load' ****
window.addEventListener('load', () => {
    const saudacaoTitulo = document.querySelector('.banner-destaque h2');
    if (saudacaoTitulo) {
        const horaAtual = new Date().getHours();
        let saudacao = '';
        if (horaAtual >= 5 && horaAtual < 12) {
            saudacao = 'Bom dia, Arquivista!!';
        } else if (horaAtual >= 12 && horaAtual < 18) {
            saudacao = 'Boa Tarde, Arquivista!!';
        } else {
            saudacao = 'Boa Noite, Arquivista!!';
        }
        const textoOriginal = "Veja algumas das atualizações do nosso acervo enquanto você esteve fora...";
        saudacaoTitulo.textContent = `${saudacao} ${textoOriginal}`;
    }

    const menuItens = document.querySelectorAll('.menu-navegacao ul li');
    menuItens.forEach(item => {
        item.addEventListener('click', () => {
            const itemAtivoAtual = document.querySelector('.menu-navegacao li.ativo');
            if (itemAtivoAtual) {
                itemAtivoAtual.classList.remove('ativo');
            }
            item.classList.add('ativo');
        });
    });

    // ... (o resto dos seus scripts da página inicial, como 'botaoSaibaMais', etc.) ...
});

// =======================================================
//     LÓGICA DA PÁGINA 'automacao.html' (COM IA PARA PDF E IMAGEM - MÉTODO BLOB FINAL)
// =======================================================
window.addEventListener('load', function() {
    const btnSalvar = document.getElementById('btnSalvarArquivo');

    if (btnSalvar) {
        // Pega os elementos
        const nomeArquivoInput = document.getElementById('nomeArquivo');
        const localizacaoInput = document.getElementById('localizacaoArquivo');
        const tipoArquivoInput = document.getElementById('tipoArquivo');
        const qrcodeDiv = document.getElementById('qrcode');
        const arquivoUploadInput = document.getElementById('arquivoUpload');
        const btnProcessarIA = document.getElementById('btnProcessarIA');
        const textoExtraidoIA = document.getElementById('textoExtraidoIA');
        const iaStatus = document.getElementById('iaStatus');

        // **** CÓDIGO DO BOTÃO "PROCESSAR COM IA" (MÉTODO BLOB) ****
        if (btnProcessarIA) {
            // Importa o pdf.js como módulo
            import('//mozilla.github.io/pdf.js/build/pdf.mjs').then(async (pdfjsLib) => {
                // Configuração essencial para o pdf.js
                 pdfjsLib.GlobalWorkerOptions.workerSrc = `//mozilla.github.io/pdf.js/build/pdf.worker.mjs`;

                btnProcessarIA.addEventListener('click', async function() {
                    const file = arquivoUploadInput.files[0];
                    if (!file) {
                        alert("Por favor, anexe uma imagem (JPG/PNG) ou PDF primeiro.");
                        return;
                    }

                    console.log("Iniciando processamento...");
                    iaStatus.innerText = "Preparando IA...";
                    btnProcessarIA.disabled = true;
                    textoExtraidoIA.value = "";

                    try {
                        // Configuração Tesseract (com caminhos)
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
                             },
                        });

                        if (file.type.startsWith("image/")) {
                            // --- SE FOR IMAGEM ---
                            iaStatus.innerText = "Lendo imagem...";
                            const { data: { text } } = await worker.recognize(file);
                            textoExtraidoIA.value = text;
                            iaStatus.innerText = "Leitura concluída!";

                        } else if (file.type === "application/pdf") {
                            // --- SE FOR PDF (COM MÉTODO BLOB) ---
                            iaStatus.innerText = "Carregando PDF...";
                            const fileReader = new FileReader();
                            fileReader.readAsArrayBuffer(file);

                            fileReader.onload = async function() {
                                const pdfData = new Uint8Array(this.result);
                                const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
                                const numPages = pdfDoc.numPages;
                                let textoCompleto = "";

                                for (let i = 1; i <= numPages; i++) {
                                    iaStatus.innerText = `Processando página ${i} de ${numPages}...`;
                                    const page = await pdfDoc.getPage(i);
                                    const viewport = page.getViewport({ scale: 1.0 }); // Mantém escala 1.0

                                    const canvas = document.createElement('canvas');
                                    const context = canvas.getContext('2d');
                                    canvas.height = viewport.height;
                                    canvas.width = viewport.width;
                                    await page.render({ canvasContext: context, viewport: viewport }).promise;

                                    // **** USA O MÉTODO BLOB ****
                                    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                                    if (!blob) { throw new Error(`Falha ao converter canvas para Blob na página ${i}`); }

                                    iaStatus.innerText = `Lendo texto da página ${i}...`;
                                    // Manda o Blob para o Tesseract
                                    const { data: { text } } = await worker.recognize(blob); // Passa o Blob
                                    textoCompleto += text + "\n\n--- Fim da Página " + i + " ---\n\n";
                                }
                                textoExtraidoIA.value = textoCompleto;
                                iaStatus.innerText = "Leitura do PDF concluída!";
                            };
                            fileReader.onerror = function(error) { throw new Error("Erro ao ler o arquivo PDF."); }
                        } else {
                            alert("Formato não suportado. Use JPG, PNG ou PDF.");
                            iaStatus.innerText = "";
                            btnProcessarIA.disabled = false; // Resetar botão
                            return;
                        }
                        await worker.terminate();
                    } catch (error) {
                        console.error("Erro no processamento:", error);
                        iaStatus.innerText = "Erro durante o processamento.";
                        alert("Ocorreu um erro ao processar o arquivo. Verifique o console para detalhes.");
                         // Resetar botão mesmo em caso de erro
                    } finally {
                         btnProcessarIA.disabled = false;
                    }
                });
            }).catch(error => {
                console.error("Erro ao carregar pdf.js:", error);
                iaStatus.innerText = "Erro ao carregar biblioteca PDF.";
                if (btnProcessarIA) btnProcessarIA.disabled = true;
                alert("Não foi possível carregar a funcionalidade de leitura de PDF. Verifique sua conexão.");
            });
        }
        // **** FIM DO CÓDIGO DO BOTÃO "PROCESSAR COM IA" ****

        // Lógica do Botão "Salvar e Gerar QR Code"
        btnSalvar.addEventListener('click', function() {
            const nome = nomeArquivoInput.value;
            const local = localizacaoInput.value;
            const tipo = tipoArquivoInput.value;
            const textoIA = textoExtraidoIA.value;

            if (!nome || !local) {
                alert("Por favor, preencha o Nome e a Localização!");
                return;
            }

            console.log("Iniciando processo de salvar...");
            btnSalvar.innerText = "Salvando...";
            btnSalvar.disabled = true;

            salvarNoBanco(nome, local, tipo, textoIA);
        });

        // FUNÇÃO AUXILIAR PARA SALVAR NO BANCO
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
                textoExtraido: textoIA || null
            })
            .then((snapshot) => {
                const docId = snapshot.key;
                console.log("Documento salvo com ID: ", docId);

                nomeArquivoInput.value = "";
                localizacaoInput.value = "";
                arquivoUploadInput.value = null;
                textoExtraidoIA.value = "";
                iaStatus.innerText = "";

                qrcodeDiv.innerHTML = "";
                const urlParaQR = `https://site-archi-tech-projeto-tcc.vercel.app/arquivo.html?id=${docId}`;

                new QRCode(qrcodeDiv, { text: urlParaQR, width: 150, height: 150 });

                alert("Arquivo salvo com sucesso! Imprima o QR Code.");
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
                    // console.log("DEBUG: Adicionando item:", key, arquivo.nome);
                    const itemHtml = `
                        <div class="item-lista-arquivo">
                            <div class="item-info">
                                <strong>Nome:</strong> ${arquivo.nome} <br>
                                <strong>Local:</strong> ${arquivo.localizacao}
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
//     LÓGICA DA PÁGINA 'arquivo.html' (COM QR CODE e CORREÇÃO CELULAR)
// =======================================================
// **** MUDANÇA AQUI: de 'DOMContentLoaded' para 'load' ****
window.addEventListener('load', function() {
    const nomeDisplay = document.getElementById('nomeArquivoDisplay');

    if (nomeDisplay) { // Estamos na página arquivo.html
        console.log("Estamos na página arquivo.html, procurando ID...");
        const params = new URLSearchParams(window.location.search);
        const arquivoId = params.get('id');

        if (!arquivoId) {
            console.error("Nenhum ID de arquivo encontrado na URL!");
            document.getElementById('formularioCadastro').innerHTML = "<h2>Erro: ID não encontrado na URL.</h2>";
            return;
        }
        console.log("ID encontrado:", arquivoId);

        // **** CÓDIGO QUE GERA O QR CODE ****
        const qrcodeDetalhesDiv = document.getElementById('qrcodeDetalhes');
        if (qrcodeDetalhesDiv) {
            const urlAtual = window.location.href;
            qrcodeDetalhesDiv.innerHTML = "";
            try {
                new QRCode(qrcodeDetalhesDiv, {
                    text: urlAtual,
                    width: 128,
                    height: 128,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
                console.log("QR Code gerado para:", urlAtual);
            } catch (error) {
                console.error("Erro ao gerar QR Code:", error);
                if(qrcodeDetalhesDiv) qrcodeDetalhesDiv.innerHTML = "<p style='color:red; font-size:10px;'>Erro ao gerar QR Code.</p>";
            }
        } else {
             console.error("DEBUG: Div 'qrcodeDetalhes' NÃO encontrada no HTML!");
        }
        // **** FIM DO CÓDIGO DO QR CODE ****

        const arquivoRef = db.ref('arquivos/' + arquivoId);

        // BUSCAR OS DADOS
        arquivoRef.on('value', (snapshot) => {
            const data = snapshot.val();
            const anexoContainer = document.getElementById('anexoContainer');
            if(anexoContainer) anexoContainer.innerHTML = "";

            if (data) {
                console.log("Dados recebidos:", data);
                nomeDisplay.innerText = data.nome;
                document.getElementById('localizacaoAtualDisplay').innerText = data.localizacao;
                document.getElementById('tipoArquivoDisplay').innerText = data.tipo;
                const dataCadastro = new Date(data.dataCadastro);
                document.getElementById('dataCadastroDisplay').innerText = dataCadastro.toLocaleString('pt-BR');

                // CORREÇÃO PARA CELULAR (Baixar Anexo)
                if (data.anexoUrl && anexoContainer) { // anexoUrl agora é Base64
                    console.log("Anexo encontrado. Preparando para download.");
                    let nomeDoArquivo = data.nome || "anexo";
                    if (data.anexoUrl.startsWith("data:image/jpeg")) { nomeDoArquivo += ".jpg"; }
                    else if (data.anexoUrl.startsWith("data:image/png")) { nomeDoArquivo += ".png"; }
                    else if (data.anexoUrl.startsWith("data:application/pdf")) { nomeDoArquivo += ".pdf"; }

                    anexoContainer.innerHTML = `
                        <p style="margin-top: 15px;">
                            <strong>Anexo:</strong>
                            <a href="${data.anexoUrl}" download="${nomeDoArquivo}" class="item-link" style="display: inline-block; margin-left: 10px;">
                                <button class="btn-detalhes" style="background-color: #007bff;">
                                    Baixar Anexo
                                </button>
                            </a>
                        </p>
                    `;
                }

                 // **** NOVO: MOSTRAR TEXTO DA IA ****
                 const textoIADisplay = document.getElementById('textoExtraidoIADisplay'); // Precisamos criar essa div no HTML
                 if (textoIADisplay) {
                     if (data.textoExtraido) {
                         textoIADisplay.innerText = data.textoExtraido;
                         textoIADisplay.parentElement.style.display = 'block'; // Mostra a seção
                     } else {
                         textoIADisplay.parentElement.style.display = 'none'; // Esconde se não houver texto
                     }
                 }
                 // **** FIM DO NOVO ****


            } else {
                console.error("Nenhum dado encontrado para este ID.");
                nomeDisplay.innerText = "Arquivo não encontrado.";
            }
        });

        // Botão de ATUALIZAR LOCALIZAÇÃO
        const btnAtualizar = document.getElementById('btnAtualizarLocal');
        const novaLocalizacaoInput = document.getElementById('novaLocalizacaoInput');
        if(btnAtualizar && novaLocalizacaoInput){ // Verificação
            btnAtualizar.addEventListener('click', function() {
                const novaLocalizacao = novaLocalizacaoInput.value;
                if (!novaLocalizacao) { /* ... */ return; }
                btnAtualizar.innerText = "Salvando...";
                arquivoRef.update({ localizacao: novaLocalizacao })
                .then(() => { /* ... */ })
                .catch((error) => { /* ... */ });
            });
        }

        // Botão "ADICIONAR NOVO"
        const btnIrParaCadastro = document.getElementById('btnIrParaCadastro');
        if(btnIrParaCadastro){ // Verificação
            btnIrParaCadastro.addEventListener('click', function() {
                window.location.href = "automacao.html";
            });
        }
    }
});

// =======================================================
//     LÓGICA DO BOTÃO "SAIR" (LOGOUT)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
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
    }
});

// =======================================================
//     LÓGICA PARA ABRIR/FECHAR O CHATBOT DATALIA
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    
    const previewChat = document.getElementById('previewChat');
    const chatJanela = document.getElementById('chatJanela');
    const fecharChatBtn = document.getElementById('fecharChatBtn');

    // Verifica se os elementos do chat existem nesta página (inicial.html)
    if (previewChat && chatJanela && fecharChatBtn) {
        
        console.log("DEBUG: Elementos do Chat encontrados.");

        // Função para abrir/fechar
        function toggleChat(e) {
            // Previne o comportamento padrão do link '#' se ele existir
            if(e) e.preventDefault(); 
            
            if (chatJanela.style.display === 'none' || chatJanela.style.display === '') {
                console.log("DEBUG: Abrindo chat...");
                chatJanela.style.display = 'block';
                previewChat.style.display = 'none'; // Esconde o preview
            } else {
                console.log("DEBUG: Fechando chat...");
                chatJanela.style.display = 'none';
                previewChat.style.display = 'block'; // Mostra o preview de volta
            }
        }

        // Adiciona evento de clique no preview
        previewChat.addEventListener('click', toggleChat);

        // Adiciona evento de clique no botão de fechar
        fecharChatBtn.addEventListener('click', toggleChat);
    } else {
        // console.log("DEBUG: Elementos do Chat NÃO encontrados nesta página.");
    }
});

// =======================================================
//     LÓGICA DO CHATBOT DATALIA (CONECTADO AO GEMINI - CORREÇÃO SDK)
// =======================================================
document.addEventListener('DOMContentLoaded', function() { // Pode manter DOMContentLoaded aqui

    const chatInput = document.getElementById('chatInput');
    const enviarChatBtn = document.getElementById('enviarChatBtn');
    const chatCorpo = document.getElementById('chatCorpo');

    // Verifica se os elementos do chat existem nesta página
    if (chatInput && enviarChatBtn && chatCorpo) {

        console.log("DEBUG: Lógica do Chatbot Gemini iniciada.");

        
        const API_KEY = "AIzaSyDmrqBe2d5vHpYH95a9Zb-YAdL4Tl0TTrc"; 
        

        let genAI;
        let model;

        // Função para inicializar o Gemini de forma assíncrona
        async function initializeGemini() {
            try {
                 // **** CORREÇÃO: Usa import() dinâmico para o módulo ES ****
                 // Usando um CDN popular para módulos ES
                 const { GoogleGenerativeAI } = await import('https://esm.run/@google/generative-ai');

                 if (!GoogleGenerativeAI) {
                    throw new Error("Classe GoogleGenerativeAI não encontrada após import.");
                 }

                 genAI = new GoogleGenerativeAI(API_KEY);
                
                model = genAI.getGenerativeModel({ model: "gemini-1.0-pro-latest" });
                console.log("DEBUG: SDK Gemini carregado e inicializado via import().");
                 
                 // Habilita input/botão APÓS carregar com sucesso
                 chatInput.disabled = false;
                 enviarChatBtn.disabled = false;
                 chatInput.placeholder = "Digite sua mensagem..."; // Restaura placeholder

            } catch (error) {
                console.error("Erro CRÍTICO ao carregar ou inicializar o SDK do Gemini:", error);
                // Remove mensagem de "Inicializando..."
                const loadingMsg = document.getElementById('loading-message');
                if (loadingMsg) loadingMsg.remove();
                // Mostra erro definitivo no chat
                adicionarMensagem("Erro fatal: Não foi possível carregar a IA. Verifique o console e a API Key.", "ia");
                // Mantém desabilitado
                chatInput.disabled = true;
                enviarChatBtn.disabled = true;
                chatInput.placeholder = "IA indisponível"; 
            }
        }

        // Função para adicionar mensagens (textContent para segurança)
        function adicionarMensagem(texto, tipo = "ia", isLoading = false) {
             const divMensagem = document.createElement('div');
             divMensagem.classList.add('mensagem', tipo);
             if (isLoading) {
                  divMensagem.classList.add('loading');
                  divMensagem.id = 'loading-message'; // Para poder remover depois
             }
             divMensagem.textContent = texto; // Mais seguro que innerText
             chatCorpo.appendChild(divMensagem);
             chatCorpo.scrollTop = chatCorpo.scrollHeight;
        }

        // Desabilita input e botão inicialmente e mostra "Inicializando..."
        chatInput.disabled = true;
        enviarChatBtn.disabled = true;
        chatInput.placeholder = "Inicializando IA...";
        adicionarMensagem("Inicializando IA...", "ia", true); 

        // Tenta inicializar a IA
        initializeGemini().then(() => {
             // Remove "Inicializando IA..." APÓS a tentativa (sucesso ou falha)
             const loadingMsg = document.getElementById('loading-message');
             if (loadingMsg) loadingMsg.remove();
             // Adiciona saudação inicial SÓ SE CARREGOU COM SUCESSO
             if (genAI && model) {
                 // A mensagem inicial já está no HTML, não precisa adicionar de novo
                 // adicionarMensagem("Olá! Como posso ajudar? 👋", "ia");
             }
        });


        // Função principal para enviar mensagem (Verifica se 'model' existe)
        async function enviarMensagem() {
            const mensagemUsuario = chatInput.value.trim();
            // Verifica se o modelo foi carregado E se tem mensagem
            if (mensagemUsuario === "" || !model) {
                 if(!model) console.error("DEBUG: Modelo Gemini não inicializado ou falhou ao carregar.");
                 return; 
            }

            adicionarMensagem(mensagemUsuario, "usuario");
            chatInput.value = "";
            enviarChatBtn.disabled = true;

            adicionarMensagem("Digitando", "ia", true); 

            try {
                console.log("DEBUG: Enviando para Gemini:", mensagemUsuario);
                 // Usa o 'model' que foi inicializado
                 const result = await model.generateContent(mensagemUsuario);
                 const response = await result.response;
                 const textoResposta = response.text();
                 console.log("DEBUG: Resposta do Gemini:", textoResposta);

                const loadingMsg = document.getElementById('loading-message');
                if (loadingMsg) loadingMsg.remove();

                adicionarMensagem(textoResposta, "ia");

            } catch (error) {
                console.error("Erro ao gerar conteúdo:", error);
                const loadingMsg = document.getElementById('loading-message');
                if (loadingMsg) loadingMsg.remove();
                adicionarMensagem("Desculpe, ocorreu um erro ao processar sua mensagem.", "ia");
            } finally {
                enviarChatBtn.disabled = false;
                chatInput.focus();
            }
        }

        // Event listeners (continuam iguais)
        enviarChatBtn.addEventListener('click', enviarMensagem);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                enviarMensagem();
            }
        });
        
    } else {
         // console.log("DEBUG: Elementos do Chat NÃO encontrados nesta página.");
    }
});