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
// **** NOVO: INICIALIZA O SERVIÇO DE AUTENTICAÇÃO ****
const auth = firebase.auth();

console.log("Firebase Conectado com SUCESSO a partir do inicial.js!");

// =======================================================
//     O "SEGURANÇA" (PROTETOR DE PÁGINA)
// =======================================================
// (Este código roda em TODAS as páginas que carregam o 'inicial.js')

auth.onAuthStateChanged(function(user) {
    if (user) {
        // --- O USUÁRIO ESTÁ LOGADO ---
        console.log("Usuário está LOGADO:", user.email);
        // O usuário está logado, então ele pode ver a página.
        // Não precisamos fazer nada.
        
    } else {
        // --- O USUÁRIO NÃO ESTÁ LOGADO ---
        console.log("Usuário NÃO está logado. Redirecionando para o login...");
        
        // Chuta o usuário de volta para a página de login
        // (Vamos usar 'index.html' que é o seu login)
        window.location.href = "index.html"; 
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
//     LÓGICA DA PÁGINA 'automacao.html' (COM UPLOAD EM BASE64)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const btnSalvar = document.getElementById('btnSalvarArquivo');

    if (btnSalvar) {
        // ... (elementos do formulário) ...
        const nomeArquivoInput = document.getElementById('nomeArquivo');
        const localizacaoInput = document.getElementById('localizacaoArquivo');
        const tipoArquivoInput = document.getElementById('tipoArquivo');
        const qrcodeDiv = document.getElementById('qrcode');
        const arquivoUploadInput = document.getElementById('arquivoUpload');

        btnSalvar.addEventListener('click', function() {
            const nome = nomeArquivoInput.value;
            const local = localizacaoInput.value;
            const tipo = tipoArquivoInput.value;
            const file = arquivoUploadInput.files[0]; 

            if (!nome || !local) {
                alert("Por favor, preencha o Nome e a Localização!");
                return; 
            }

            console.log("Iniciando processo de salvar...");
            btnSalvar.innerText = "Salvando...";
            btnSalvar.disabled = true;

            if (file) {
                console.log("Convertendo arquivo para Base64...", file.name);
                btnSalvar.innerText = "Processando arquivo...";
                
                const reader = new FileReader();
                reader.readAsDataURL(file);
                
                reader.onload = function() {
                    const base64String = reader.result;
                    console.log("Arquivo convertido! Salvando no banco...");
                    salvarNoBanco(nome, local, tipo, base64String); 
                };
                
                reader.onerror = function(error) {
                    console.error("Erro ao ler o arquivo:", error);
                    alert("Erro ao processar o arquivo. Tente um arquivo menor.");
                    btnSalvar.innerText = "Salvar e Gerar QR Code";
                    btnSalvar.disabled = false;
                };
            } else {
                console.log("Nenhum arquivo anexado. Salvando só os dados.");
                salvarNoBanco(nome, local, tipo, null);
            }
        });

        function salvarNoBanco(nome, local, tipo, anexoString) {
            console.log("Salvando no REALTIME DATABASE...");
            btnSalvar.innerText = "Salvando dados...";

            const arquivosRef = db.ref('arquivos');
            arquivosRef.push({
                nome: nome,
                localizacao: local,
                tipo: tipo,
                dataCadastro: firebase.database.ServerValue.TIMESTAMP,
                anexoUrl: anexoString 
            })
            .then((snapshot) => {
                const docId = snapshot.key;
                console.log("Documento salvo com ID: ", docId);
                
                nomeArquivoInput.value = "";
                localizacaoInput.value = "";
                arquivoUploadInput.value = null; 
                
                qrcodeDiv.innerHTML = ""; 
                const urlParaQR = `https://site-archi-tech-projeto-tcc.vercel.app/arquivo.html?id=${docId}`;
                
                new QRCode(qrcodeDiv, { text: urlParaQR, width: 150, height: 150 });
                
                alert("Arquivo salvo com sucesso! Imprima o QR Code.");
                btnSalvar.innerText = "Salvar e Gerar QR Code";
                btnSalvar.disabled = false;
            })
            .catch((error) => {
                console.error("Erro ao salvar documento: ", error);
                alert("Ocorreu um erro ao salvar. Tente novamente.");
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
        console.log("Estamos na página listar.html, buscando arquivos...");
        const arquivosRef = db.ref('arquivos');
        arquivosRef.once('value', (snapshot) => {
            const dados = snapshot.val(); 
            containerDaLista.innerHTML = ""; 
            if (dados) {
                Object.keys(dados).forEach(key => {
                    const arquivo = dados[key];
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
            } else {
                containerDaLista.innerHTML = "<p>Nenhum arquivo cadastrado no sistema ainda.</p>";
            }
        }).catch((error) => {
            console.error("Erro ao buscar arquivos:", error);
            containerDaLista.innerHTML = "<p style='color: red;'>Erro ao carregar a lista.</p>";
        });
    }
});

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (COM CORREÇÃO PARA CELULAR)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const nomeDisplay = document.getElementById('nomeArquivoDisplay');
    
    if (nomeDisplay) {
        console.log("Estamos na página arquivo.html, procurando ID...");
        const params = new URLSearchParams(window.location.search);
        const arquivoId = params.get('id');

        if (!arquivoId) {
            document.getElementById('formularioCadastro').innerHTML = "<h2>Erro: ID não encontrado na URL.</h2>";
            return;
        }

        const arquivoRef = db.ref('arquivos/' + arquivoId);
        
        arquivoRef.on('value', (snapshot) => {
            const data = snapshot.val();
            const anexoContainer = document.getElementById('anexoContainer');
            if(anexoContainer) {
                anexoContainer.innerHTML = ""; 
            }

            if (data) {
                console.log("Dados recebidos:", data);
                nomeDisplay.innerText = data.nome;
                document.getElementById('localizacaoAtualDisplay').innerText = data.localizacao;
                document.getElementById('tipoArquivoDisplay').innerText = data.tipo;
                const dataCadastro = new Date(data.dataCadastro);
                document.getElementById('dataCadastroDisplay').innerText = dataCadastro.toLocaleString('pt-BR');

                // **** ESTA É A CORREÇÃO PARA CELULAR ****
                if (data.anexoUrl && anexoContainer) {
                    console.log("Anexo encontrado. Preparando para download.");
                    
                    let nomeDoArquivo = data.nome || "anexo";
                    
                    if (data.anexoUrl.startsWith("data:image/jpeg")) {
                        nomeDoArquivo += ".jpg";
                    } else if (data.anexoUrl.startsWith("data:image/png")) {
                        nomeDoArquivo += ".png";
                    } else if (data.anexoUrl.startsWith("data:application/pdf")) {
                        nomeDoArquivo += ".pdf";
                    }

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

            } else {
                console.error("Nenhum dado encontrado para este ID.");
                nomeDisplay.innerText = "Arquivo não encontrado.";
            }
        });

        // Botão de ATUALIZAR LOCALIZAÇÃO
        const btnAtualizar = document.getElementById('btnAtualizarLocal');
        const novaLocalizacaoInput = document.getElementById('novaLocalizacaoInput');

        btnAtualizar.addEventListener('click', function() {
            const novaLocalizacao = novaLocalizacaoInput.value;
            if (!novaLocalizacao) {
                alert("Por favor, digite a nova localização.");
                return;
            }
            console.log("Atualizando localização para:", novaLocalizacao);
            btnAtualizar.innerText = "Salvando...";
            arquivoRef.update({ localizacao: novaLocalizacao })
            .then(() => {
                alert("Localização atualizada com sucesso!");
                novaLocalizacaoInput.value = "";
                btnAtualizar.innerText = "Salvar Nova Localização";
            })
            .catch((error) => {
                console.error("Erro ao atualizar:", error);
                btnAtualizar.innerText = "Salvar Nova Localização";
            });
        });
        
        // Botão "ADICIONAR NOVO"
        const btnIrParaCadastro = document.getElementById('btnIrParaCadastro');
        btnIrParaCadastro.addEventListener('click', function() {
            console.log("Indo para a página de automação...");
            window.location.href = "automacao.html";
        });
    }
});