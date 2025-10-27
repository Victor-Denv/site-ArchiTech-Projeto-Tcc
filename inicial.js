// =======================================================
//     LÓGICA DA PÁGINA 'automacao.html' (COM IA PARA PDF E IMAGEM - MÉTODO BLOB FINAL)
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

        // **** CÓDIGO DO BOTÃO "PROCESSAR COM IA" (MÉTODO BLOB) ****
        if (btnProcessarIA) {
            // Importa o pdf.js como módulo
            import('//mozilla.github.io/pdf.js/build/pdf.mjs').then(async (pdfjsLib) => {
                // Configuração essencial para o pdf.js
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
                        // Configuração Tesseract (com caminhos)
                        const workerPath = 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js';
                        const langPath = 'https://tessdata.projectnaptha.com/4.0.0';
                        const worker = await Tesseract.createWorker('por', 1, {
                            workerPath: workerPath,
                            langPath: langPath,
                            gzip: false,
                            logger: m => { /* ... (logger code) ... */ },
                        });

                        if (file.type.startsWith("image/")) {
                            // --- SE FOR IMAGEM --- (Continua igual)
                            iaStatus.innerText = "Lendo imagem...";
                            const { data: { text } } = await worker.recognize(file);
                            textoExtraidoIA.value = text;
                            iaStatus.innerText = "Leitura concluída!";

                        } else if (file.type === "application/pdf") {
                            // --- SE FOR PDF (COM MÉTODO BLOB) ---
                            iaStatus.innerText = "Carregando PDF...";
                            const fileReader = new FileReader();
                            fileReader.readAsArrayBuffer(file);

                            fileReader.onload = async function() {
                                const pdfData = new Uint8Array(this.result);
                                const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
                                const numPages = pdfDoc.numPages;
                                let textoCompleto = "";

                                for (let i = 1; i <= numPages; i++) {
                                    iaStatus.innerText = `Processando página ${i} de ${numPages}...`;
                                    const page = await pdfDoc.getPage(i);
                                    const viewport = page.getViewport({ scale: 1.0 }); // Mantém escala 1.0

                                    const canvas = document.createElement('canvas');
                                    const context = canvas.getContext('2d');
                                    canvas.height = viewport.height;
                                    canvas.width = viewport.width;
                                    await page.render({ canvasContext: context, viewport: viewport }).promise;

                                    // **** USA O MÉTODO BLOB ****
                                    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                                    if (!blob) { throw new Error(`Falha ao converter canvas para Blob na página ${i}`); }

                                    iaStatus.innerText = `Lendo texto da página ${i}...`;
                                    // Manda o Blob para o Tesseract
                                    const { data: { text } } = await worker.recognize(blob); // Passa o Blob
                                    textoCompleto += text + "\n\n--- Fim da Página " + i + " ---\n\n";
                                }
                                textoExtraidoIA.value = textoCompleto;
                                iaStatus.innerText = "Leitura do PDF concluída!";
                            };
                            fileReader.onerror = function(error) { throw new Error("Erro ao ler o arquivo PDF."); }
                        } else {
                            alert("Formato não suportado.");
                            // ... (resetar botão) ... return;
                        }
                        await worker.terminate();
                    } catch (error) {
                        console.error("Erro no processamento:", error);
                        iaStatus.innerText = "Erro durante o processamento.";
                        // ... (alertar erro, resetar botão) ...
                    } finally {
                         btnProcessarIA.disabled = false;
                    }
                });
            }).catch(error => {
                // ... (erro ao carregar pdf.js) ...
            });
        }
        // **** FIM DO CÓDIGO DO BOTÃO "PROCESSAR COM IA" ****

        // Lógica do Botão "Salvar e Gerar QR Code" (Continua igual)
        btnSalvar.addEventListener('click', function() { /* ... */ });

        // FUNÇÃO AUXILIAR PARA SALVAR NO BANCO (Continua igual)
        function salvarNoBanco(nome, local, tipo, textoIA) { /* ... */ }
    }
});

// =======================================================
//     LÓGICA DA PÁGINA 'listar.html' (Continua igual)
// =======================================================
document.addEventListener('DOMContentLoaded', function() { /* ... */ });

// =======================================================
//     LÓGICA DA PÁGINA 'arquivo.html' (Continua igual)
// =======================================================
document.addEventListener('DOMContentLoaded', function() { /* ... */ });

// =======================================================
//     LÓGICA DO BOTÃO "SAIR" (LOGOUT) (Continua igual)
// =======================================================
document.addEventListener('DOMContentLoaded', function() { /* ... */ });