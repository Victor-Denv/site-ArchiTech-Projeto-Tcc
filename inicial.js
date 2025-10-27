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
const db = firebase.database(); // ADICIONEI ESTA LINHA (ESTAVA FALTANDO)

console.log("Firebase Conectado com SUCESSO a partir do inicial.js!"); 


//----- SCRIPT DA TELA DE CARREGAMENTO (COM CORREÇÃO) -----
window.addEventListener('load', () => {
    const splashScreen = document.getElementById("splash-screen");
    const mainContent = document.getElementById("main-content");

    // SÓ RODA ESSE CÓDIGO SE A SPLASH SCREEN E O CONTEÚDO EXISTIREM NA PÁGINA
    if (splashScreen && mainContent) {

        // Define o tempo que a splash screen ficará visível (em milissegundos)
        const splashScreenTime = 1000; 

        setTimeout(() => {
            // Adiciona a classe para iniciar a transição de desaparecimento
            splashScreen.classList.add("hidden");

            // Mostra o conteúdo principal após a transição da splash screen
            splashScreen.addEventListener("transitionend", () => {
                // Garante que a splash seja removida do DOM após a animação
                if (splashScreen) {
                    splashScreen.remove();
                }
                mainContent.style.display = "grid"; // Use 'grid' como no seu CSS original
            }, { once: true }); // O evento só será executado uma vez
        }, splashScreenTime);

    } // FIM DA VERIFICAÇÃO 'if'
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

    const botaoSaibaMais = document.querySelector('.banner-destaque .botao-principal');
    if (botaoSaibaMais) {
        botaoSaibaMais.addEventListener('click', () => {
            alert('Funcionalidade "Saiba Mais" será implementada em breve!');
        });
    }

    const iconeNotificacoes = document.querySelector('.icones-cabecalho .fa-bell');
    if (iconeNotificacoes) {
        iconeNotificacoes.addEventListener('click', () => {
            alert('Novas notificações serão exibidas aqui!');
        });
    }

    const previewMensagem = document.querySelector('.preview-mensagem');
    if (previewMensagem) {
        previewMensagem.addEventListener('click', () => {
            alert('O chat com a assistente DataLia será aberto em uma nova janela.');
        });
    }
});

// =======================================================
//     LÓGICA DO FORMULÁRIO (COM UPLOAD EM BASE64)
// =======================================================

// Espera o HTML carregar
document.addEventListener('DOMContentLoaded', function() {

    const btnSalvar = document.getElementById('btnSalvarArquivo');

    // Verifica se estamos na página de automação
    if (btnSalvar) {

        // 1. Pega os elementos do HTML
        const nomeArquivoInput = document.getElementById('nomeArquivo');
        const localizacaoInput = document.getElementById('localizacaoArquivo');
        const tipoArquivoInput = document.getElementById('tipoArquivo');
        const qrcodeDiv = document.getElementById('qrcode');
        const arquivoUploadInput = document.getElementById('arquivoUpload');


        // 2. Cria o "ouvinte" para o clique no botão
        btnSalvar.addEventListener('click', function() {
            
            // 3. Pega os valores
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

            // 4. VERIFICA SE TEM ARQUIVO PARA UPLOAD
            if (file) {
                // SE TEM ARQUIVO:
                console.log("Convertendo arquivo para Base64...", file.name);
                btnSalvar.innerText = "Processando arquivo...";
                
                // **** ESTA É A MUDANÇA (A 'GAMBIARRA') ****
                // Vamos usar um 'FileReader' para ler o arquivo como um "Data URL" (Base64)
                const reader = new FileReader();
                reader.readAsDataURL(file); // Converte o arquivo em texto
                
                // Quando a leitura terminar...
                reader.onload = function() {
                    const base64String = reader.result; // Este é o texto gigante!
                    console.log("Arquivo convertido! Salvando no banco...");
                    
                    // AGORA SALVA TUDO NO BANCO DE DADOS (com o texto Base64)
                    salvarNoBanco(nome, local, tipo, base64String); 
                };
                
                // Se der erro na leitura...
                reader.onerror = function(error) {
                    console.error("Erro ao ler o arquivo:", error);
                    alert("Erro ao processar o arquivo. Tente um arquivo menor.");
                    btnSalvar.innerText = "Salvar e Gerar QR Code";
                    btnSalvar.disabled = false;
                };
                // **** FIM DA MUDANÇA ****
                
            } else {
                // SE NÃO TEM ARQUIVO:
                console.log("Nenhum arquivo anexado. Salvando só os dados.");
                salvarNoBanco(nome, local, tipo, null);
            }
        });

        // 5. FUNÇÃO AUXILIAR PARA SALVAR NO BANCO
        // (Esta função continua a mesma, ela só salva o que receber)
        function salvarNoBanco(nome, local, tipo, anexoString) {
            
            console.log("Salvando no REALTIME DATABASE...");
            btnSalvar.innerText = "Salvando dados...";

            const arquivosRef = db.ref('arquivos');
            arquivosRef.push({
                nome: nome,
                localizacao: local,
                tipo: tipo,
                dataCadastro: firebase.database.ServerValue.TIMESTAMP,
                anexoUrl: anexoString // Salva o texto Base64 (ou null)
            })
            .then((snapshot) => {
                const docId = snapshot.key;
                console.log("Documento salvo com ID: ", docId);
                
                nomeArquivoInput.value = "";
                localizacaoInput.value = "";
                arquivoUploadInput.value = null; 
                
                qrcodeDiv.innerHTML = ""; 
                const urlParaQR = `https://site-archi-tech-projeto-tcc.vercel.app/arquivo.html?id=${docId}`;
                
                new QRCode(qrcodeDiv, {
                    text: urlParaQR,
                    width: 150,
                    height: 150
                });
                
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
        
    } // Fim do 'if (btnSalvar)'
});

// =======================================================
//     LÓGICA DA PÁGINA 'listar.html'
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Procura o container da lista (que só existe na 'listar.html')
    const containerDaLista = document.getElementById('containerDaLista');

    if (containerDaLista) {
        console.log("Estamos na página listar.html, buscando arquivos...");

        const arquivosRef = db.ref('arquivos');

        arquivosRef.once('value', (snapshot) => {
            
            const dados = snapshot.val(); 
            containerDaLista.innerHTML = ""; 

            if (dados) {
                console.log("Total de arquivos encontrados:", Object.keys(dados).length);

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
                console.log("Nenhum arquivo encontrado.");
                containerDaLista.innerHTML = "<p>Nenhum arquivo cadastrado no sistema ainda.</p>";
            }

        }).catch((error) => {
            console.error("Erro ao buscar arquivos:", error);
            containerDaLista.innerHTML = "<p style='color: red;'>Erro ao carregar a lista. Tente novamente.</p>";
        });
    }
});

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (BLOCO CORRIGIDO)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Procura os elementos da página 'arquivo.html'
    const nomeDisplay = document.getElementById('nomeArquivoDisplay');
    
    // Se 'nomeDisplay' existir, significa que estamos na página 'arquivo.html'
    if (nomeDisplay) {

        console.log("Estamos na página arquivo.html, procurando ID...");

        // 1. LER O ID DA URL
        const params = new URLSearchParams(window.location.search);
        const arquivoId = params.get('id');

        if (!arquivoId) {
            console.error("Nenhum ID de arquivo encontrado na URL!");
            document.getElementById('formularioCadastro').innerHTML = "<h2>Erro: ID não encontrado na URL.</h2>";
            return;
        }

        console.log("ID encontrado:", arquivoId);

        // Referência para este arquivo específico no banco de dados
        const arquivoRef = db.ref('arquivos/' + arquivoId);

        // 2. BUSCAR OS DADOS NO REALTIME DATABASE (EM TEMPO REAL)
        arquivoRef.on('value', (snapshot) => {
            const data = snapshot.val();
            
            // Pega o container do anexo (que criamos no HTML)
            const anexoContainer = document.getElementById('anexoContainer');
            if(anexoContainer) {
                anexoContainer.innerHTML = ""; // Limpa ele primeiro
            }

            if (data) {
                console.log("Dados recebidos:", data);
                // Coloca os dados nos campos
                nomeDisplay.innerText = data.nome;
                document.getElementById('localizacaoAtualDisplay').innerText = data.localizacao;
                document.getElementById('tipoArquivoDisplay').innerText = data.tipo;
                const dataCadastro = new Date(data.dataCadastro);
                document.getElementById('dataCadastroDisplay').innerText = dataCadastro.toLocaleString('pt-BR');

                // **** ESTA É A PARTE CORRIGIDA ****
                // **** VERIFICA SE TEM ANEXO ****
                if (data.anexoUrl && anexoContainer) {
                    console.log("Anexo encontrado:", data.anexoUrl);
                    // Cria um botão de download
                    anexoContainer.innerHTML = `
                        <p style="margin-top: 15px;">
                            <strong>Anexo:</strong>
                            <a href="${data.anexoUrl}" target="_blank" class="item-link" style="display: inline-block; margin-left: 10px;">
                                <button class="btn-detalhes" style="background-color: #007bff;">
                                    Ver/Baixar Anexo
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

        // 3. FAZER O BOTÃO DE ATUALIZAR LOCALIZAÇÃO FUNCIONAR
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
            arquivoRef.update({
                localizacao: novaLocalizacao
            })
            .then(() => {
                alert("Localização atualizada com sucesso!");
                novaLocalizacaoInput.value = ""; // Limpa o campo
                btnAtualizar.innerText = "Salvar Nova Localização";
            })
            .catch((error) => {
                console.error("Erro ao atualizar:", error);
                alert("Erro ao atualizar. Tente novamente.");
                btnAtualizar.innerText = "Salvar Nova Localização";
            });
        });
        
        // 4. FAZER O BOTÃO "ADICIONAR NOVO" FUNCIONAR
        const btnIrParaCadastro = document.getElementById('btnIrParaCadastro');
        
        btnIrParaCadastro.addEventListener('click', function() {
            console.log("Indo para a página de automação...");
            window.location.href = "automacao.html";
        });
        
    } // Fim do 'if (nomeDisplay)'
});