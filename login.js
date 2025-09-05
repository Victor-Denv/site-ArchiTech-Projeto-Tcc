document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            // Previne o comportamento padrão do formulário (que é recarregar a página)
            event.preventDefault();

            // Aqui você poderia adicionar uma lógica de validação real no futuro
            // (ex: verificar se o email e a senha estão corretos com um servidor).
            
            // Como estamos apenas simulando, vamos redirecionar o usuário diretamente.
            console.log('Login simulado com sucesso! Redirecionando...');

            // Redireciona para a página principal
            window.location.href = 'inicial.html';
        });
    }
});