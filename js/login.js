document.addEventListener('DOMContentLoaded', function() {

    localStorage.clear();
    window.idEmpresa = null;
    window.cargoAtual = null;
        
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
    
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.database(); 

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('btn-login');
    const signupLinkContainer = document.querySelector('.signup-link'); 
    const title = document.getElementById('form-title');
    const subtitle = document.getElementById('subtitle-text');
    const errorMessage = document.getElementById('auth-error');
    const camposCadastro = document.getElementById('campos-cadastro'); 

    let isLoginMode = true;

    function toggleMode(e) {
        if(e) e.preventDefault(); 
        
        if (isLoginMode) {
            // MUDANÇA DE TEXTO: Agora faz mais sentido para uma biblioteca
            title.innerText = "Cadastre-se no Acervo";
            subtitle.innerText = "Insira seus dados para acessar a biblioteca pública.";
            loginButton.innerText = "Criar Conta";
            camposCadastro.style.display = "block"; 
            signupLinkContainer.innerHTML = '<p>Já tem uma conta? <a href="#" id="login-link">Faça login</a></p>';
            isLoginMode = false;
            document.getElementById('login-link').addEventListener('click', toggleMode);
        } else {
            title.innerText = "Acesse sua conta";
            subtitle.innerText = "Bem-vindo de volta! Por favor, insira seus dados.";
            loginButton.innerText = "Entrar";
            camposCadastro.style.display = "none"; 
            signupLinkContainer.innerHTML = '<p>Não tem uma conta? <a href="#" id="signup-link">Cadastre-se</a></p>';
            isLoginMode = true;
            document.getElementById('signup-link').addEventListener('click', toggleMode);
        }
        errorMessage.innerText = ""; 
    }

    document.getElementById('signup-link').addEventListener('click', toggleMode);

    // ==========================================================
    // AQUI VOCÊ COLA O SEU UID DE CHEFE (A CHAVE DA BIBLIOTECA)
    // ==========================================================
    const ID_DA_BIBLIOTECA = "eXfbSrTONARpSk1ePURpjN0oAE72"; 

    loginButton.addEventListener('click', function() {
        const email = emailInput.value;
        const password = passwordInput.value;
        errorMessage.innerText = ""; 

        if (!email || !password) {
            errorMessage.innerText = "Por favor, preencha o e-mail e a senha."; return;
        }

        loginButton.innerText = "Carregando...";
        loginButton.disabled = true;

        if (isLoginMode) {
            auth.signInWithEmailAndPassword(email, password)
                .then(() => { window.location.href = "html/inicial.html"; })
                .catch(() => {
                    errorMessage.innerText = "E-mail ou senha incorretos.";
                    loginButton.innerText = "Entrar";
                    loginButton.disabled = false;
                });
        } else {
            const nome = document.getElementById('nomeCadastro').value;
            const cpf = document.getElementById('cpfCadastro').value;
            const telefone = document.getElementById('telCadastro').value;
            const endereco = document.getElementById('endCadastro').value;

            if (!nome || !cpf) {
                errorMessage.innerText = "Por favor, preencha Nome e CPF.";
                loginButton.innerText = "Criar Conta"; loginButton.disabled = false; return;
            }

            db.ref('usuarios').orderByChild('cpf').equalTo(cpf).once('value').then((snapshot) => {
                if (snapshot.exists()) {
                    errorMessage.innerText = "Este CPF já está cadastrado.";
                    loginButton.innerText = "Criar Conta"; loginButton.disabled = false;
                } else {
                    auth.createUserWithEmailAndPassword(email, password)
                        .then((userCredential) => {
                            const uid = userCredential.user.uid;
                            
                            db.ref('usuarios/' + uid).set({
                                email: email, 
                                nome: nome, 
                                cpf: cpf, 
                                telefone: telefone, 
                                endereco: endereco,
                                cargo: 'visitante',                // <--- TEM QUE ESTAR ESCRITO ASSIM
                                id_empresa: ID_DA_BIBLIOTECA,
                                dataCriacao: firebase.database.ServerValue.TIMESTAMP
                            }).then(() => { window.location.href = "html/inicial.html"; });
                        }).catch((error) => {
                            errorMessage.innerText = "Erro: " + error.message;
                            loginButton.innerText = "Criar Conta"; loginButton.disabled = false;
                        });
                }
            });
        }
    });
});


// =======================================================
// LÓGICA DA TECLA ENTER (PÁGINA DE LOGIN)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    // Pega os campos de texto (e-mail e senha)
    const camposLogin = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]');
    
    // Procura exatamente pelo ID que já existe no seu HTML
    const btnEntrar = document.getElementById('btn-login');

    if (camposLogin.length > 0 && btnEntrar) {
        camposLogin.forEach(campo => {
            campo.addEventListener('keypress', function(e) {
                // Se a tecla apertada for o Enter
                if (e.key === 'Enter') {
                    e.preventDefault(); // Evita que o formulário recarregue a página do zero
                    btnEntrar.click();  // Simula um clique real no botão "Entrar"
                }
            });
        });
    }
});


function toggleModal(id) {
    const modal = document.getElementById(id);
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex'; // Usamos flex para centralizar
    }
}

// Lógica para o formulário de suporte (apenas visual para o TCC)
document.getElementById('form-suporte')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Chamado enviado com sucesso! Nossa equipe responderá em até 24h.");
    toggleModal('suporte-modal');
    this.reset();
});

// Fecha ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains('modal-ajuda')) {
        event.target.style.display = "none";
    }
}


function recuperarSenha() {
    const emailInput = document.getElementById('email'); // Certifique-se que o ID do campo de email é este
    const email = emailInput.value;

    if (!email) {
        alert("Por favor, digite seu e-mail no campo de login para recuperar a senha.");
        emailInput.focus();
        return;
    }

    // Função nativa do Firebase Auth
    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert("E-mail de recuperação enviado! Verifique sua caixa de entrada e o lixo eletrônico (SPAM).");
        })
        .catch((error) => {
            console.error("Erro ao recuperar:", error.code);
            if (error.code === 'auth/user-not-found') {
                alert("Este e-mail não está cadastrado no sistema.");
            } else {
                alert("Erro ao enviar e-mail: " + error.message);
            }
        });
}

function enviarLinkRedefinicao() {
    const email = document.getElementById('email-recuperacao').value;

    if (!email) {
        alert("Por favor, digite o seu e-mail.");
        return;
    }

    // O Firebase verifica se o e-mail existe e envia o link de redefinição
    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert("Sucesso! Se este e-mail estiver cadastrado, você receberá um link de redefinição em instantes.");
            toggleModal('recuperar-modal'); // Fecha o modal
        })
        .catch((error) => {
            console.error("Erro:", error.code);
            if (error.code === 'auth/user-not-found') {
                alert("Este e-mail não foi encontrado no nosso sistema.");
            } else if (error.code === 'auth/invalid-email') {
                alert("O formato do e-mail é inválido.");
            } else {
                alert("Ocorreu um erro ao tentar enviar o e-mail. Tente novamente.");
            }
        });
}

// Função para mostrar avisos bonitos em vez de alert()
function mostrarAviso(titulo, mensagem, isSucesso = true) {
    document.getElementById('feedback-titulo').innerText = titulo;
    document.getElementById('feedback-mensagem').innerText = mensagem;
    
    const icone = document.getElementById('feedback-icon');
    icone.innerHTML = isSucesso ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';
    icone.style.color = isSucesso ? '#28a745' : '#ff4757';

    toggleModal('modal-feedback');
}

// Sua nova função de enviar e-mail usando o modal novo
function enviarLinkRedefinicao() {
    const email = document.getElementById('email-recuperacao').value;

    if (!email) {
        mostrarAviso("Ops!", "Por favor, digite o seu e-mail.", false);
        return;
    }

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            // Fecha o modal de input e abre o de sucesso
            toggleModal('recuperar-modal');
            mostrarAviso("E-mail Enviado", "Se este e-mail estiver cadastrado, você receberá um link de redefinição em instantes.");
        })
        .catch((error) => {
            console.error("Erro:", error.code);
            let msgErro = "Ocorreu um erro ao tentar enviar o e-mail.";
            if (error.code === 'auth/user-not-found') msgErro = "E-mail não encontrado.";
            
            mostrarAviso("Erro", msgErro, false);
        });
}