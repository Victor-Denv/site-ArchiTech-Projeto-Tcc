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
                            
                            // A MÁGICA: Ele nasce como VISITANTE e é jogado na SUA biblioteca
                            db.ref('usuarios/' + uid).set({
                                email: email, 
                                nome: nome, 
                                cpf: cpf, 
                                telefone: telefone, 
                                endereco: endereco,
                                cargo: 'visitante',                // <--- PULSEIRA DE VISITANTE
                                id_empresa: ID_DA_BIBLIOTECA,      // <--- ENTRA NA SUA BIBLIOTECA
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