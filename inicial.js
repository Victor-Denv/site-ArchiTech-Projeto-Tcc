const firebaseConfig = {
  apiKey: "AIzaSyD",
  authDomain: "architech-vitor-tcc.firebaseapp.com",

  // ADICIONE ESTA LINHA COM A URL CORRETA DA IMAGEM 124 ADD
  databaseURL: "https://architeck-e92b4-default-rtdb.firebaseio.com/",

  projectId: "architech-vitor-tcc",
  storageBucket: "architech-vitor-tcc.appspot.com",
  messagingSenderId: "17923...",
  appId: "1:17923...",
  measurementId: "G-Q77B66GZ03"
}

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