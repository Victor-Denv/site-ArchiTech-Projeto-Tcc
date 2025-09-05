/*
  ARQUIVO DE LÓGICA (JAVASCRIPT) PARA ARCHITECH
  Este script controla toda a interatividade da página.
*/

// Executa o script apenas quando o HTML estiver totalmente carregado
document.addEventListener('DOMContentLoaded', () => {

    // --- INICIALIZAÇÃO DOS ÍCONES ---
    feather.replace();

    // --- ELEMENTOS DO DOM ---
    const loginPage = document.getElementById('login-page');
    const appPage = document.getElementById('app-page');
    const loginForm = document.getElementById('login-form');

    const navDashboard = document.getElementById('nav-dashboard');
    const navSettings = document.getElementById('nav-settings');
    const navLogout = document.getElementById('nav-logout');

    const dashboardContent = document.getElementById('dashboard-content');
    const settingsContent = document.getElementById('settings-content');

    // --- LÓGICA DE NAVEGAÇÃO ---

    // Função para simular login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Aqui iria a lógica de autenticação real
        loginPage.style.display = 'none';
        appPage.style.display = 'flex';
        // Inicia na tela do dashboard
        showDashboard();
    });

    // Função para simular logout
    navLogout.addEventListener('click', (e) => {
        e.preventDefault();
        appPage.style.display = 'none';
        loginPage.style.display = 'flex';
    });
    
    // Funções para mostrar seções do conteúdo principal
    function showDashboard() {
        dashboardContent.style.display = 'block';
        settingsContent.style.display = 'none';
        navDashboard.style.backgroundColor = 'var(--brand-purple)';
        navDashboard.classList.add('text-white');
        navSettings.style.backgroundColor = 'transparent';
    }

    function showSettings() {
        dashboardContent.style.display = 'none';
        settingsContent.style.display = 'block';
        navSettings.style.backgroundColor = 'var(--brand-purple)';
        navSettings.classList.add('text-white');
        navDashboard.style.backgroundColor = 'transparent';
    }

    // Event Listeners para a navegação da sidebar
    navDashboard.addEventListener('click', (e) => {
        e.preventDefault();
        showDashboard();
    });

    navSettings.addEventListener('click', (e) => {
        e.preventDefault();
        showSettings();
    });

    // --- LÓGICA DE UPLOAD DE ARQUIVOS (FRONT-END) ---
    const dropZone = document.getElementById('drop-zone');
    const fileUpload = document.getElementById('file-upload');
    const fileList = document.getElementById('file-list');

    // Prevenir comportamento padrão do navegador
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Adicionar classe visual ao arrastar sobre a área
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    // Lidar com o drop de arquivos
    dropZone.addEventListener('drop', handleDrop, false);
    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        handleFiles(files);
    }

    // Lidar com a seleção de arquivos via botão
    fileUpload.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        fileList.innerHTML = ''; // Limpa a lista antes de adicionar novos arquivos
        [...files].forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.className = 'flex justify-between items-center bg-gray-700 p-2 rounded';
            fileElement.innerHTML = `
                <div class="flex items-center">
                    <i data-feather="file" class="w-5 h-5 mr-2 text-gray-400"></i>
                    <span class="text-sm">${file.name}</span>
                </div>
                <span class="text-xs text-yellow-400">Processando...</span>
            `;
            fileList.appendChild(fileElement);
        });
        feather.replace(); // Re-renderizar os ícones
    }
});
