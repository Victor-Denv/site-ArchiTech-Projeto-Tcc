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
    // Verifica se estamos NA PÁGINA DE LOGIN para NÃO redirecionar
    const isLoginPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('login.html');

    if (user) {
        // --- O USUÁRIO ESTÁ LOGADO ---
        console.log("Usuário está LOGADO:", user.email);
        // Se ele estiver logado E na página de login, manda ele pro início
        if (isLoginPage) {
            console.log("Usuário logado na página de login. Redirecionando para inicial.html...");
            window.location.href = "inicial.html";
        }
        // Se estiver logado e em outra página, tudo ok.
        
    } else {
        // --- O USUÁRIO NÃO ESTÁ LOGADO ---
        // Se ele NÃO estiver logado E NÃO estiver na página de login, chuta ele pra lá
        if (!isLoginPage) {
            console.log("Usuário NÃO está logado. Redirecionando para o login...");
            window.location.href = "index.html"; 
        }
        // Se não estiver logado E JÁ estiver na página de login, tudo ok.
    }
});


//----- SCRIPT DA TELA DE CARREGAMENTO (COM CORREÇÃO) -----
window.addEventListener('load', () => {
    const splashScreen = document.getElementById("splash-screen");
    const mainContent = document.getElementById("main-content");

    if (splashScreen && mainContent) {
        const splashScreenTime = 1000; 
        setTimeout(() => {
            splashScreen.classList.add("hidden");
            splashScreen.addEventListener("transitionend", () => {
                if (splashScreen) {
                    splashScreen.remove();
                }
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
//     LÓGICA DA PÁGINA 'automacao.html' (COM IA TESSERACT.JS e CORREÇÃO window.load)
// =======================================================
// **** MUDANÇA AQUI: de 'DOMContentLoaded' para 'load' ****
window.addEventListener('load', function() { 
    const btnSalvar = document.getElementById('btnSalvarArquivo');

    // Verifica se estamos na página de automação
    if (btnSalvar) {
        // 1. Pega os elementos do HTML
        const nomeArquivoInput = document.getElementById('nomeArquivo');
        const localizacaoInput = document.getElementById('localizacaoArquivo');
        const tipoArquivoInput = document.getElementById('tipoArquivo');
        const qrcodeDiv = document.getElementById('qrcode');
        const arquivoUploadInput = document.getElementById('arquivoUpload');
        const btnProcessarIA = document.getElementById('btnProcessarIA');
        const textoExtraidoIA = document.getElementById('textoExtraidoIA');
        const iaStatus = document.getElementById('iaStatus');

        // 2. Lógica do Botão "Processar com IA"
        if (btnProcessarIA) { // Adiciona uma verificação extra
            btnProcessarIA.addEventListener('click', async function() {
                const file = arquivoUploadInput.files[0];
                if (!file) {
                    alert("Por favor, anexe uma imagem (JPG ou PNG) primeiro.");
                    return;
                }

                console.log("Iniciando processamento com Tesseract...");
                iaStatus.innerText = "Lendo imagem (pode levar um tempo)...";
                btnProcessarIA.disabled = true;
                textoExtraidoIA.value = ""; 

                try {
                    const worker = await Tesseract.createWorker('por', 1, { 
                        logger: m => {
                            console.log(m); 
                            if(m.status === 'recognizing text') {
                               iaStatus.innerText = `Lendo... (${Math.round(m.progress * 100)}%)`;
                            }
                        }, 
                    });
                    
                    const { data: { text } } = await worker.recognize(file);
                    
                    console.log("Texto extraído:", text);
                    textoExtraidoIA.value = text; 
                    iaStatus.innerText = "Leitura concluída!";
                    
                    await worker.terminate();
                    
                } catch (error) {
                    console.error("Erro no Tesseract:", error);
                    iaStatus.innerText = "Erro ao ler a imagem.";
                    alert("Ocorreu um erro ao processar a imagem. Tente novamente ou use outra imagem.");
                } finally {
                     btnProcessarIA.disabled = false; 
                }
            });
        }

        // 3. Lógica do Botão "Salvar e Gerar QR Code"
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

        // 4. FUNÇÃO AUXILIAR PARA SALVAR NO BANCO
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
    // ... (seu código da lista continua aqui, está correto) ...
});

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (COM CORREÇÃO PARA CELULAR)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    // ... (seu código da página de detalhes continua aqui, está correto) ...
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