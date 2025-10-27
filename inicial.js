// Forcando o deploy do login.js v2
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
document.addEventListener('DOMContentLoaded', () => {
    // ... (seu código de saudação, menu, etc. continua aqui)...
});

// =======================================================
//     LÓGICA DA PÁGINA 'automacao.html' (COM IA PARA PDF E IMAGEM)
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

        // **** CÓDIGO DO BOTÃO "PROCESSAR COM IA" (ATUALIZADO PARA PDF) ****
        if (btnProcessarIA) {
            // Importa o pdf.js como módulo
            import('//mozilla.github.io/pdf.js/build/pdf.mjs').then(async (pdfjsLib) => {
                // Configuração essencial para o pdf.js funcionar no navegador
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
                        // **** CORREÇÃO TESSERACT: Define os caminhos ****
                        const workerPath = 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js';
                        const langPath = 'https://tessdata.projectnaptha.com/4.0.0';

                        // Cria o "trabalhador" da IA (Tesseract) uma vez
                        const worker = await Tesseract.createWorker('por', 1, {
                            workerPath: workerPath,
                            langPath: langPath,
                            gzip: false, // Necessário para langPath externo
                            logger: m => {
                                console.log(m);
                                if(m.status === 'recognizing text') {
                                   iaStatus.innerText = `Lendo ${m.progress === 1 ? 'concluído' : `(${Math.round(m.progress * 100)}%)`}...`;
                                } else if (m.status === 'loading language traineddata') {
                                    iaStatus.innerText = `Baixando idioma (${Math.round(m.progress * 100)}%)...`;
                                } else {
                                    iaStatus.innerText = m.status; // Mostra outros status
                                }
                            },
                        });
                        // **** FIM DA CORREÇÃO TESSERACT ****


                        if (file.type.startsWith("image/")) {
                            // --- SE FOR IMAGEM ---
                            iaStatus.innerText = "Lendo imagem...";
                            const { data: { text } } = await worker.recognize(file);
                            console.log("Texto extraído da imagem:", text);
                            textoExtraidoIA.value = text;
                            iaStatus.innerText = "Leitura concluída!";

                        } else if (file.type === "application/pdf") {
                            // --- SE FOR PDF ---
                            iaStatus.innerText = "Carregando PDF...";

                            const fileReader = new FileReader();
                            fileReader.readAsArrayBuffer(file);

                            fileReader.onload = async function() {
                                const pdfData = new Uint8Array(this.result);
                                const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
                                const numPages = pdfDoc.numPages;
                                console.log(`PDF carregado com ${numPages} páginas.`);

                                let textoCompleto = "";

                                for (let i = 1; i <= numPages; i++) {
                                    iaStatus.innerText = `Processando página ${i} de ${numPages}...`;
                                    const page = await pdfDoc.getPage(i);
                                    const viewport = page.getViewport({ scale: 1.0 });

                                    const canvas = document.createElement('canvas');
                                    const context = canvas.getContext('2d');
                                    canvas.height = viewport.height;
                                    canvas.width = viewport.width;

                                    await page.render({ canvasContext: context, viewport: viewport }).promise;

                                    const imageDataUrl = canvas.toDataURL('image/png');

                                    iaStatus.innerText = `Lendo texto da página ${i}...`;
                                    const { data: { text } } = await worker.recognize(imageDataUrl);
                                    console.log(`Texto extraído da página ${i}:`, text.substring(0, 100) + "...");
                                    textoCompleto += text + "\n\n--- Fim da Página " + i + " ---\n\n";
                                }

                                textoExtraidoIA.value = textoCompleto;
                                iaStatus.innerText = "Leitura do PDF concluída!";
                            };

                            fileReader.onerror = function(error) {
                                throw new Error("Erro ao ler o arquivo PDF.");
                            }

                        } else {
                            alert("Formato de arquivo não suportado. Use JPG, PNG ou PDF.");
                            iaStatus.innerText = "";
                            btnProcessarIA.disabled = false;
                            return;
                        }

                        await worker.terminate();

                    } catch (error) {
                        console.error("Erro no processamento:", error);
                        iaStatus.innerText = "Erro durante o processamento.";
                        alert("Ocorreu um erro ao processar o arquivo. Verifique o console para detalhes.");
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
                anexoUrl: null,
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
        // ... (seu código da lista continua aqui) ...
    }
});

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (COM CORREÇÃO PARA CELULAR)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const nomeDisplay = document.getElementById('nomeArquivoDisplay');
    if (nomeDisplay) {
        // ... (seu código da página de detalhes continua aqui) ...
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