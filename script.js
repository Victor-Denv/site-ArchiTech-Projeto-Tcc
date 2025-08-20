document.addEventListener ('DOMContentLoaded', () => {
const saudacaoTitulo = document.querySelector('.banner-destaque h2');
if (saudacaoTitulo) {
    const horaAtual = new Date().getHours();
    let saudacao = '';

    if (horaAtual >= 5 && horaAtual < 12) {
        
        saudacao = 'Bom dia, Arquivista!!';

} else if (horaAtual >=12 && horaAtual <18) {
    
    saudacao =  'Boa Tarde Arquivista!!' ;

} else {

    saudacao = 'Boa Noite, Arquivista!!' ;

}

const textoOriginal = "Veja Algumas Das Atualizaçãoes do Nossso Acervo Enquanto Voce Esteve Fora ..." ;
saudacaoTitulo.textContent = `${saudacao} ${textoOriginal}`; 
}

const menuItens = document.querySelectorAll( '.menu-navegacao ul li');
menuItens.forEach (item =>{
item.addEventListener('click', () => {
    const itemAtivoAtual = document.querySelector('.menu-navegacao li.ativo');
    if (itemAtivoAtual) {
        itemAtivoAtual.classList.remove('ativo');
    }
    item.classList.add('ativo');
    });
});
const botaoSaibaMais =document.querySelector('.banner-destaque .botaoprincipal');
if (botaoSaibaMais) {
    botaoSaibaMais.addEventListener ('click', () => {
     
        alert('Funcionalidade "Saiba Mais" Sera Implementada Em Breve!');
    
    });
}
const iconeNotificacoes =document.querySelector('header-icons .fa-bell');
if (iconeNotificacoes){
        iconeNotificacoes.addEventListener('click', () =>{
            alert ('Novas Notificações Serão Exibidas Aqui!');
    });
}
const previsaomensagem = document.querySelector('.previsao-mensagem');
if (previsaomensagem) {
    previsaomensagem.addEventListener ('click', () => {
        alert ('O Chat com Assitencia DataLia Sera Aberto Em Uma Nova Janela.');

    });
}

});
