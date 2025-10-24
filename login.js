// Espera o HTML carregar
document.addEventListener('DOMContentLoaded', function() {

    // =======================================================
    //     !!! ATENÇÃO !!!
    //     COPIE E COLE O SEU 'firebaseConfig' DO 'inicial.js' AQUI DENTRO
    // =======================================================
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
    // Inicializa o serviço de Autenticação
    const auth = firebase.auth();

    // =======================================================
    //     PEGANDO OS ELEMENTOS DO HTML
    // =======================================================
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('btn-login');
    const signupLinkContainer = document.querySelector('.signup-link'); // Pega o 'div'
    const title = document.getElementById('form-title');
    const subtitle = document.getElementById('subtitle-text');
    const errorMessage = document.getElementById('auth-error');

    // Variável para saber se estamos em modo "Login" ou "Criar Conta"
    let isLoginMode = true;

    // =======================================================
    //     FUNÇÃO PARA MUDAR O FORMULÁRIO (LOGIN / CRIAR CONTA)
    // =======================================================
    function toggleMode(e) {
        // e.preventDefault() impede o link '#' de pular a página
        if(e) e.preventDefault(); 
        
        if (isLoginMode) {
            // Mudar para "Criar Conta"
            title.innerText = "Crie sua conta";
            subtitle.innerText = "Insira seus dados para começar.";
            loginButton.innerText = "Criar Conta";
            // Muda o link lá embaixo para "Faça login"
            signupLinkContainer.innerHTML = '<p>Já tem uma conta? <a href="#" id="login-link">Faça login</a></p>';
            isLoginMode = false;
            
            // Adiciona o 'ouvinte' para o novo link "Faça login"
            document.getElementById('login-link').addEventListener('click', toggleMode);
        } else {
            // Mudar de volta para "Login"
            title.innerText = "Acesse sua conta";
            subtitle.innerText = "Bem-vindo de volta! Por favor, insira seus dados.";
            loginButton.innerText = "Entrar";
            // Muda o link lá embaixo para "Cadastre-se"
            signupLinkContainer.innerHTML = '<p>Não tem uma conta? <a href="#" id="signup-link">Cadastre-se</a></p>';
            isLoginMode = true;
            
            // Adiciona o 'ouvinte' para o novo link "Cadastre-se"
            document.getElementById('signup-link').addEventListener('click', toggleMode);
        }
        errorMessage.innerText = ""; // Limpa qualquer erro antigo
    }

    // Ouvinte inicial para o link "Cadastre-se"
    document.getElementById('signup-link').addEventListener('click', toggleMode);

    // =======================================================
    //     FUNÇÃO PRINCIPAL (O QUE O BOTÃO FAZ)
    // =======================================================
    loginButton.addEventListener('click', function() {
        const email = emailInput.value;
        const password = passwordInput.value;
        errorMessage.innerText = ""; // Limpa erros

        if (!email || !password) {
            errorMessage.innerText = "Por favor, preencha o e-mail e a senha.";
            return;
        }

        loginButton.innerText = "Carregando...";
        loginButton.disabled = true;

        if (isLoginMode) {
            // --- MODO LOGIN ---
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Login com sucesso!
                    console.log("Login feito com sucesso:", userCredential.user);
                    // Redireciona para a página principal do seu sistema
                    // (Pode ser 'inicial.html' ou 'listar.html')
                    window.location.href = "inicial.html"; 
                })
                .catch((error) => {
                    // Deu erro
                    console.error("Erro no login:", error.message);
                    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                        errorMessage.innerText = "E-mail ou senha incorretos.";
                    } else {
                        errorMessage.innerText = "Ocorreu um erro. Tente novamente.";
                    }
                    loginButton.innerText = "Entrar";
                    loginButton.disabled = false;
                });

        } else {
            // --- MODO CRIAR CONTA ---
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Conta criada com sucesso!
                    console.log("Conta criada com sucesso:", userCredential.user);
                    // Redireciona para a página principal
                    window.location.href = "inicial.html";
                })
                .catch((error) => {
                    // Deu erro
                    console.error("Erro ao criar conta:", error.message);
                    if (error.code === 'auth/email-already-in-use') {
                        errorMessage.innerText = "Este e-mail já está em uso.";
                    } else if (error.code === 'auth/weak-password') {
                        errorMessage.innerText = "A senha deve ter pelo menos 6 caracteres.";
                    } else {
                        errorMessage.innerText = "Ocorreu um erro. Tente novamente.";
                    }
                    loginButton.innerText = "Criar Conta";
                    loginButton.disabled = false;
                });
        }
    });

});