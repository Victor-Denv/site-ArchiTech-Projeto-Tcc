    // Comentário para forçar deploy v33 - FINAL COM MONITORAMENTO
    const firebaseConfig = {
      apiKey: "AIzaSyCPym-OjXGXY7IhA1u3DDPIOPi5tECDhR8",
  authDomain: "architeck-e92b4.firebaseapp.com",
  databaseURL: "https://architeck-e92b4-default-rtdb.firebaseio.com",
  projectId: "architeck-e92b4",
  storageBucket: "architeck-e92b4.firebasestorage.app",
  messagingSenderId: "97992394607",
  appId: "1:97992394607:web:5407c85e8a8f1859474a9a",
  measurementId: "G-TWL8FMM830"
    };

    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
    const storage = firebase.storage();
    const db = firebase.database();
    const auth = firebase.auth();
    console.log("Firebase Conectado com SUCESSO a partir do inicial.js!");
// =======================================================
//     O "SEGURANÇA" E CONTROLE DE ACESSO (SaaS MULTI-EMPRESA)
// =======================================================
// Variáveis globais para guardar o cargo e a EMPRESA do usuário
window.cargoAtual = localStorage.getItem('userCargo') || 'funcionario';
window.idEmpresa = localStorage.getItem('userIdEmpresa') || null;

// --- QUEM ESTÁ LOGADO? ---
firebase.auth().onAuthStateChanged(function(user) {
    const isLoginPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('login.html');
    
    if (user) {
        if (isLoginPage) window.location.href = "inicial.html";

        // VAI NO BANCO E LÊ A FICHA DO USUÁRIO
        db.ref('usuarios/' + user.uid).once('value').then((snapshot) => {
            const dadosUsuario = snapshot.val();
            
            // REGRA NOVA: ELE SÓ PODE LER. NÃO PODE MAIS SALVAR AQUI.
            if (dadosUsuario) {
                window.cargoAtual = dadosUsuario.cargo;
                window.idEmpresa = dadosUsuario.id_empresa;
                window.nomeUsuario = dadosUsuario.nome || user.email;
                
                // Trava de Segurança
                if (!window.idEmpresa) {
                    alert("ERRO: Sua empresa não foi registrada corretamente. Refaça o cadastro.");
                    firebase.auth().signOut().then(() => window.location.replace("../index.html"));
                    return;
                }

                // Atualiza o menu e as telas
                localStorage.setItem('userCargo', window.cargoAtual);
                localStorage.setItem('userIdEmpresa', window.idEmpresa);
                
                const userEmailDisplay = document.getElementById('user-email-display');
                if (userEmailDisplay) userEmailDisplay.innerHTML = `<i class="fa-solid fa-user-circle"></i> Olá, ${window.nomeUsuario}`;

                if (typeof aplicarFiltrosDeMenu === 'function') aplicarFiltrosDeMenu(window.cargoAtual);
                if (typeof aplicarTravasDeConsulta === 'function') aplicarTravasDeConsulta(window.cargoAtual);

                // Agora sim ele libera para carregar as coisas da tela!
                if (typeof listarEquipe === 'function') listarEquipe();
                if (typeof carregarArquivos === 'function') carregarArquivos();
                
            } else {
                alert("Acesso revogado ou perfil não encontrado.");
                firebase.auth().signOut().then(() => window.location.replace("../index.html"));
            }
        });
    } else {
        if (!isLoginPage) window.location.href = "../index.html";
    }
});

function aplicarFiltrosDeMenu(cargo) {
    const linksMenu = document.querySelectorAll('.menu-navegacao a');

    linksMenu.forEach(link => {
        const href = link.getAttribute('href');
        const liPai = link.parentElement;

        // REGRA OURO: Só o 'chefe' vê a aba de Configurações (onde cria usuários)
        if (cargo !== 'chefe') {
            if (href.includes('configuracoes.html')) {
                liPai.style.display = 'none';
            }
        }

        // Restrições específicas do Usuário de Consulta
        if (cargo === 'consulta') {
            if (href.includes('automacao.html') || href.includes('relatorio.html') || 
                href.includes('painel-chamados.html') || href.includes('monitor.html') || 
                href.includes('seguranca.html') || href.includes('mensagem.html')) {
                liPai.style.display = 'none';
            }
        }
        // Restrições do Funcionário e TI (mantendo sua lógica original)
        else if (cargo === 'funcionario' || cargo === 'ti') {
            if (href.includes('relatorio.html') || href.includes('painel-chamados.html') || 
                href.includes('monitor.html') || href.includes('seguranca.html')) {
                liPai.style.display = 'none';
            }
        }
    });
}

function aplicarTravasDeConsulta(cargo) {
    // Esconde os botões perigosos se o usuário for apenas de leitura
    if (cargo === 'consulta') {
        const btnDeletar = document.getElementById('btnDeletar');
        const boxAtualizarLocal = document.getElementById('btnAtualizarLocal')?.parentElement;
        const btnSalvarArquivo = document.getElementById('btnSalvarArquivo'); 
        
        if (btnDeletar) btnDeletar.style.display = 'none'; 
        if (boxAtualizarLocal) boxAtualizarLocal.style.display = 'none'; 
        if (btnSalvarArquivo) btnSalvarArquivo.style.display = 'none'; 
    }
}

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
});

  // =======================================================
    //      LÓGICA DA PÁGINA 'automacao.html' (IA E SALVAR)
    // =======================================================
    document.addEventListener('DOMContentLoaded', function() {
        const btnSalvar = document.getElementById('btnSalvarArquivo');
        
        // Só executa se estivermos na página de automação (onde o botão salvar existe)
        if (btnSalvar) { 
            console.log("DEBUG: Iniciando lógica da página automacao.html.");
            
            // Captura todos os campos de uma vez para que tanto a IA quanto o Salvar os vejam
            const nomeArquivoInput = document.getElementById('nomeArquivo');
            const localizacaoInput = document.getElementById('localizacaoArquivo');
            const tipoArquivoInput = document.getElementById('tipoArquivo');
            const qrcodeDiv = document.getElementById('qrcode');
            const arquivoUploadInput = document.getElementById('arquivoUpload');
            const btnProcessarIA = document.getElementById('btnProcessarIA');
            const textoExtraidoIA = document.getElementById('textoExtraidoIA');
            const iaStatus = document.getElementById('iaStatus');

            // --- 1. LÓGICA DO PROCESSAMENTO COM IA ---
            if (btnProcessarIA) {
                btnProcessarIA.addEventListener('click', function() {
                    if (!arquivoUploadInput || !arquivoUploadInput.files[0]) {
                        alert("Por favor, anexe um arquivo primeiro."); return;
                    }
                    const file = arquivoUploadInput.files[0];
                    if(iaStatus) { iaStatus.innerText = "Analisando contexto..."; iaStatus.style.color = "#ffc107"; }
                    btnProcessarIA.disabled = true;

                    setTimeout(() => {
                        const nomeOriginal = file.name;
                        let nomeLimpo = nomeOriginal.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                        nomeLimpo = nomeLimpo.replace(/\b\w/g, l => l.toUpperCase());

                        if (nomeArquivoInput) nomeArquivoInput.value = nomeLimpo;
                        if(iaStatus) { iaStatus.innerText = "Análise concluída!"; iaStatus.style.color = "#28a745"; }
                        btnProcessarIA.innerText = "Processar com IA";
                        btnProcessarIA.disabled = false;
                    }, 1500); 
                });
            }

            // --- 2. LÓGICA DO BOTÃO SALVAR ---
            btnSalvar.addEventListener('click', function() {
                const nome = nomeArquivoInput.value;
                const local = localizacaoInput.value;
                const visibilidade = document.getElementById('visibilidadeArquivo')?.value || 'simples';
                const file = arquivoUploadInput.files[0];

                if (!nome || !local) { alert("Preencha Nome e Localização!"); return; }
                if (!window.idEmpresa) { alert("Erro de Sessão: ID da Empresa não encontrado."); return; }

                btnSalvar.innerText = "Salvando...";
                btnSalvar.disabled = true;

                const finalizarSalvamento = (base64) => {
                    db.ref('workspaces/' + window.idEmpresa + '/arquivos').push({
                        nome: nome,
                        localizacao: local,
                        tipo: tipoArquivoInput.value,
                        visibilidade: visibilidade,
                        anexoUrl: base64,
                        textoExtraido: textoExtraidoIA ? textoExtraidoIA.value : null,
                        dataCadastro: firebase.database.ServerValue.TIMESTAMP
                    }).then((snap) => {
                        if(qrcodeDiv) {
                            qrcodeDiv.innerHTML = "";
                            const urlParaQR = `${window.location.origin}/html/arquivo.html?id=${snap.key}`;
                            new QRCode(qrcodeDiv, { text: urlParaQR, width: 150, height: 150 });
                        }
                        alert("Arquivo salvo com sucesso!");
                        btnSalvar.innerText = "Salvar e Gerar QR Code";
                        btnSalvar.disabled = false;
                        
                        // Limpa os campos
                        if(nomeArquivoInput) nomeArquivoInput.value = "";
                        if(localizacaoInput) localizacaoInput.value = "";
                        if(arquivoUploadInput) arquivoUploadInput.value = null;
                    });
                };

                if (file) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => finalizarSalvamento(reader.result);
                } else {
                    finalizarSalvamento(null);
                }
            });
        } 
    }); // Fim do bloco principal da automação
            // =======================================================
//     LÓGICA DA PÁGINA 'listar.html' (COM TRAVA DE SIGILO)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const containerDaLista = document.getElementById('containerDaLista');
    
    if (containerDaLista) {
        console.log("DEBUG: Iniciando listagem segura...");
        
        // Bloqueio de segurança caso a sessão não esteja carregada
        if (!window.idEmpresa) {
            containerDaLista.innerHTML = "<p>Erro: Sessão não identificada. Recarregue a página.</p>";
            return;
        }

        // Busca apenas na gaveta da empresa atual
        const arquivosRef = db.ref('workspaces/' + window.idEmpresa + '/arquivos');
        
        arquivosRef.once('value', (snapshot) => {
            const dados = snapshot.val();
            containerDaLista.innerHTML = ""; // Limpa a tela
            
            if (dados) {
                Object.keys(dados).forEach(key => {
                    const arquivo = dados[key];
                    
                    // --- O DECRETO DE SIGILO ---
                    // Se o arquivo for CONFIDENCIAL e quem está vendo NÃO for o CHEFE:
                    if (arquivo.visibilidade === 'confidencial' && window.cargoAtual !== 'chefe') {
                        return; // O sistema ignora este arquivo e pula para o próximo
                    }

                    // Se passou pela trava, desenha o item na tela
                    const iconeSigilo = arquivo.visibilidade === 'confidencial' ? '🔒' : '📂';
                    
                    const itemHtml = `
                        <div class="item-lista-arquivo" style="${arquivo.visibilidade === 'confidencial' ? 'border-left: 4px solid #ff4757;' : ''}">
                            <div class="item-info">
                                <span style="margin-right: 8px;">${iconeSigilo}</span>
                                <strong>Nome:</strong> ${arquivo.nome || 'Sem nome'} <br>
                                <strong>Local:</strong> ${arquivo.localizacao || 'Não informado'}
                                ${arquivo.visibilidade === 'confidencial' ? '<br><small style="color: #ff4757; font-weight: bold;">ACESSO RESTRITO</small>' : ''}
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

                // Caso a empresa tenha arquivos, mas todos sejam confidenciais para o usuário atual
                if (containerDaLista.innerHTML === "") {
                    containerDaLista.innerHTML = "<p>Nenhum arquivo disponível para o seu nível de acesso.</p>";
                }

            } else {
                containerDaLista.innerHTML = "<p>Nenhum arquivo cadastrado no acervo da sua empresa.</p>";
            }
        }).catch((error) => { 
            console.error("Erro ao listar:", error);
            containerDaLista.innerHTML = "<p>Erro ao carregar acervo. Verifique sua conexão.</p>";
        });
    }
});
   
// =======================================================
    //     LÓGICA DA PÁGINA 'arquivo.html' (TUDO INTEGRADO + PROTEÇÃO)
    // =======================================================
    document.addEventListener('DOMContentLoaded', function() {
        const nomeDisplay = document.getElementById('nomeArquivoDisplay');
        
        if (nomeDisplay) {
            const params = new URLSearchParams(window.location.search);
            const arquivoId = params.get('id');

            if (!arquivoId || !window.idEmpresa) {
                nomeDisplay.innerText = "Erro: Arquivo não encontrado ou Sessão expirada.";
                return;
            }

            // --- A MÁGICA 3: ENCONTRA O DETALHE NA GAVETA DA EMPRESA ---
            const arquivoRef = db.ref('workspaces/' + window.idEmpresa + '/arquivos/' + arquivoId);
            let dadosArquivoAtual = null;

            arquivoRef.on('value', (snapshot) => {
                const data = snapshot.val();
                
                if (data) {
                    // ==========================================
                    // 🛡️ O BLOQUEIO DE SEGURANÇA CONTRA LINK DIRETO
                    // ==========================================
                    if (data.visibilidade === 'confidencial' && window.cargoAtual !== 'chefe') {
                        alert("⚠️ ACESSO NEGADO: Este documento é confidencial e restrito ao Arquivista Chefe.");
                        // Destrói a tela inteira para esconder os dados e expulsa o usuário
                        document.body.innerHTML = "<h2 style='text-align: center; margin-top: 20%; color: #ff4757; font-family: sans-serif;'>Acesso Negado. Redirecionando...</h2>";
                        window.location.href = "listar.html";
                        return; // O 'return' garante que o código abaixo NÃO seja executado!
                    }
                    // ==========================================

                    dadosArquivoAtual = data;
                    nomeDisplay.innerText = data.nome;
                    document.getElementById('localizacaoAtualDisplay').innerText = data.localizacao;
                    document.getElementById('tipoArquivoDisplay').innerText = data.tipo;
                    document.getElementById('dataCadastroDisplay').innerText = new Date(data.dataCadastro).toLocaleString('pt-BR');

                    if (data.textoExtraido) {
                        document.getElementById('areaTextoIA').style.display = 'block';
                        document.getElementById('textoIADisplay').value = data.textoExtraido;
                    }

                    if (data.anexoUrl) {
                        document.getElementById('btnVisualizar').style.display = 'inline-block';
                        document.getElementById('btnBaixar').style.display = 'inline-block';
                    }

                    const qrcodeDiv = document.getElementById('qrcodeDetalhes');
                    if (qrcodeDiv) {
                        qrcodeDiv.innerHTML = ""; 
                        const urlParaQR = window.location.href; 
                        new QRCode(qrcodeDiv, { text: urlParaQR, width: 128, height: 128 });
                    }
                } else {
                    nomeDisplay.innerText = "Arquivo não encontrado ou deletado.";
                }
            });

            const btnDeletar = document.getElementById('btnDeletar');
            if (btnDeletar) {
                btnDeletar.addEventListener('click', function() {
                    if (confirm("CUIDADO: Tem certeza que deseja DELETAR permanentemente este registro?")) {
                        arquivoRef.remove().then(() => {
                            alert("Arquivo deletado!");
                            window.location.href = "listar.html";
                        }).catch(error => alert("Erro ao deletar: " + error));
                    }
                });
            }

            const areaVisualizador = document.getElementById('areaVisualizador');
            const iframeVisualizador = document.getElementById('iframeVisualizador');
            
            document.getElementById('btnVisualizar').addEventListener('click', function() {
                if (dadosArquivoAtual && dadosArquivoAtual.anexoUrl) {
                    iframeVisualizador.src = dadosArquivoAtual.anexoUrl;
                    areaVisualizador.style.display = 'block';
                }
            });

            document.getElementById('btnFecharVisualizador').addEventListener('click', function() {
                areaVisualizador.style.display = 'none';
                iframeVisualizador.src = "";
            });

            document.getElementById('btnBaixar').addEventListener('click', function() {
                if (dadosArquivoAtual && dadosArquivoAtual.anexoUrl) {
                    let extensao = ".pdf";
                    if (dadosArquivoAtual.anexoUrl.includes("image/jpeg")) extensao = ".jpg";
                    if (dadosArquivoAtual.anexoUrl.includes("image/png")) extensao = ".png";

                    const linkDownload = document.createElement("a");
                    linkDownload.href = dadosArquivoAtual.anexoUrl;
                    linkDownload.download = dadosArquivoAtual.nome + extensao;
                    document.body.appendChild(linkDownload);
                    linkDownload.click();
                    document.body.removeChild(linkDownload);
                }
            });

            const btnAtualizar = document.getElementById('btnAtualizarLocal');
            const novaLocalizacaoInput = document.getElementById('novaLocalizacaoInput');

            if (btnAtualizar && novaLocalizacaoInput) {
                btnAtualizar.addEventListener('click', function() {
                    const novaLocalizacao = novaLocalizacaoInput.value;
                    if (!novaLocalizacao) { alert("Digite a nova localização."); return; }
                    btnAtualizar.innerText = "Salvando...";
                    arquivoRef.update({ localizacao: novaLocalizacao })
                    .then(() => {
                        alert("Localização atualizada com sucesso!");
                        novaLocalizacaoInput.value = "";
                        btnAtualizar.innerText = "Salvar Novo Local";
                    })
                    .catch((error) => {
                        alert("Erro ao atualizar: " + error);
                        btnAtualizar.innerText = "Salvar Novo Local";
                    });
                });
            }
        }
    });

    // =======================================================
    //     LÓGICA DA PÁGINA 'monitor.html' (LER TEMPERATURA) - ATUALIZADO 2 SALAS!
    // =======================================================
    document.addEventListener('DOMContentLoaded', function() {
        const tempDisplaySala1 = document.getElementById('temp-display-sala1');
        
        if (tempDisplaySala1) { 
            console.log("DEBUG: Iniciando lógica da página monitor.html (2 salas).");

            function atualizarPainel(temperatura, display, unit, status) {
                if (temperatura !== null && !isNaN(temperatura)) {
                    display.innerText = temperatura.toFixed(1); 
                    if (temperatura < 18) {
                        status.innerText = "Status: Muito Frio";
                        display.style.color = "#00ccff"; unit.style.color = "#00ccff";
                    } else if (temperatura > 26) {
                        status.innerText = "Status: Muito Quente!";
                        display.style.color = "#ff6600"; unit.style.color = "#ff6600";
                    } else {
                        status.innerText = "Status: Ideal";
                        display.style.color = "#00ff00"; unit.style.color = "#00ff00";
                    }
                } else {
                    display.innerText = "--";
                    status.innerText = "Sem dados do sensor.";
                    display.style.color = "#aaa"; unit.style.color = "#aaa";
                }
            }

            const tempStatusSala1 = document.getElementById('temp-status-sala1');
            const tempUnitSala1 = document.getElementById('temp-unit-sala1');
            const tempRefSala1 = db.ref('sensores/sala_principal/temperatura'); 

            tempRefSala1.on('value', (snapshot) => {
                atualizarPainel(snapshot.val(), tempDisplaySala1, tempUnitSala1, tempStatusSala1);
            }, (errorObject) => {
                if(tempStatusSala1) tempStatusSala1.innerText = "Erro de conexão.";
                if(tempDisplaySala1) tempDisplaySala1.innerText = "X";
            });

            const tempDisplaySala2 = document.getElementById('temp-display-sala2');
            const tempStatusSala2 = document.getElementById('temp-status-sala2');
            const tempUnitSala2 = document.getElementById('temp-unit-sala2');
            const tempRefSala2 = db.ref('sensores/sala_secundaria/temperatura'); 

            tempRefSala2.on('value', (snapshot) => {
                atualizarPainel(snapshot.val(), tempDisplaySala2, tempUnitSala2, tempStatusSala2);
            }, (errorObject) => {
                if(tempStatusSala2) tempStatusSala2.innerText = "Erro de conexão.";
                if(tempDisplaySala2) tempDisplaySala2.innerText = "X";
            });
        }
    }); 
 // =======================================================
// LÓGICA DO BOTÃO "SAIR" (LOGOUT)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const btnSair = document.getElementById('btn-logout');

    if (btnSair) {
        btnSair.addEventListener('click', function(e) {
            e.preventDefault(); 
            btnSair.style.opacity = "0.5"; 
            
            localStorage.removeItem('userCargo');
            
            auth.signOut().then(() => {
                localStorage.clear();
              window.idEmpresa = null;
                window.cargoAtual = null;
                // A MÁGICA ESTÁ AQUI: ../ manda ele voltar pra pasta raiz!
                window.location.replace("../index.html"); 
            }).catch((error) => {
                console.error("Erro ao sair do sistema:", error);
                alert("Erro ao tentar sair. Tente novamente.");
                btnSair.style.opacity = "1";
            });
        });
    }
});

    // =======================================================
    //     LÓGICA DA PÁGINA 'suporte.html' (ABRIR CHAMADO)
    // =======================================================
    document.addEventListener('DOMContentLoaded', function() {
        const btnSalvarChamado = document.getElementById('btnSalvarChamado');
        
        if (btnSalvarChamado) { // Verifica se estamos na página de suporte
            console.log("DEBUG: Iniciando lógica da página suporte.html.");
            const descInput = document.getElementById('descChamado');
            const impactoInput = document.getElementById('impactoChamado');

            btnSalvarChamado.addEventListener('click', function() {
                const descricao = descInput.value;
                const impacto = impactoInput.value;

                if (!descricao || !impacto) { 
                    alert("Por favor, preencha a Descrição e o Impacto do problema."); 
                    return; 
                }

                btnSalvarChamado.innerText = "Enviando...";
                btnSalvarChamado.disabled = true;

                // Salvando no Firebase conforme modelo de incidente da Aula 06
                const chamadosRef = db.ref('chamados');
                chamadosRef.push({
                    descricao: descricao,
                    impacto: impacto,
                    status: 'Aberto', // Controle de status exigido na Aula 06
                    prioridade: 'Não definida', // Líder define depois
                    solucao: '',
                    teste_aplicado: '',
                    evidencia: '',
                    data_abertura: firebase.database.ServerValue.TIMESTAMP
                })
                .then((snapshot) => {
                    const docId = snapshot.key;
                    console.log("Chamado aberto com ID: ", docId);
                    alert("Chamado de suporte enviado com sucesso!");
                    descInput.value = "";
                    impactoInput.value = "";
                    btnSalvarChamado.innerText = "Enviar Chamado";
                    btnSalvarChamado.disabled = false;
                })
                .catch((error) => {
                    console.error("Erro ao abrir chamado: ", error);
                    alert("Ocorreu um erro ao enviar. Tente novamente.");
                    btnSalvarChamado.innerText = "Enviar Chamado";
                    btnSalvarChamado.disabled = false;
                });
            });
        }
    });

    // =======================================================
    //     LÓGICA DA PÁGINA 'painel-chamados.html' (EQUIPE)
    // =======================================================
    document.addEventListener('DOMContentLoaded', function() {
        const listaDeChamados = document.getElementById('listaDeChamados');
        const areaEdicaoChamado = document.getElementById('areaEdicaoChamado');
        
        if (listaDeChamados) {
            console.log("DEBUG: Iniciando Painel de Chamados.");
            const chamadosRef = db.ref('chamados');

            // Carregar lista de chamados
            chamadosRef.on('value', (snapshot) => {
                listaDeChamados.innerHTML = "";
                const dados = snapshot.val();
                
                if (dados) {
                    Object.keys(dados).forEach(key => {
                        const chamado = dados[key];
                        // Define cor baseada no status
                        let corStatus = "#ccc";
                        if(chamado.status === "Resolvido") corStatus = "#28a745"; // Verde
                        if(chamado.status === "Em correção" || chamado.status === "Em teste") corStatus = "#ffc107"; // Amarelo
                        if(chamado.status === "Aberto" || chamado.status === "Reaberto") corStatus = "#dc3545"; // Vermelho

                        const itemHtml = `
                            <div style="background-color: #333; padding: 15px; border-radius: 5px; margin-bottom: 10px; border-left: 5px solid ${corStatus}; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <strong>Descrição:</strong> ${chamado.descricao} <br>
                                    <span style="font-size: 12px; color: #aaa;">Status: <span style="color:${corStatus}; font-weight:bold;">${chamado.status}</span> | Impacto: ${chamado.impacto} | Prioridade: ${chamado.prioridade || 'Não definida'}</span>
                                </div>
                                <button onclick="editarChamado('${key}')" style="padding: 8px 15px; background-color: #6f42c1; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Atender</button>
                            </div>
                        `;
                        listaDeChamados.innerHTML += itemHtml;
                    });
                } else {
                    listaDeChamados.innerHTML = "<p>Nenhum chamado registrado no momento.</p>";
                }
            });

            // Função global para abrir o editor (disponível no clique do botão HTML gerado acima)
            window.editarChamado = function(id) {
                db.ref('chamados/' + id).once('value').then((snapshot) => {
                    const data = snapshot.val();
                    if(data) {
                        document.getElementById('editChamadoId').value = id;
                        document.getElementById('displayDescricao').innerText = data.descricao;
                        document.getElementById('displayImpacto').innerText = data.impacto;
                        document.getElementById('editStatus').value = data.status || "Aberto";
                        document.getElementById('editPrioridade').value = data.prioridade || "Baixa";
                        document.getElementById('editSolucao').value = data.solucao || "";
                        document.getElementById('editTeste').value = data.teste_aplicado || "";
                        
                        areaEdicaoChamado.style.display = "block";
                        window.scrollTo(0, document.body.scrollHeight); // Rola para baixo
                    }
                });
            };

            // Salvar as atualizações
            const btnAtualizarChamado = document.getElementById('btnAtualizarChamado');
            if (btnAtualizarChamado) {
                btnAtualizarChamado.addEventListener('click', function() {
                    const id = document.getElementById('editChamadoId').value;
                    const novoStatus = document.getElementById('editStatus').value;
                    const novaPrioridade = document.getElementById('editPrioridade').value;
                    const novaSolucao = document.getElementById('editSolucao').value;
                    const novoTeste = document.getElementById('editTeste').value;

                    db.ref('chamados/' + id).update({
                        status: novoStatus,
                        prioridade: novaPrioridade,
                        solucao: novaSolucao,
                        teste_aplicado: novoTeste
                    }).then(() => {
                        alert("Chamado atualizado com sucesso!");
                        areaEdicaoChamado.style.display = "none";
                    }).catch((error) => {
                        console.error("Erro ao atualizar chamado:", error);
                        alert("Erro ao salvar.");
                    });
                });
            }

            // Cancelar edição
            const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
            if(btnCancelarEdicao) {
                btnCancelarEdicao.addEventListener('click', () => {
                    areaEdicaoChamado.style.display = "none";
                });
            }
        }
    });
  // =======================================================
//      LÓGICA DA PÁGINA 'relatorio.html'
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('graficoTipos');
    
    // Só executa se estivermos na página relatorio.html (se o canvas existir)
    if (ctx) {
        // SEGURANÇA: Só busca se o ID da empresa existir
        if (!window.idEmpresa) {
            console.log("Aguardando ID da empresa para carregar relatório...");
            return;
        }

        console.log("Página de relatório carregada. Buscando dados da empresa:", window.idEmpresa);
        
        // BUSCA NA GAVETA CORRETA: workspaces/ID/arquivos
        const arquivosRef = db.ref('workspaces/' + window.idEmpresa + '/arquivos');

        // .on('value') garante atualização em TEMPO REAL
        arquivosRef.on('value', (snapshot) => {
            const dados = snapshot.val();
            
            let qtdDocs = 0;
            let qtdImagens = 0;
            let qtdOutros = 0;
            let total = 0;

            if (dados) {
                // Conta os arquivos da empresa logada
                Object.values(dados).forEach(arquivo => {
                    total++;
                    if (arquivo.tipo === 'documento') qtdDocs++;
                    else if (arquivo.tipo === 'imagem') qtdImagens++;
                    else qtdOutros++;
                });
            }

            // Atualiza os cartões na tela
            if (document.getElementById('totalArquivos')) document.getElementById('totalArquivos').innerText = total;
            if (document.getElementById('totalDocs')) document.getElementById('totalDocs').innerText = qtdDocs;
            if (document.getElementById('totalImagens')) document.getElementById('totalImagens').innerText = qtdImagens;

            // Gerenciamento do Gráfico (destrói o anterior para não sobrepor)
            if (window.meuGraficoTipos) {
                window.meuGraficoTipos.destroy();
            }

            window.meuGraficoTipos = new Chart(ctx, {
                type: 'doughnut', 
                data: {
                    labels: ['Documentos (PDF)', 'Imagens (JPG/PNG)', 'Outros'],
                    datasets: [{
                        label: 'Quantidade',
                        data: [qtdDocs, qtdImagens, qtdOutros],
                        backgroundColor: ['#28a745', '#ffc107', '#6f42c1'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }, (error) => {
            console.error("Erro ao puxar dados do relatório:", error);
            if (document.getElementById('totalArquivos')) document.getElementById('totalArquivos').innerText = "Erro";
        });
    }
});
 // =======================================================
//      LÓGICA DA PÁGINA 'mensagem.html' (Notificações)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const containerNotificacoes = document.getElementById('containerNotificacoes');
    
    // Só roda se estivermos na página de notificações
    if (containerNotificacoes) {
        
        // SEGURANÇA: Se o ID da empresa ainda não carregou, esperamos um pouco
        if (!window.idEmpresa) {
            containerNotificacoes.innerHTML = "<p style='text-align:center; padding:20px; color:#999;'>Identificando sua empresa...</p>";
            return; 
        }

        // AGORA BUSCA NA GAVETA CORRETA: workspaces/ID/arquivos
        const arquivosRef = db.ref('workspaces/' + window.idEmpresa + '/arquivos');
        
        // Puxa os últimos 15 arquivos cadastrados para gerar os alertas
        arquivosRef.limitToLast(15).on('value', (snapshot) => {
            const dados = snapshot.val();
            containerNotificacoes.innerHTML = ""; // Limpa a tela
            
            if (dados) {
                const chaves = Object.keys(dados).reverse(); 
                
                chaves.forEach(key => {
                    const arquivo = dados[key];
                    const dataObj = new Date(arquivo.dataCadastro);
                    const dataFormatada = dataObj.toLocaleDateString('pt-BR') + ' às ' + dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    
                    let corBorda = "#6f42c1"; 
                    let icone = "fa-file";
                    
                    if(arquivo.tipo === "documento") { corBorda = "#28a745"; icone = "fa-file-pdf"; } 
                    if(arquivo.tipo === "imagem") { corBorda = "#ffc107"; icone = "fa-file-image"; } 
                    
                    const notitificacaoHTML = `
                        <div style="background: white; padding: 20px; border-left: 4px solid ${corBorda}; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); position: relative; margin-bottom: 15px;">
                            <span style="position: absolute; top: 15px; right: 20px; font-size: 11px; color: #999;">${dataFormatada}</span>
                            <div style="display: flex; gap: 15px; align-items: start;">
                                <div style="background-color: #f8f9fa; padding: 10px; border-radius: 50%; color: ${corBorda};">
                                    <i class="fa-solid ${icone} fa-lg"></i>
                                </div>
                                <div>
                                    <h4 style="color: #333; margin-bottom: 5px; font-size: 15px;">Novo arquivo indexado</h4>
                                    <p style="color: #666; font-size: 13px; margin: 0;">
                                        O arquivo <strong>"${arquivo.nome}"</strong> foi catalogado com sucesso na localização <strong>"${arquivo.localizacao}"</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    `;
                    containerNotificacoes.innerHTML += notitificacaoHTML;
                });
            } else {
                containerNotificacoes.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #999;">
                        <i class="fa-solid fa-bell-slash fa-2x" style="margin-bottom: 15px;"></i>
                        <p>Sua empresa ainda não possui notificações de arquivos.</p>
                    </div>`;
            }
        });

        // Botão para limpar a tela (visual)
        const btnLimpar = document.getElementById('btnLimparNotificacoes');
        if(btnLimpar) {
            btnLimpar.addEventListener('click', () => {
                containerNotificacoes.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #999;">
                    <i class="fa-solid fa-check-double fa-2x" style="margin-bottom: 15px;"></i>
                    <p>Notificações removidas da visualização.</p>
                </div>`;
            });
        }
    }
});

   // =======================================================
//     LÓGICA DA PÁGINA 'seguranca.html' (Auditoria)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const tabelaAuditoria = document.getElementById('tabelaAuditoria');
    
    if (tabelaAuditoria) {
        // SEGURANÇA: Só prossegue se o ID da empresa estiver disponível
        if (!window.idEmpresa) {
            tabelaAuditoria.innerHTML = `<tr><td colspan="3" style="padding: 20px; text-align: center; color: #999;">Carregando credenciais de segurança...</td></tr>`;
            return;
        }

        // AGORA BUSCA NA GAVETA CORRETA: workspaces/ID/arquivos
        const arquivosRef = db.ref('workspaces/' + window.idEmpresa + '/arquivos');
        
        // Puxa os últimos 5 arquivos cadastrados para preencher a auditoria
        arquivosRef.limitToLast(5).on('value', (snapshot) => {
            const dados = snapshot.val();
            tabelaAuditoria.innerHTML = ""; // Limpa a tabela
            
            if (dados) {
                // Inverte para mostrar do mais novo para o mais velho no topo
                const chaves = Object.keys(dados).reverse(); 
                
                chaves.forEach(key => {
                    const arquivo = dados[key];
                    const dataFormatada = new Date(arquivo.dataCadastro).toLocaleString('pt-BR');
                    
                    const linha = `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 12px; color: #555;"><strong>${arquivo.nome}</strong></td>
                            <td style="padding: 12px; color: #555;">${arquivo.localizacao}</td>
                            <td style="padding: 12px; color: #888; font-size: 12px;">${dataFormatada}</td>
                        </tr>
                    `;
                    tabelaAuditoria.innerHTML += linha;
                });
            } else {
                tabelaAuditoria.innerHTML = `<tr><td colspan="3" style="padding: 20px; text-align: center; color: #999;">Nenhum registro de auditoria encontrado para esta empresa.</td></tr>`;
            }
        }, (error) => {
            console.error("Erro ao puxar auditoria:", error);
            tabelaAuditoria.innerHTML = `<tr><td colspan="3" style="padding: 12px; text-align: center; color: #ff4757;">Erro de permissão ao acessar registros.</td></tr>`;
        });
    }
});

    // =======================================================
    //     LÓGICA DO GRÁFICO DA PÁGINA INICIAL ('inicial.html')
    // =======================================================
    document.addEventListener('DOMContentLoaded', function() {
    const ctxCapacidade = document.getElementById('graficoCapacidade');
    
    if (ctxCapacidade) {
        // AQUI ESTAVA O ERRO: Mudamos de 'arquivos' para o caminho da sua empresa
        if (!window.idEmpresa) {
            console.error("ID da empresa não encontrado para o gráfico.");
            return;
        }

        const arquivosRef = db.ref('workspaces/' + window.idEmpresa + '/arquivos');
        const capacidadeMaxima = 1000; 

        arquivosRef.on('value', (snapshot) => {
            const dados = snapshot.val();
            let totalArquivos = 0;

            if (dados) {
                totalArquivos = Object.keys(dados).length; 
            }

            const espacoLivre = capacidadeMaxima - totalArquivos;
            
            // Atualiza o texto na tela
            const displayQtd = document.getElementById('qtdArquivosOcupados');
            if (displayQtd) displayQtd.innerText = totalArquivos;

            // Gerenciamento do Gráfico
            if (window.meuGraficoCapacidade) {
                window.meuGraficoCapacidade.destroy();
            }

            window.meuGraficoCapacidade = new Chart(ctxCapacidade, {
                type: 'doughnut',
                data: {
                    labels: ['Ocupado', 'Espaço Livre'],
                    datasets: [{
                        data: [totalArquivos, espacoLivre],
                        backgroundColor: ['#6f42c1', '#e9ecef'],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return (context.label || '') + ': ' + context.parsed + ' arquivos';
                                }
                            }
                        }
                    }
                }
            });
        });
    }
});
    

// --- 2. LISTAR EQUIPE NA TELA DE CONFIGURAÇÕES ---
    window.listarEquipe = function() {
        const listaEquipe = document.getElementById('listaUsuariosCadastrados');
        
        // O CADEADO: Só puxa se já souber a empresa
        if (!listaEquipe || !window.idEmpresa) return;

        // O FILTRO: Busca SÓ quem tem o id_empresa igual ao do chefe logado
        db.ref('usuarios').orderByChild('id_empresa').equalTo(window.idEmpresa).on('value', (snapshot) => {
            listaEquipe.innerHTML = "";
            const dados = snapshot.val();
            if (dados) {
                Object.keys(dados).forEach(uid => {
                    const user = dados[uid];
                    let corBadge = "#95a5a6"; // Cinza
                    let nomeCargo = "Funcionário";
                    
                    if (user.cargo === 'chefe') { corBadge = "#e74c3c"; nomeCargo = "Arquivista Chefe"; }
                    else if (user.cargo === 'ti') { corBadge = "#3498db"; nomeCargo = "Equipe de TI"; }
                    else if (user.cargo === 'consulta') { corBadge = "#f39c12"; nomeCargo = "Consulta"; } 

                    listaEquipe.innerHTML += `
                        <div style="background-color: #f8f9fa; padding: 12px 15px; border-radius: 8px; border-left: 4px solid ${corBadge}; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="color: #2c3e50; font-weight: 500; font-size: 14px;">${user.email}</span>
                            <span style="background-color: ${corBadge}; color: white; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;">${nomeCargo}</span>
                        </div>
                    `;
                });
            } else { 
                listaEquipe.innerHTML = "<div style='color: #7f8c8d; font-size: 14px;'>Você ainda não tem uma equipe cadastrada.</div>"; 
            }
        });
    };

    // Caso a variável já esteja pronta, ele chama a lista na hora
    if (window.idEmpresa) window.listarEquipe();


    // --- 3. CRIAR USUÁRIO ---

    // Adiciona as opções de cargo no select
    setTimeout(() => {
        const selectNivel = document.getElementById('nivelAcessoUser');
        if (selectNivel) {
            selectNivel.innerHTML = `
                <option value="consulta">Usuário de Consulta (Apenas visualização)</option>
                <option value="funcionario">Funcionário / Arquivista</option>
                <option value="ti">Equipe de TI</option>
            `;
        }
    }, 1000);

    const btnCriarUsuario = document.getElementById('btnCriarUsuario');
    if (btnCriarUsuario) {
        btnCriarUsuario.addEventListener('click', function() {
            
            if (window.cargoAtual !== 'chefe') {
                alert("Acesso Negado: Apenas o Arquivista Chefe tem permissão para criar novos usuários.");
                return; 
            }

            const email = document.getElementById('novoEmailUser').value;
            const senha = document.getElementById('novaSenhaUser').value; 
            const cargo = document.getElementById('nivelAcessoUser').value;

            if (!email || !senha) { alert("Preencha o e-mail e a senha."); return; }
            if (senha.length < 6) { alert("A senha deve ter no mínimo 6 caracteres."); return; }

            btnCriarUsuario.innerText = "Processando...";
            btnCriarUsuario.disabled = true;

            let appSecundario;
            try { appSecundario = firebase.app("AppCriador"); } 
            catch (e) { appSecundario = firebase.initializeApp(firebaseConfig, "AppCriador"); }
            
            const authSecundario = appSecundario.auth();

            authSecundario.createUserWithEmailAndPassword(email, senha)
                .then((userCredential) => {
                    const novoUid = userCredential.user.uid;
                    
                    // O CARIMBO: Agora o id_empresa é gravado junto com a ficha!
                    db.ref('usuarios/' + novoUid).set({
                        email: email,
                        cargo: cargo,
                        id_empresa: window.idEmpresa, // <--- A MÁGICA ACONTECE AQUI
                        dataCriacao: firebase.database.ServerValue.TIMESTAMP
                    }).then(() => {
                        authSecundario.signOut();
                        alert(`SUCESSO!\nO usuário ${email} foi criado como ${cargo}.`);
                        
                        document.getElementById('novoEmailUser').value = "";
                        document.getElementById('novaSenhaUser').value = ""; 
                        
                        btnCriarUsuario.innerText = "Criar Conta e Atribuir Permissões";
                        btnCriarUsuario.disabled = false;
                    }).catch((error) => {
                        alert("Houve erro de permissão no banco: " + error.message);
                        btnCriarUsuario.innerText = "Criar Conta e Atribuir Permissões";
                        btnCriarUsuario.disabled = false;
                    });
                })
                .catch((error) => {
                    alert("Erro ao criar: " + error.message);
                    btnCriarUsuario.innerText = "Criar Conta e Atribuir Permissões";
                    btnCriarUsuario.disabled = false;
                });
        });
    }

// =======================================================
//     LÓGICA DA BARRA LATERAL DIREITA (PÁGINA INICIAL)
// =======================================================
window.addEventListener('load', function() {
    const nomeUsuarioSidebar = document.getElementById('nomeUsuarioSidebar');
    const cargoUsuarioSidebar = document.getElementById('cargoUsuarioSidebar');
    const listaUltimosArquivos = document.getElementById('listaUltimosArquivosSidebar');

    // Só executa se estivermos na página inicial (onde essa barra existe)
    if (nomeUsuarioSidebar && listaUltimosArquivos) {
        
        // 1. Puxa o Nome e o Cargo do Usuário Logado
        auth.onAuthStateChanged((user) => {
            if (user) {
                // Pega só a primeira parte do e-mail (ex: vitor@... vira "vitor")
                nomeUsuarioSidebar.innerText = user.email.split('@')[0]; 
                
                db.ref('usuarios/' + user.uid).once('value').then((snapshot) => {
                    const dados = snapshot.val();
                    const cargo = dados ? dados.cargo : 'funcionario';
                    
                    let nomeCargoFormatado = "Funcionário";
                    if (cargo === 'chefe') nomeCargoFormatado = "Arquivista Chefe";
                    else if (cargo === 'ti') nomeCargoFormatado = "Equipe de TI";
                    else if (cargo === 'consulta') nomeCargoFormatado = "Consulta";
                    
                    cargoUsuarioSidebar.innerText = nomeCargoFormatado;

                    // --- A MÁGICA DO ISOLAMENTO NO FEED ---
                    // Só busca os arquivos se o ID da empresa estiver na ficha do usuário
                    const idEmpresaLogada = dados ? dados.id_empresa : null;

                    if (idEmpresaLogada) {
                        // 2. Puxa os últimos 3 arquivos cadastrados APENAS desta empresa
                        db.ref('workspaces/' + idEmpresaLogada + '/arquivos').limitToLast(3).on('value', (snapArquivos) => {
                            listaUltimosArquivos.innerHTML = "";
                            const dadosArqs = snapArquivos.val();
                            
                            if (dadosArqs) {
                                const chaves = Object.keys(dadosArqs).reverse(); // Mais novos primeiro
                                chaves.forEach(key => {
                                    const arq = dadosArqs[key];
                                    
                                    let icone = "fa-file";
                                    let cor = "#6f42c1"; 
                                    if(arq.tipo === 'documento') { icone = 'fa-file-pdf'; cor = '#28a745'; } 
                                    if(arq.tipo === 'imagem') { icone = 'fa-file-image'; cor = '#ffc107'; } 

                                    listaUltimosArquivos.innerHTML += `
                                        <li style="display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0; margin-bottom: 10px;">
                                            <div style="background: ${cor}20; color: ${cor}; width: 35px; height: 35px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">
                                                <i class="fa-solid ${icone}"></i>
                                            </div>
                                            <div style="overflow: hidden; width: 100%;">
                                                <strong style="display: block; font-size: 13px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${arq.nome}</strong>
                                                <span style="font-size: 11px; color: #888;"><i class="fa-solid fa-location-dot" style="margin-right:3px;"></i>${arq.localizacao}</span>
                                            </div>
                                        </li>
                                    `;
                                });
                            } else {
                                listaUltimosArquivos.innerHTML = '<li style="text-align: center; color: #999; font-size: 12px; padding: 10px;">Nenhum arquivo recente.</li>';
                            }
                        });
                    }
                });
            }
        });
    }
});

// =======================================================
// FUNCIONALIDADES DO CABEÇALHO (PESQUISA, SINO E CONFIG)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Clicar nos Ícones (Sino e Configurações)
    const icones = document.querySelectorAll('.icones-cabecalho i');
    if (icones.length >= 2) {
        // Ícone 1 (Configurações / Sliders)
        icones[0].style.cursor = 'pointer';
        icones[0].addEventListener('click', function() {
            window.location.href = 'configuracoes.html';
        });

        // Ícone 2 (Sino de Notificações)
        icones[1].style.cursor = 'pointer';
        icones[1].addEventListener('click', function() {
            window.location.href = 'mensagem.html';
        });
    }

    // 2. Funcionalidade de Pesquisa (Apertar Enter)
    const inputPesquisa = document.querySelector('.barra-pesquisa input');
    if (inputPesquisa) {
        inputPesquisa.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') { 
                e.preventDefault(); // Evita recarregar a tela do zero
                const palavraBuscada = inputPesquisa.value.trim();
                
                if (palavraBuscada !== "") {
                    // Joga o usuário para a página de listar com a palavra na URL
                    window.location.href = `listar.html?busca=${encodeURIComponent(palavraBuscada)}`;
                }
            }
        });
    }
});

// =======================================================
// LÓGICA DA BARRA DE PESQUISA (COM RECOMENDAÇÕES)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const barraPesquisaContainer = document.querySelector('.cabecalho-principal .barra-pesquisa');
    const inputPesquisa = document.querySelector('.cabecalho-principal .barra-pesquisa input');
    
    if (inputPesquisa && barraPesquisaContainer) {
        
        // --- DICIONÁRIO DE ROTAS ---
        const rotasDoSistema = {
            "inicio": "inicial.html", "home": "inicial.html",
            "arquivos": "listar.html", "lista": "listar.html", "acervo": "listar.html",
            "cadastro": "automacao.html", "cadastrar": "automacao.html", "novo": "automacao.html",
            "suporte": "suporte.html", "chamado": "suporte.html",
            "chamados": "painel-chamados.html",
            "equipe": "configuracoes.html", "configurações": "configuracoes.html",
            "relatório": "relatorio.html", "relatorio": "relatorio.html",
            "auditoria": "seguranca.html", "segurança": "seguranca.html",
            "temperatura": "monitor.html", "monitor": "monitor.html",
            "mensagem": "mensagem.html", "notificação": "mensagem.html"
        };

        // --- FUNÇÃO DE SEGURANÇA E REDIRECIONAMENTO ---
        function irParaPagina(paginaDestino) {
            const cargo = window.cargoAtual; 
            
            // Travas de Segurança
            if (cargo === 'consulta' && (paginaDestino.includes('automacao') || paginaDestino.includes('relatorio') || paginaDestino.includes('painel-chamados') || paginaDestino.includes('monitor') || paginaDestino.includes('seguranca') || paginaDestino.includes('configuracoes'))) {
                alert("Acesso Negado: Você não tem permissão para acessar esta página."); return;
            }
            if (cargo === 'funcionario' && (paginaDestino.includes('relatorio') || paginaDestino.includes('painel-chamados') || paginaDestino.includes('monitor') || paginaDestino.includes('seguranca') || paginaDestino.includes('configuracoes'))) {
                alert("Acesso Negado: Você não tem permissão para acessar esta página."); return;
            }
            if (cargo === 'ti' && (paginaDestino.includes('automacao') || paginaDestino.includes('relatorio') || paginaDestino.includes('seguranca') || paginaDestino.includes('configuracoes'))) {
                alert("Acesso Negado: Você não tem permissão para acessar esta página."); return;
            }

            window.location.href = paginaDestino;
        }

        // --- 1. CRIAR O MENU DE RECOMENDAÇÕES ---
        barraPesquisaContainer.style.position = 'relative'; // Segura o menu no lugar certo
        
        const menuRecomendacoes = document.createElement('div');
        menuRecomendacoes.className = 'menu-recomendacoes-pesquisa';
        
        // HTML das opções que vão aparecer
        menuRecomendacoes.innerHTML = `
            <div class="titulo-recomenda">Sugestões Rápidas</div>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li data-link="automacao.html"><i class="fa-solid fa-file-circle-plus"></i> Cadastrar Novo Arquivo</li>
                <li data-link="listar.html"><i class="fa-solid fa-folder-open"></i> Ver Acervo Completo</li>
                <li data-link="painel-chamados.html"><i class="fa-solid fa-headset"></i> Painel de Chamados</li>
                <li data-link="configuracoes.html"><i class="fa-solid fa-users"></i> Gerenciar Equipe</li>
            </ul>
        `;
        barraPesquisaContainer.appendChild(menuRecomendacoes);

        // --- 2. MOSTRAR E ESCONDER O MENU ---
        inputPesquisa.addEventListener('focus', () => {
            menuRecomendacoes.style.display = 'block';
        });

        // Esconde o menu se o usuário clicar em qualquer outro lugar da tela
        document.addEventListener('click', (e) => {
            if (!barraPesquisaContainer.contains(e.target)) {
                menuRecomendacoes.style.display = 'none';
            }
        });

        // --- 3. AÇÃO AO CLICAR EM UMA RECOMENDAÇÃO ---
        const itensMenu = menuRecomendacoes.querySelectorAll('li');
        itensMenu.forEach(item => {
            item.addEventListener('click', function() {
                const destino = this.getAttribute('data-link');
                menuRecomendacoes.style.display = 'none';
                inputPesquisa.value = ""; 
                irParaPagina(destino); // Manda o usuário (se ele tiver permissão)
            });
        });

        // --- 4. AÇÃO AO DIGITAR E APERTAR ENTER ---
        inputPesquisa.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') { 
                e.preventDefault(); 
                const busca = inputPesquisa.value.trim().toLowerCase();
                if (busca !== "") {
                    const paginaDestino = rotasDoSistema[busca];
                    if (paginaDestino) {
                        irParaPagina(paginaDestino);
                    } else {
                        alert(`Página "${inputPesquisa.value}" não encontrada. \nTente: "cadastro", "arquivos", "suporte", "equipe", etc.`);
                    }
                }
            }
        });
    }
});

// =======================================================
// LÓGICA DA BARRA LATERAL DIREITA (PERFIL E FEED)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. CARREGAR NOME E CARGO DO USUÁRIO LOGADO
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Procura o local de colocar o nome e cargo (tenta por ID ou pela Classe do CSS)
            const nomeEl = document.getElementById('nomeUsuarioSidebar') || document.querySelector('.info-perfil strong') || document.querySelector('.info-perfil h4');
            const cargoEl = document.getElementById('cargoUsuarioSidebar') || document.querySelector('.info-perfil span');

            if (nomeEl) {
                // Vai no banco ver se o usuário já salvou um nome personalizado
                db.ref('usuarios/' + user.uid).once('value').then((snapshot) => {
                    const dados = snapshot.val();
                    
                    // Se tiver nome no banco, usa. Se não, usa a primeira parte do e-mail
                    if (dados && dados.nome) {
                        nomeEl.innerText = dados.nome;
                    } else {
                        nomeEl.innerText = user.email.split('@')[0];
                    }

                    // Formata o cargo bonitinho
                    if (cargoEl) {
                        const cargo = dados ? dados.cargo : 'chefe';
                        let nomeCargoFormatado = "Funcionário";
                        if (cargo === 'chefe') nomeCargoFormatado = "Arquivista Chefe";
                        else if (cargo === 'ti') nomeCargoFormatado = "Equipe de TI";
                        else if (cargo === 'consulta') nomeCargoFormatado = "Consulta";

                        cargoEl.innerText = nomeCargoFormatado;
                    }
                });
            }
        }
    });

    // 2. CARREGAR OS ARQUIVOS RECENTES DO ACERVO
    const listaUltimosArquivos = document.getElementById('listaUltimosArquivosSidebar') || document.querySelector('.atividades-disponiveis ul');

    if (listaUltimosArquivos) {
        db.ref('arquivos').limitToLast(3).on('value', (snapshot) => {
            listaUltimosArquivos.innerHTML = ""; // Limpa o "Buscando arquivos..."
            const dados = snapshot.val();

            if (dados) {
                const chaves = Object.keys(dados).reverse(); // Inverte para mostrar o mais novo no topo
                chaves.forEach(key => {
                    const arq = dados[key];

                    let icone = "fa-file";
                    let cor = "#6f42c1"; // Roxo
                    if(arq.tipo === 'documento') { icone = 'fa-file-pdf'; cor = '#28a745'; } // Verde
                    if(arq.tipo === 'imagem') { icone = 'fa-file-image'; cor = '#ffc107'; } // Amarelo

                    listaUltimosArquivos.innerHTML += `
                        <li class="item-atividade" style="display: flex; align-items: center; gap: 15px; padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                            <div class="fundo-icone" style="background-color: ${cor}20; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 8px; flex-shrink: 0;">
                                <i class="fa-solid ${icone}" style="color: ${cor}; font-size: 18px;"></i>
                            </div>
                            <div style="overflow: hidden; width: 100%;">
                                <strong style="display: block; font-size: 13px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${arq.nome}</strong>
                                <span style="font-size: 11px; color: #888;"><i class="fa-solid fa-location-dot" style="margin-right:3px;"></i>${arq.localizacao}</span>
                            </div>
                        </li>
                    `;
                });
            } else {
                listaUltimosArquivos.innerHTML = '<li style="text-align: center; color: #999; padding: 15px; font-size: 12px;">Nenhum arquivo no acervo.</li>';
            }
        });
    }
});

// =======================================================
//   PODERES DO ARQUIVISTA CHEFE (EXPULSAR E RESETAR)
// =======================================================

window.expulsarUsuario = function(uidUsuario, emailUsuario) {
    if (window.cargoAtual !== 'chefe') {
        alert("Ação negada: Apenas o Arquivista Chefe pode remover membros.");
        return;
    }

    if (confirm(`Deseja remover ${emailUsuario} da sua equipe? A conta será banida.`)) {
        db.ref('usuarios/' + uidUsuario).remove()
            .then(() => {
                alert("Usuário removido com sucesso!");
            })
            .catch(error => alert("Erro ao remover: " + error.message));
    }
};

window.resetTotalEmpresa = function() {
    if (window.cargoAtual !== 'chefe') {
        alert("Apenas o Arquivista Chefe pode dissolver a empresa."); return;
    }
    
    const confirmacao = prompt("⚠️ PERIGO: ESTA AÇÃO É IRREVERSÍVEL! ⚠️\nApagará TODOS os arquivos, equipe e deletará a sua conta.\nPara confirmar, digite seu e-mail de login abaixo:");
    
    if (confirmacao === auth.currentUser.email) {
        const idEmpresa = window.idEmpresa;
        alert("Iniciando a exclusão de dados. Por favor, aguarde...");

        db.ref('workspaces/' + idEmpresa).remove();

        db.ref('usuarios').orderByChild('id_empresa').equalTo(idEmpresa).once('value', (snapshot) => {
            snapshot.forEach((child) => { child.ref.remove(); });
        }).then(() => {
            auth.currentUser.delete().then(() => {
                alert("Sua empresa foi apagada. Até logo!");
                window.location.replace("../index.html");
            }).catch((error) => {
                alert("Dados apagados. Por segurança, saia do sistema e faça login para concluir a exclusão do seu perfil.");
                auth.signOut().then(() => window.location.replace("../index.html"));
            });
        });
    } else {
        alert("E-mail incorreto. Reset cancelado.");
    }
};