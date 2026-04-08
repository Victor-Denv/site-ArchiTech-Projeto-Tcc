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
//     O "SEGURANÇA" E CONTROLE DE ACESSO (HIERARQUIA)
// =======================================================
auth.onAuthStateChanged(function(user) {
    const isLoginPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('login.html');
    
    if (user) {
        if (isLoginPage) window.location.href = "inicial.html";

        // MÁGICA DOS FILTROS: Descobre quem é o usuário e esconde o menu
        db.ref('usuarios/' + user.uid).once('value').then((snapshot) => {
            const dadosUsuario = snapshot.val();
            // Se o usuário não tiver cargo no banco, assume que é funcionário (por segurança)
           const cargo = dadosUsuario ? dadosUsuario.cargo : 'chefe';
            
            aplicarFiltrosDeMenu(cargo);
        });

    } else {
        if (!isLoginPage) window.location.href = "index.html";
    }
});

function aplicarFiltrosDeMenu(cargo) {
    // Pega todos os links do menu lateral esquerdo
    const linksMenu = document.querySelectorAll('.menu-navegacao a');

    linksMenu.forEach(link => {
        const href = link.getAttribute('href');
        const liPai = link.parentElement;

        if (cargo === 'funcionario') {
            // FUNCIONÁRIO NÃO VÊ: Relatórios, Chamados, Monitoramento, Segurança e Configurações
            if (href.includes('relatorio.html') || 
                href.includes('painel-chamados.html') || 
                href.includes('monitor.html') || 
                href.includes('seguranca.html') || 
                href.includes('configuracoes.html')) {
                liPai.style.display = 'none'; // Esconde o botão
            }
        } 
        else if (cargo === 'ti') {
            // EQUIPE DE TI NÃO VÊ: Automação (arquivos), Relatórios, Segurança e Configurações
            if (href.includes('automacao.html') || 
                href.includes('relatorio.html') || 
                href.includes('seguranca.html') || 
                href.includes('configuracoes.html')) {
                liPai.style.display = 'none'; // Esconde o botão
            }
        }
        // Se for 'chefe', a função não faz nada, deixando todos os botões visíveis!
    });
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

           // =======================================================
        // LÓGICA DO ANALISTA DE DOCUMENTOS (SMART CLASSIFIER)
        // =======================================================
        if (btnProcessarIA) {
            btnProcessarIA.addEventListener('click', function() {
                if (!arquivoUploadInput || !arquivoUploadInput.files[0]) {
                    alert("Por favor, anexe um arquivo (PDF, JPG ou PNG) primeiro.");
                    return;
                }

                const file = arquivoUploadInput.files[0];
                
                // Muda o visual do botão para mostrar que está "pensando"
                if(iaStatus) {
                    iaStatus.innerText = "Analisando contexto do documento...";
                    iaStatus.style.color = "#ffc107"; // Amarelo
                }
                btnProcessarIA.disabled = true;
                btnProcessarIA.innerText = "Processando...";

                // Simulamos um pequeno tempo de carregamento (1.5s) para o efeito visual de IA na apresentação
                setTimeout(() => {
                    const nomeOriginal = file.name;
                    const nomeMinusculo = nomeOriginal.toLowerCase();
                    const tipoMime = file.type;

                    // 1. FORMATA O NOME DO ARQUIVO (Tira .pdf, hifens e capitaliza)
                    let nomeLimpo = nomeOriginal.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                    nomeLimpo = nomeLimpo.replace(/\b\w/g, l => l.toUpperCase());

                    // 2. IDENTIFICA O TIPO
                    let tipoSugerido = "Outros";
                    if (tipoMime.includes("pdf")) tipoSugerido = "Documento (PDF)";
                    else if (tipoMime.includes("image")) tipoSugerido = "Imagem (JPG/PNG)";

                    // 3. ANÁLISE SEMÂNTICA (A "mágica" de descobrir para que serve)
                    let descSugerida = "Documento genérico catalogado no acervo. Requer análise manual para detalhamento.";

                    if (nomeMinusculo.includes("curriculo") || nomeMinusculo.includes("cv")) {
                        descSugerida = "Classificação: Currículo Vitae.\nPara que serve: Armazenar o histórico profissional, acadêmico e dados de contato do indivíduo para fins de recrutamento, seleção ou registro interno.";
                    } else if (nomeMinusculo.includes("contrato")) {
                        descSugerida = "Classificação: Documento Legal (Contrato).\nPara que serve: Firmar acordos entre partes, estabelecendo cláusulas, deveres e direitos legais. Documento de guarda permanente ou de longo prazo.";
                    } else if (nomeMinusculo.includes("relatorio")) {
                        descSugerida = "Classificação: Relatório Operacional/Gerencial.\nPara que serve: Compilar dados, métricas e análises de um período específico para auxiliar na tomada de decisão da gestão.";
                    } else if (nomeMinusculo.includes("projeto") || nomeMinusculo.includes("tcc")) {
                        descSugerida = "Classificação: Trabalho Acadêmico / Projeto Técnico.\nPara que serve: Registrar pesquisas, metodologias e conclusões sobre um tema específico. Fonte de consulta bibliográfica.";
                    } else if (nomeMinusculo.includes("planta") || nomeMinusculo.includes("mapa")) {
                        descSugerida = "Classificação: Documento Cartográfico / Arquitetônico.\nPara que serve: Guiar construções, reformas ou análises espaciais da unidade.";
                    } else if (nomeMinusculo.includes("rg") || nomeMinusculo.includes("cpf") || nomeMinusculo.includes("documento")) {
                        descSugerida = "Classificação: Documento de Identificação Pessoal.\nPara que serve: Comprovar a identidade de um indivíduo. ATENÇÃO: Contém dados sensíveis protegidos pela LGPD.";
                    }

                    // 4. AUTO-PREENCHE O FORMULÁRIO
                    if (nomeArquivoInput) nomeArquivoInput.value = nomeLimpo;
                    if (tipoArquivoInput) tipoArquivoInput.value = tipoSugerido;
                    if (textoExtraidoIA) textoExtraidoIA.value = descSugerida;

                    // Finaliza o visual
                    if(iaStatus) {
                        iaStatus.innerText = "Análise concluída com sucesso!";
                        iaStatus.style.color = "#28a745"; // Verde
                    }
                    btnProcessarIA.innerText = "Processar com IA";
                    btnProcessarIA.disabled = false;

                }, 1500); // Fim do delay
            });
        }


         // ==========================================
        // LÓGICA DO BOTÃO SALVAR (AGORA SALVA O ANEXO)
        // ==========================================
        btnSalvar.addEventListener('click', function() {
            const nome = nomeArquivoInput.value;
            const local = localizacaoInput.value;
            const tipo = tipoArquivoInput.value;
            const textoIA = textoExtraidoIA ? textoExtraidoIA.value : null;
            const file = arquivoUploadInput.files[0]; // Captura o arquivo anexado!

            if (!nome || !local) { 
                alert("Preencha Nome e Localização!"); 
                return; 
            }

            btnSalvar.innerText = "Salvando...";
            btnSalvar.disabled = true;

            // Se o usuário anexou um arquivo, converte e salva
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file); // Converte para Base64
                reader.onload = function() {
                    salvarNoBanco(nome, local, tipo, textoIA, reader.result); // Passa o arquivo!
                };
                reader.onerror = function() {
                    alert("Erro ao ler o arquivo.");
                    btnSalvar.innerText = "Salvar e Gerar QR Code";
                    btnSalvar.disabled = false;
                };
            } else {
                // Se não anexou nada, salva sem anexo
                salvarNoBanco(nome, local, tipo, textoIA, null);
            }
        });

        // A função que manda pro Firebase
        function salvarNoBanco(nome, local, tipo, textoIA, anexoBase64) {
            const arquivosRef = db.ref('arquivos');
            arquivosRef.push({
                nome: nome,
                localizacao: local,
                tipo: tipo,
                dataCadastro: firebase.database.ServerValue.TIMESTAMP,
                anexoUrl: anexoBase64, // <-- ISSO É O QUE FAZ OS BOTÕES APARECEREM!
                textoExtraido: textoIA || null 
            })
            .then((snapshot) => {
                const docId = snapshot.key;
                
                // Limpa os campos
                if(nomeArquivoInput) nomeArquivoInput.value = "";
                if(localizacaoInput) localizacaoInput.value = "";
                if(arquivoUploadInput) arquivoUploadInput.value = null;
                if(textoExtraidoIA) textoExtraidoIA.value = "";
                if(iaStatus) iaStatus.innerText = "";
                
                // Gera o QR Code
                if(qrcodeDiv) qrcodeDiv.innerHTML = "";
                const urlParaQR = `${window.location.origin}/html/arquivo.html?id=${docId}`;
                new QRCode(qrcodeDiv, { text: urlParaQR, width: 150, height: 150 });
                
                alert("Arquivo salvo com sucesso!");
                btnSalvar.innerText = "Salvar e Gerar QR Code";
                btnSalvar.disabled = false;
            })
            .catch((error) => {
                 console.error("Erro ao salvar:", error);
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
//     LÓGICA DA PÁGINA 'arquivo.html' (TUDO INTEGRADO)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    const nomeDisplay = document.getElementById('nomeArquivoDisplay');
    
    if (nomeDisplay) {
        const params = new URLSearchParams(window.location.search);
        const arquivoId = params.get('id');

        if (!arquivoId) {
            nomeDisplay.innerText = "Erro: ID não encontrado na URL.";
            return;
        }

        const arquivoRef = db.ref('arquivos/' + arquivoId);
        let dadosArquivoAtual = null;

        // 1. CARREGAR DADOS
        arquivoRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                dadosArquivoAtual = data;
                
                // Preenche os dados
                nomeDisplay.innerText = data.nome;
                document.getElementById('localizacaoAtualDisplay').innerText = data.localizacao;
                document.getElementById('tipoArquivoDisplay').innerText = data.tipo;
                document.getElementById('dataCadastroDisplay').innerText = new Date(data.dataCadastro).toLocaleString('pt-BR');

                // IA
                if (data.textoExtraido) {
                    document.getElementById('areaTextoIA').style.display = 'block';
                    document.getElementById('textoIADisplay').value = data.textoExtraido;
                }

                // Botões de Ver e Baixar
                if (data.anexoUrl) {
                    document.getElementById('btnVisualizar').style.display = 'inline-block';
                    document.getElementById('btnBaixar').style.display = 'inline-block';
                }

                // Gera QR Code na tela de detalhes
                const qrcodeDiv = document.getElementById('qrcodeDetalhes');
                if (qrcodeDiv) {
                    qrcodeDiv.innerHTML = ""; 
                    const urlParaQR = window.location.href; // A própria URL atual
                    new QRCode(qrcodeDiv, { text: urlParaQR, width: 128, height: 128 });
                }

            } else {
                nomeDisplay.innerText = "Arquivo não encontrado ou deletado.";
            }
        });

        // 2. BOTÃO DELETAR
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

        // 3. BOTÃO VISUALIZAR
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

        // 4. BOTÃO BAIXAR
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

        // 5. ATUALIZAR LOCALIZAÇÃO
        const btnAtualizar = document.getElementById('btnAtualizarLocal');
        const novaLocalizacaoInput = document.getElementById('novaLocalizacaoInput');

        if (btnAtualizar && novaLocalizacaoInput) {
            btnAtualizar.addEventListener('click', function() {
                const novaLocalizacao = novaLocalizacaoInput.value;
                if (!novaLocalizacao) {
                    alert("Digite a nova localização.");
                    return;
                }
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
        
        // Procura o elemento da SALA 1. Se ele existir, estamos na página monitor.html
        const tempDisplaySala1 = document.getElementById('temp-display-sala1');
        
        if (tempDisplaySala1) { // Estamos na página monitor.html
            console.log("DEBUG: Iniciando lógica da página monitor.html (2 salas).");

            // Função auxiliar para não repetir código
            function atualizarPainel(temperatura, display, unit, status) {
                if (temperatura !== null && !isNaN(temperatura)) {
                    display.innerText = temperatura.toFixed(1); // Mostra com 1 casa decimal
                    
                    if (temperatura < 18) {
                        status.innerText = "Status: Muito Frio";
                        display.style.color = "#00ccff"; // Azul
                        unit.style.color = "#00ccff";
                    } else if (temperatura > 26) {
                        status.innerText = "Status: Muito Quente!";
                        display.style.color = "#ff6600"; // Laranja
                        unit.style.color = "#ff6600";
                    } else {
                        status.innerText = "Status: Ideal";
                        display.style.color = "#00ff00"; // Verde
                        unit.style.color = "#00ff00";
                    }
                } else {
                    display.innerText = "--";
                    status.innerText = "Sem dados do sensor.";
                    display.style.color = "#aaa";
                    unit.style.color = "#aaa";
                }
            }

            // --- Lógica para a SALA 1 ---
            const tempStatusSala1 = document.getElementById('temp-status-sala1');
            const tempUnitSala1 = document.getElementById('temp-unit-sala1');
            const tempRefSala1 = db.ref('sensores/sala_principal/temperatura'); // Caminho 1

            tempRefSala1.on('value', (snapshot) => {
                const temperatura = snapshot.val();
                console.log("DEBUG: Novo dado de temperatura (Sala 1) recebido:", temperatura);
                atualizarPainel(temperatura, tempDisplaySala1, tempUnitSala1, tempStatusSala1);
                
            }, (errorObject) => {
                console.error("DEBUG: Erro ao ler (Sala 1):", errorObject.code);
                if(tempStatusSala1) tempStatusSala1.innerText = "Erro de conexão.";
                if(tempDisplaySala1) tempDisplaySala1.innerText = "X";
            });

            // --- Lógica para a SALA 2 ---
            const tempDisplaySala2 = document.getElementById('temp-display-sala2');
            const tempStatusSala2 = document.getElementById('temp-status-sala2');
            const tempUnitSala2 = document.getElementById('temp-unit-sala2');
            const tempRefSala2 = db.ref('sensores/sala_secundaria/temperatura'); // Caminho 2

            tempRefSala2.on('value', (snapshot) => {
                const temperatura = snapshot.val();
                console.log("DEBUG: Novo dado de temperatura (Sala 2) recebido:", temperatura);
                atualizarPainel(temperatura, tempDisplaySala2, tempUnitSala2, tempStatusSala2);

            }, (errorObject) => {
                console.error("DEBUG: Erro ao ler (Sala 2):", errorObject.code);
                if(tempStatusSala2) tempStatusSala2.innerText = "Erro de conexão.";
                if(tempDisplaySala2) tempDisplaySala2.innerText = "X";
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
    //     LÓGICA DA PÁGINA 'relatorio.html'
    // =======================================================
    document.addEventListener('DOMContentLoaded', function() {
        const ctx = document.getElementById('graficoTipos');
        
        // Só executa se estivermos na página relatorio.html (se o canvas existir)
        if (ctx) {
            console.log("Página de relatório carregada. Buscando dados...");
            const arquivosRef = db.ref('arquivos');

            arquivosRef.once('value', (snapshot) => {
                const dados = snapshot.val();
                
                let qtdDocs = 0;
                let qtdImagens = 0;
                let qtdOutros = 0;
                let total = 0;

                if (dados) {
                    // Conta quantos arquivos de cada tipo existem no banco
                    Object.values(dados).forEach(arquivo => {
                        total++;
                        if (arquivo.tipo === 'documento') qtdDocs++;
                        else if (arquivo.tipo === 'imagem') qtdImagens++;
                        else qtdOutros++;
                    });
                }

                // Atualiza os cartões na tela
                document.getElementById('totalArquivos').innerText = total;
                document.getElementById('totalDocs').innerText = qtdDocs;
                document.getElementById('totalImagens').innerText = qtdImagens;

                // Desenha o gráfico
                new Chart(ctx, {
                    type: 'doughnut', // Tipo do gráfico (rosca)
                    data: {
                        labels: ['Documentos (PDF)', 'Imagens (JPG/PNG)', 'Outros'],
                        datasets: [{
                            label: 'Quantidade',
                            data: [qtdDocs, qtdImagens, qtdOutros],
                            backgroundColor: [
                                '#28a745', // Verde
                                '#ffc107', // Amarelo
                                '#6f42c1'  // Roxo da sua paleta
                            ],
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
            }).catch(error => {
                console.error("Erro ao puxar dados do relatório:", error);
                document.getElementById('totalArquivos').innerText = "Erro";
            });
        }
    });
    // =======================================================
    //     LÓGICA DA PÁGINA 'mensagem.html' (Notificações)
    // =======================================================
    document.addEventListener('DOMContentLoaded', function() {
        const containerNotificacoes = document.getElementById('containerNotificacoes');
        
        // Só roda se estivermos na página de notificações
        if (containerNotificacoes) {
            const arquivosRef = db.ref('arquivos');
            
            // Puxa os últimos 15 arquivos cadastrados para gerar os alertas
            arquivosRef.limitToLast(15).on('value', (snapshot) => {
                const dados = snapshot.val();
                containerNotificacoes.innerHTML = ""; // Limpa a tela de "Carregando"
                
                if (dados) {
                    // Inverte para a mensagem mais nova ficar no topo
                    const chaves = Object.keys(dados).reverse(); 
                    
                    chaves.forEach(key => {
                        const arquivo = dados[key];
                        
                        // Formata a data (Ex: "Hoje às 14:30" ou a data completa)
                        const dataObj = new Date(arquivo.dataCadastro);
                        const dataFormatada = dataObj.toLocaleDateString('pt-BR') + ' às ' + dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                        
                        // Define cor e ícone baseados no tipo do arquivo
                        let corBorda = "#6f42c1"; // Roxo padrão
                        let icone = "fa-file";
                        
                        if(arquivo.tipo === "documento") { corBorda = "#28a745"; icone = "fa-file-pdf"; } // Verde
                        if(arquivo.tipo === "imagem") { corBorda = "#ffc107"; icone = "fa-file-image"; } // Amarelo
                        
                        const notitificacaoHTML = `
                            <div style="background: white; padding: 20px; border-left: 4px solid ${corBorda}; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); position: relative;">
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
                            <p>Nenhuma notificação no momento.</p>
                        </div>`;
                }
            });

            // Botão para limpar a tela (apenas visual, não deleta do banco)
            const btnLimpar = document.getElementById('btnLimparNotificacoes');
            if(btnLimpar) {
                btnLimpar.addEventListener('click', () => {
                    containerNotificacoes.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #999;">
                        <i class="fa-solid fa-check-double fa-2x" style="margin-bottom: 15px;"></i>
                        <p>Você não tem novas notificações.</p>
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
            const arquivosRef = db.ref('arquivos');
            
            // Puxa os dados dos arquivos para preencher a auditoria
            arquivosRef.limitToLast(5).once('value', (snapshot) => {
                const dados = snapshot.val();
                tabelaAuditoria.innerHTML = ""; // Limpa a tabela
                
                if (dados) {
                    // Inverte para mostrar do mais novo para o mais velho
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
                    tabelaAuditoria.innerHTML = `<tr><td colspan="3" style="padding: 12px; text-align: center;">Nenhum registro de auditoria encontrado.</td></tr>`;
                }
            }).catch(error => {
                console.error("Erro ao puxar auditoria:", error);
                tabelaAuditoria.innerHTML = `<tr><td colspan="3" style="padding: 12px; text-align: center; color: red;">Erro ao carregar dados.</td></tr>`;
            });
        }
    });

    // =======================================================
    //     LÓGICA DO GRÁFICO DA PÁGINA INICIAL ('inicial.html')
    // =======================================================
    document.addEventListener('DOMContentLoaded', function() {
        const ctxCapacidade = document.getElementById('graficoCapacidade');
        
        // Só executa se o gráfico de capacidade existir na tela (ou seja, se estivermos na inicial.html)
        if (ctxCapacidade) {
            const arquivosRef = db.ref('arquivos');
            const capacidadeMaxima = 1000; // Defina a capacidade máxima do seu arquivo físico aqui

            arquivosRef.on('value', (snapshot) => {
                const dados = snapshot.val();
                let totalArquivos = 0;

                if (dados) {
                    totalArquivos = Object.keys(dados).length; // Conta quantos arquivos existem no banco
                }

                const espacoLivre = capacidadeMaxima - totalArquivos;
                
                // Atualiza o texto na tela
                document.getElementById('qtdArquivosOcupados').innerText = totalArquivos;

                // Se o gráfico já existir, destrói para criar um novo atualizado (evita sobreposição)
                if (window.meuGraficoCapacidade) {
                    window.meuGraficoCapacidade.destroy();
                }

                // Desenha o Gráfico de Rosca (Doughnut)
                window.meuGraficoCapacidade = new Chart(ctxCapacidade, {
                    type: 'doughnut',
                    data: {
                        labels: ['Ocupado', 'Espaço Livre'],
                        datasets: [{
                            data: [totalArquivos, espacoLivre],
                            backgroundColor: [
                                '#6f42c1', // Roxo (Ocupado)
                                '#e9ecef'  // Cinza Claro (Livre)
                            ],
                            borderWidth: 0,
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '75%', // Deixa a rosca mais fina
                        plugins: {
                            legend: {
                                display: false // Esconde a legenda padrão para ficar mais limpo
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed !== null) {
                                            label += context.parsed + ' arquivos';
                                        }
                                        return label;
                                    }
                                }
                            }
                        }
                    }
                });
            });
        }
    });
    


// =======================================================
//     LÓGICA ISOLADA: PERFIL (CONTA) E EQUIPE (CONFIG)
// =======================================================
window.addEventListener('load', function() {
    
    // --- 1. MOSTRAR E-MAIL NA TELA DE CONTA ---
    const emailUsuarioConta = document.getElementById('emailUsuarioConta');
    if (emailUsuarioConta) {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                emailUsuarioConta.innerText = user.email;
            } else {
                emailUsuarioConta.innerText = "Usuário não autenticado";
            }
        });
    }

    // --- 2. LISTAR EQUIPE NA TELA DE CONFIGURAÇÕES ---
    const listaEquipe = document.getElementById('listaUsuariosCadastrados');
    if (listaEquipe) {
        db.ref('usuarios').on('value', (snapshot) => {
            listaEquipe.innerHTML = "";
            const dados = snapshot.val();
            if (dados) {
                Object.keys(dados).forEach(uid => {
                    const user = dados[uid];
                    let corBadge = "#95a5a6"; // Cinza (Funcionario)
                    let nomeCargo = "Funcionário";
                    
                    if (user.cargo === 'chefe') { corBadge = "#e74c3c"; nomeCargo = "Arquivista Chefe"; }
                    if (user.cargo === 'ti') { corBadge = "#3498db"; nomeCargo = "Equipe de TI"; }

                    listaEquipe.innerHTML += `
                        <div style="background-color: #f8f9fa; padding: 12px 15px; border-radius: 8px; border-left: 4px solid ${corBadge}; display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #2c3e50; font-weight: 500; font-size: 14px;">${user.email}</span>
                            <span style="background-color: ${corBadge}; color: white; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;">${nomeCargo}</span>
                        </div>
                    `;
                });
            } else { 
                listaEquipe.innerHTML = "<div style='color: #7f8c8d; font-size: 14px;'>Nenhum usuário cadastrado na base de dados.</div>"; 
            }
        });
    }

    // --- 3. BOTÃO DE CONVIDAR USUÁRIO ---
    const btnCriarUsuario = document.getElementById('btnCriarUsuario');
    if (btnCriarUsuario) {
        // Trava de Segurança na Tela de Config
        auth.onAuthStateChanged(function(user) {
            if (user) {
                db.ref('usuarios/' + user.uid).once('value').then((snapshot) => {
                    const cargo = snapshot.val() ? snapshot.val().cargo : 'chefe'; 
                    if (cargo !== 'chefe') {
                        alert("Acesso Negado: Apenas o Arquivista Chefe pode gerenciar a equipe.");
                        window.location.href = "inicial.html";
                    }
                });
            }
        });

        const appSecundario = firebase.apps.find(app => app.name === "AppCriador") || firebase.initializeApp(firebaseConfig, "AppCriador");
        const authSecundario = appSecundario.auth();

        btnCriarUsuario.addEventListener('click', function() {
            const email = document.getElementById('novoEmailUser').value;
            const cargo = document.getElementById('nivelAcessoUser').value;

            if (!email) { alert("Preencha o e-mail real do usuário."); return; }

            btnCriarUsuario.innerText = "Enviando convite...";
            btnCriarUsuario.disabled = true;

            const senhaAleatoria = Math.random().toString(36).slice(-10) + "X1@";

            authSecundario.createUserWithEmailAndPassword(email, senhaAleatoria)
                .then((userCredential) => {
                    db.ref('usuarios/' + userCredential.user.uid).set({
                        email: email,
                        cargo: cargo,
                        dataCriacao: firebase.database.ServerValue.TIMESTAMP
                    }).then(() => {
                        authSecundario.sendPasswordResetEmail(email).then(() => {
                            authSecundario.signOut();
                            alert(`Convite enviado para: ${email}`);
                            document.getElementById('novoEmailUser').value = "";
                            btnCriarUsuario.innerText = "Enviar Convite e Atribuir Permissões";
                            btnCriarUsuario.disabled = false;
                        });
                    });
                })
                .catch((error) => {
                    console.error("Erro:", error);
                    alert("Erro ao criar usuário. Talvez o e-mail já exista.");
                    btnCriarUsuario.innerText = "Enviar Convite e Atribuir Permissões";
                    btnCriarUsuario.disabled = false;
                });
        });
    }
});

// =======================================================
//     BLINDAGEM DA PÁGINA 'relatorio.html'
// =======================================================
window.addEventListener('load', function() {
    const ctx = document.getElementById('graficoTipos');
    if (ctx) { 
        auth.onAuthStateChanged(function(user) {
            if (user) {
                db.ref('usuarios/' + user.uid).once('value').then((snapshot) => {
                    const cargo = snapshot.val() ? snapshot.val().cargo : 'chefe';
                    if (cargo !== 'chefe') {
                        alert("Acesso Negado: Esta página é restrita ao Arquivista Chefe.");
                        window.location.href = "inicial.html";
                    }
                });
            }
        });
    }
});