// =======================================================
//     COLE ISSO NO COMEÇO DO SEU ARQUIVO inicial.js
// =======================================================

// Sua configuração do Firebase (copie e cole do site do Firebase)
const firebaseConfig = {
    apiKey: "COLE_SUA_API_KEY_COMPLETA_AQUI", // Pegue da tela do Firebase
    authDomain: "architech-vitor-tcc.firebaseapp.com",
    projectId: "architech-vitor-tcc",
    storageBucket: "architech-vitor-tcc.appspot.com",
    messagingSenderId: "COLE_SEU_MESSAGING_SENDER_ID_COMPLETO_AQUI", // Pegue da tela do Firebase
    appId: "COLE_SEU_APP_ID_COMPLETO_AQUI", // Pegue da tela do Firebase
    measurementId: "G-Q77B66GZ03"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Deixa o banco de dados (db) e o storage prontos para usar
const db = firebase.firestore();
const storage = firebase.storage();

console.log("Firebase Conectado com SUCESSO a partir do inicial.js!"); 


// ----- O RESTO DO SEU CÓDIGO DO 'inicial.js' VEM DEPOIS DAQUI -----
// ...
// ...
// --- SCRIPT DA TELA DE CARREGAMENTO ---
window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    // Define o tempo que a splash screen ficará visível (em milissegundos)
    const splashDuration = 2500; // 2.5 segundos

    setTimeout(() => {
        // Adiciona a classe para iniciar a transição de desaparecimento
        splashScreen.classList.add('hidden');

        // Mostra o conteúdo principal após a transição da splash screen
        splashScreen.addEventListener('transitionend', () => {
            // Garante que a splash seja removida do DOM após a animação
            if (splashScreen) {
                splashScreen.remove(); 
            }
            mainContent.style.display = 'grid'; // Usa 'grid' como no seu CSS original
        }, { once: true }); // O evento só será executado uma vez

    }, splashDuration);
});


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
//     LÓGICA DO FORMULÁRIO DE AUTOMAÇÃO
// =======================================================

// Verifica se estamos na página que contém o formulário
// (Isso evita erros em outras páginas, como a login.html)
if (document.getElementById('btnSalvarArquivo')) {

    // 1. Pega os elementos do HTML
    const btnSalvar = document.getElementById('btnSalvarArquivo');
    const nomeArquivoInput = document.getElementById('nomeArquivo');
    const localizacaoInput = document.getElementById('localizacaoArquivo');
    const tipoArquivoInput = document.getElementById('tipoArquivo');
    const qrcodeDiv = document.getElementById('qrcode');

    // 2. Cria um "ouvinte" para o clique no botão
    btnSalvar.addEventListener('click', function() {
        
        // 3. Pega os valores digitados pelo usuário
        const nome = nomeArquivoInput.value;
        const local = localizacaoInput.value;
        const tipo = tipoArquivoInput.value;

        // Validação simples: impede salvar se campos estiverem vazios
        if (!nome || !local) {
            alert("Por favor, preencha o Nome e a Localização!");
            return; // Para a execução
        }

        console.log("Salvando no Firestore:", nome, local, tipo);
        btnSalvar.innerText = "Salvando..."; // Feedback visual no botão
        btnSalvar.disabled = true; // Desabilita o botão para evitar cliques duplos

        // 4. Manda os dados para o Firestore
        // Ele vai criar uma coleção chamada "arquivos" (se não existir)
        db.collection("arquivos").add({
            nome: nome,
            localizacao: local,
            tipo: tipo,
            dataCadastro: firebase.firestore.FieldValue.serverTimestamp() // Salva a data atual
        })
        .then((docRef) => {
            // 5. DEU CERTO! O Firestore salvou e devolveu um ID
            console.log("Documento salvo com ID: ", docRef.id);
            
            // Limpa o formulário
            nomeArquivoInput.value = "";
            localizacaoInput.value = "";
            
            // 6. GERA O QR CODE
            
            // Limpa qualquer QR code antigo que estava ali
            qrcodeDiv.innerHTML = ""; 
            
            // Define a URL para qual o QR code vai apontar
            // (Vamos criar essa página 'arquivo.html' depois)
            const urlParaQR = `https://site-archi-tech-projeto-tcc.vercel.app/arquivo.html?id=${docRef.id}`;
            
            // Cria o QR Code!
            new QRCode(qrcodeDiv, {
                text: urlParaQR,
                width: 150,
                height: 150,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
            
            alert("Arquivo salvo com sucesso! Imprima o QR Code.");
            btnSalvar.innerText = "Salvar e Gerar QR Code"; // Restaura o texto
            btnSalvar.disabled = false; // Habilita o botão de novo

        })
        .catch((error) => {
            // 7. DEU ERRO!
            console.error("Erro ao salvar documento: ", error);
            alert("Ocorreu um erro ao salvar. Tente novamente.");
            btnSalvar.innerText = "Salvar e Gerar QR Code";
            btnSalvar.disabled = false;
        });

        // NOTA: O upload do arquivo (PDF/JPG) é um passo mais complexo
        // Vamos fazer isso funcionar primeiro, depois adicionamos o upload.
    });
}