// Comentário para forçar deploy v33 - FINAL COM MONITORAMENTO
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
    if (saudacaoTitulo) {
        const horaAtual = new Date().getHours();
        let saudacao = '';
        if (horaAtual >= 5 && horaAtual < 12) saudacao = 'Bom dia, Arquivista!!';
        else if (horaAtual >= 12 && horaAtual < 18) saudacao = 'Boa Tarde, Arquivista!!';
        else saudacao = 'Boa Noite, Arquivista!!';
        const textoOriginal = "Veja algumas das atualizações do nosso acervo enquanto você esteve fora...";
        if(saudacaoTitulo && saudacaoTitulo.textContent.includes(textoOriginal)) {
             saudacaoTitulo.textContent = `${saudacao} ${textoOriginal}`;
        }
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
                if (!arquivoUploadInput) { console.error("Input de arquivo não encontrado"); return; }
                const file = arquivoUploadInput.files[0];
                if (!file || !file.type.startsWith("image/")) {
                    alert("Por favor, anexe uma imagem (JPG ou PNG).");
                    return;
                }
                if(iaStatus) iaStatus.innerText = "Preparando IA...";
                btnProcessarIA.disabled = true;
                if(textoExtraidoIA) textoExtraidoIA.value = "";
                try {
                    const workerPath = 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js';
                    const langPath = 'https://tessdata.projectnaptha.com/4.0.0';
                    const worker = await Tesseract.createWorker('por', 1, {
                         workerPath: workerPath,
                         langPath: langPath,
                         gzip: false,
                         logger: m => {
                              console.log(m);
                             if(m.status === 'recognizing text' && iaStatus) {
                                iaStatus.innerText = `Lendo ${m.progress === 1 ? 'concluído' : `(${Math.round(m.progress * 100)}%)`}...`;
                             } else if (m.status === 'loading language traineddata' && iaStatus) {
                                 iaStatus.innerText = `Baixando idioma (${Math.round(m.progress * 100)}%)...`;
                             } else if (iaStatus) {
                                 iaStatus.innerText = m.status;
                             }
                          }
                    });
                    if(iaStatus) iaStatus.innerText = "Lendo imagem...";
                    const { data: { text } } = await worker.recognize(file);
                    if(textoExtraidoIA) textoExtraidoIA.value = text;
                    if(iaStatus) iaStatus.innerText = "Leitura concluída!";
                    await worker.terminate();
                } catch (error) {
                     console.error("Erro no Tesseract:", error);
                     if(iaStatus) iaStatus.innerText = "Erro ao ler a imagem.";
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
            const textoIA = textoExtraidoIA ? textoExtraidoIA.value : null;
            if (!nome || !local) { alert("Preencha Nome e Localização!"); return; }
            btnSalvar.innerText = "Salvando...";
            btnSalvar.disabled = true;
            salvarNoBanco(nome, local, tipo, textoIA);
        });

        // Função salvarNoBanco (Salva textoExtraido)
        function salvarNoBanco(nome, local, tipo, textoIA) {
            console.log("Salvando no REALTIME DATABASE (com texto da IA)...");
            const arquivosRef = db.ref('arquivos');
            arquivosRef.push({
                nome: nome,
                localizacao: local,
                tipo: tipo,
                dataCadastro: firebase.database.ServerValue.TIMESTAMP,
                anexoUrl: null, // Não salvamos mais anexo
                textoExtraido: textoIA || null // Salva texto da IA
            })
            .then((snapshot) => {
                const docId = snapshot.key;
                console.log("Documento salvo com ID: ", docId);
                if(nomeArquivoInput) nomeArquivoInput.value = "";
                if(localizacaoInput) localizacaoInput.value = "";
                if(arquivoUploadInput) arquivoUploadInput.value = null;
                if(textoExtraidoIA) textoExtraidoIA.value = "";
                if(iaStatus) iaStatus.innerText = "";
                if(qrcodeDiv) qrcodeDiv.innerHTML = "";
                const urlParaQR = `${window.location.origin}/arquivo.html?id=${docId}`;
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
        console.log("DEBUG: Iniciando lógica da página listar.html.");
        const arquivosRef = db.ref('arquivos');
        arquivosRef.once('value', (snapshot) => {
             const dados = snapshot.val();
             containerDaLista.innerHTML = "";
             if (dados) {
                 console.log("DEBUG: Montando lista...");
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
             } else {
                 containerDaLista.innerHTML = "<p>Nenhum arquivo cadastrado.</p>";
             }
        }).catch((error) => { console.error("Erro lista:", error); });
    }
});

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (COM QR CODE e TEXTO IA)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const nomeDisplay = document.getElementById('nomeArquivoDisplay');
    if (nomeDisplay) { // Estamos na página arquivo.html
        console.log("DEBUG: Iniciando lógica da página arquivo.html.");
        const params = new URLSearchParams(window.location.search);
        const arquivoId = params.get('id');
        if (!arquivoId) { /* ... (erro ID) ... */ return; }
        console.log("ID encontrado:", arquivoId);

        // Gera QR Code
        const qrcodeDetalhesDiv = document.getElementById('qrcodeDetalhes');
        if (qrcodeDetalhesDiv) {
             const urlAtual = window.location.href;
             qrcodeDetalhesDiv.innerHTML = "";
             try { new QRCode(qrcodeDetalhesDiv, { text: urlAtual, width: 128, height: 128 }); console.log("QR Code gerado."); }
             catch (error) { console.error("Erro QR Code:", error); }
        } else { console.error("DEBUG: Div 'qrcodeDetalhes' NÃO encontrada!"); }

        const arquivoRef = db.ref('arquivos/' + arquivoId);

        // Busca Dados (inclui texto IA)
        arquivoRef.on('value', (snapshot) => {
            const data = snapshot.val();
            const localDisplay = document.getElementById('localizacaoAtualDisplay');
            const tipoDisplay = document.getElementById('tipoArquivoDisplay');
            const dataDisplay = document.getElementById('dataCadastroDisplay');
            const textoIADisplayContainer = document.getElementById('textoExtraidoIADisplayContainer');
            const textoIADisplay = document.getElementById('textoExtraidoIADisplay');

            if (data) {
                console.log("Dados recebidos:", data);
                if(nomeDisplay) nomeDisplay.innerText = data.nome || 'Sem nome';
                if(localDisplay) localDisplay.innerText = data.localizacao || 'Não informado';
                if(tipoDisplay) tipoDisplay.innerText = data.tipo || 'Não informado';
                if(dataDisplay && data.dataCadastro) {
                     const dataCadastro = new Date(data.dataCadastro);
                     dataDisplay.innerText = dataCadastro.toLocaleString('pt-BR');
                } else if(dataDisplay) { dataDisplay.innerText = 'Data indisponível'; }
                
                // REMOVIDO: Anexo Base64

                 // MOSTRAR TEXTO DA IA
                 if (textoIADisplayContainer && textoIADisplay) {
                     if (data.textoExtraido) {
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
            btnAtualizar.addEventListener('click', function() {
                 const novaLocalizacao = novaLocalizacaoInput.value;
                 if (!novaLocalizacao) { alert("Digite a nova localização."); return; }
                 btnAtualizar.innerText = "Salvando...";
                 arquivoRef.update({ localizacao: novaLocalizacao })
                 .then(() => {
                     alert("Localização atualizada!");
                     novaLocalizacaoInput.value = "";
                     btnAtualizar.innerText = "Salvar Nova Localização";
                 })
                 .catch((error) => {
                     console.error("Erro ao atualizar:", error);
                     btnAtualizar.innerText = "Salvar Nova Localização";
                 });
            });
        }
        // Botão "+ Adicionar Novo Arquivo"
        const btnIrParaCadastro = document.getElementById('btnIrParaCadastro');
        if(btnIrParaCadastro){
            btnIrParaCadastro.addEventListener('click', function() { window.location.href = "automacao.html"; });
        }
    }
});

// =======================================================
//     LÓGICA DA PÁGINA 'monitor.html' (LER TEMPERATURA) - NOVO!
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Procura o elemento que só existe na página 'monitor.html'
    const tempDisplay = document.getElementById('temp-display');
    
    if (tempDisplay) { // Estamos na página monitor.html
        console.log("DEBUG: Iniciando lógica da página monitor.html (DOMContentLoaded).");
        
        const tempStatus = document.getElementById('temp-status');
        const tempUnit = document.getElementById('temp-unit'); // Pega a unidade

        // **** CAMINHO NO FIREBASE ONDE O ESP32 VAI SALVAR OS DADOS ****
        const tempRef = db.ref('sensores/sala_principal/temperatura');

        // "Ouve" qualquer mudança nesse dado em tempo real
        tempRef.on('value', (snapshot) => {
            const temperatura = snapshot.val();
            console.log("DEBUG: Novo dado de temperatura recebido:", temperatura);

            if (temperatura !== null && !isNaN(temperatura)) {
                tempDisplay.innerText = temperatura.toFixed(1); // Mostra com 1 casa decimal
                
                if (temperatura < 18) {
                    tempStatus.innerText = "Status: Muito Frio";
                    tempDisplay.style.color = "#00ccff"; // Azul
                    tempUnit.style.color = "#00ccff";
                } else if (temperatura > 26) {
                    tempStatus.innerText = "Status: Muito Quente!";
                    tempDisplay.style.color = "#ff6600"; // Laranja
                    tempUnit.style.color = "#ff6600";
                } else {
                    tempStatus.innerText = "Status: Ideal";
                    tempDisplay.style.color = "#00ff00"; // Verde
                    tempUnit.style.color = "#00ff00";
                }
            } else {
                tempDisplay.innerText = "--";
                tempStatus.innerText = "Sem dados do sensor. Verifique o ESP32.";
                tempDisplay.style.color = "#aaa";
                tempUnit.style.color = "#aaa";
            }
            
        }, (errorObject) => {
            console.error("DEBUG: Erro ao ler temperatura do Firebase:", errorObject.code);
            if(tempStatus) tempStatus.innerText = "Erro de conexão com o banco de dados.";
            if(tempDisplay) tempDisplay.innerText = "X";
            if(tempUnit) tempUnit.style.color = "#aaa";
            if(tempDisplay) tempDisplay.style.color = "#aaa";
        });
    }
});

// =======================================================
//     LÓGICA DO BOTÃO "SAIR" (LOGOUT)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
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
         console.log("DEBUG: Botão Logout NÃO encontrado.");
    }
});