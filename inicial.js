const firebaseConfig = {
  apiKey: "AIzaSyCPym-OjXGXY7IhA1u3DDPIOPi5tECDhR8",
  authDomain: "architeck-e92b4.firebaseapp.com",
  databaseURL: "https://architeck-e92b4-default-rtdb.firebaseio.com",
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


// --- SCRIPT ORIGINAL DA PÁGINA ---
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
//     LÓGICA DO FORMULÁRIO (USANDO REALTIME DATABASE)
// =======================================================

// A linha 'const storage = ...' deve estar no topo do seu arquivo
// Se você apagou, coloque esta linha lá em cima:
// const storage = firebase.storage();

// MUDA o banco de dados para o Realtime Database
// Coloque esta linha lá em cima, onde estava o const db antigo
const db = firebase.database();

// ESPERA O HTML INTEIRO CARREGAR PRIMEIRO!
document.addEventListener('DOMContentLoaded', function() {

    // Agora que o HTML carregou, procuramos o botão
    const btnSalvar = document.getElementById('btnSalvarArquivo');

    // Verifica se o botão REALMENTE existe nesta página
    if (btnSalvar) {

        // 1. Pega o resto dos elementos
        const nomeArquivoInput = document.getElementById('nomeArquivo');
        const localizacaoInput = document.getElementById('localizacaoArquivo');
        const tipoArquivoInput = document.getElementById('tipoArquivo');
        const qrcodeDiv = document.getElementById('qrcode');

        // 2. Cria o "ouvinte" para o clique no botão
        btnSalvar.addEventListener('click', function() {
            
            // 3. Pega os valores
            const nome = nomeArquivoInput.value;
            const local = localizacaoInput.value;
            const tipo = tipoArquivoInput.value;

            if (!nome || !local) {
                alert("Por favor, preencha o Nome e a Localização!");
                return; 
            }

            console.log("Salvando no REALTIME DATABASE:", nome, local, tipo);
            
            btnSalvar.innerText = "Salvando...";
            btnSalvar.disabled = true;

            // 4. Manda os dados para o Realtime Database
            // O código aqui é um pouco diferente: .ref() e .push()
            const arquivosRef = db.ref('arquivos'); // Cria uma "pasta" chamada "arquivos"
            arquivosRef.push({
                nome: nome,
                localizacao: local,
                tipo: tipo,
                dataCadastro: firebase.database.ServerValue.TIMESTAMP // Salva a data atual
            })
            .then((snapshot) => {
                // 5. DEU CERTO! O Realtime DB salvou e devolveu um ID
                const docId = snapshot.key; // Pega o ID único
                console.log("Documento salvo com ID: ", docId);
                
                nomeArquivoInput.value = "";
                localizacaoInput.value = "";
                
                // 6. GERA O QR CODE
                qrcodeDiv.innerHTML = ""; 
                
                // ATENÇÃO: A URL AQUI VAI SER PARA 'arquivo.html'
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
                // 7. DEU ERRO!
                console.error("Erro ao salvar documento: ", error);
                alert("Ocorreu um erro ao salvar. Tente novamente.");
                btnSalvar.innerText = "Salvar e Gerar QR Code";
                btnSalvar.disabled = false;
            });
        });

    } // Fim do 'if (btnSalvar)'

}); // Fim do 'DOMContentLoaded'


document.addEventListener('DOMContentLoaded', function() {
    
    // Procura o container da lista (que só existe na 'listar.html')
    const containerDaLista = document.getElementById('containerDaLista');

    if (containerDaLista) {
        console.log("Estamos na página listar.html, buscando arquivos...");

        // Referência para a "pasta" inteira de arquivos
        const arquivosRef = db.ref('arquivos');

        // Busca os dados UMA VEZ. (Usamos 'once' aqui, 
        // '.on()' ficaria atualizando em tempo real)
        arquivosRef.once('value', (snapshot) => {
            
            const dados = snapshot.val(); // Pega todos os dados
            
            // Limpa a mensagem "Carregando..."
            containerDaLista.innerHTML = ""; 

            if (dados) {
                console.log("Total de arquivos encontrados:", Object.keys(dados).length);

                // Passa por cada arquivo encontrado
                // 'key' é o ID único (ex: -NqX...abc)
                // 'dados[key]' é o objeto (nome, localizacao, tipo)
                Object.keys(dados).forEach(key => {
                    const arquivo = dados[key];

                    // Cria o HTML para este item da lista
                    // Usamos a classe 'item-lista-arquivo' (vamos criar o CSS para ela)
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
                    
                    // Adiciona o HTML deste item dentro do container
                    containerDaLista.innerHTML += itemHtml;
                });

            } else {
                // Se não encontrar nenhum arquivo
                console.log("Nenhum arquivo encontrado.");
                containerDaLista.innerHTML = "<p>Nenhum arquivo cadastrado no sistema ainda.</p>";
            }

        }).catch((error) => {
            console.error("Erro ao buscar arquivos:", error);
            containerDaLista.innerHTML = "<p style='color: red;'>Erro ao carregar a lista. Tente novamente.</p>";
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    
    // Procura os elementos da página 'arquivo.html'
    const nomeDisplay = document.getElementById('nomeArquivoDisplay');
    
    // Se 'nomeDisplay' existir, significa que estamos na página 'arquivo.html'
    if (nomeDisplay) {

        console.log("Estamos na página arquivo.html, procurando ID...");

        // 1. LER O ID DA URL
        const params = new URLSearchParams(window.location.search);
        const arquivoId = params.get('id'); // Pega o ID (ex: 'ABC123XYZ')

        if (!arquivoId) {
            console.error("Nenhum ID de arquivo encontrado na URL!");
            document.getElementById('formularioCadastro').innerHTML = "<h2>Erro: ID não encontrado na URL.</h2>";
            return;
        }

        console.log("ID encontrado:", arquivoId);

        // Referência para este arquivo específico no banco de dados
        const arquivoRef = db.ref('arquivos/' + arquivoId);
        
        // Elementos que vamos preencher
        const localDisplay = document.getElementById('localizacaoAtualDisplay');
        const tipoDisplay = document.getElementById('tipoArquivoDisplay');
        const dataDisplay = document.getElementById('dataCadastroDisplay');

        // 2. BUSCAR OS DADOS NO REALTIME DATABASE (EM TEMPO REAL)
        arquivoRef.on('value', (snapshot) => {
            const data = snapshot.val();
            
            if (data) {
                console.log("Dados recebidos:", data);
                // Coloca os dados nos campos <span id="...">
                nomeDisplay.innerText = data.nome;
                localDisplay.innerText = data.localizacao; // A localização atual
                tipoDisplay.innerText = data.tipo;
                
                // Formata a data
                const dataCadastro = new Date(data.dataCadastro);
                dataDisplay.innerText = dataCadastro.toLocaleString('pt-BR');

            } else {
                console.error("Nenhum dado encontrado para este ID.");
                nomeDisplay.innerText = "Arquivo não encontrado.";
                localDisplay.innerText = "N/A";
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

            // ATUALIZA o campo 'localizacao' no banco de dados
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
            // Redireciona o usuário para a página de cadastro
            window.location.href = "automacao.html";
        });
        
    } // Fim do 'if (nomeDisplay)'
});