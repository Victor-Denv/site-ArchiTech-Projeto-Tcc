# 🏛️ Dashboard Architech - Gestão Arquivística Inteligente

![Status do Projeto](https://img.shields.io/badge/status-em--produ%C3%A7%C3%A3o-green)
![IA](https://img.shields.io/badge/IA-Google%20Gemini-blueviolet)
![Database](https://img.shields.io/badge/Database-Firebase-orange)
![Docker](https://img.shields.io/badge/Docker-Conteinerizado-blue)

O **Architech** é uma solução avançada de gestão documental que integra design moderno à Inteligência Artificial. Evoluído de um conceito visual para uma plataforma full-stack, o sistema hoje é capaz de centralizar acervos, automatizar a extração de metadados e oferecer uma interface de alta performance para a governança de dados em ambientes corporativos e públicos.

---

### 🎯 Objetivo do Projeto

Este projeto de Conclusão de Curso (TCC) apresenta uma infraestrutura integrada para arquivamento digital. A aplicação visa otimizar o fluxo de trabalho arquivístico tradicional, facilitando a busca, o rastreamento físico-digital (via QR Code) e garantindo a integridade da informação em conformidade com as melhores práticas de segurança e usabilidade (UI/UX).

---

### 🖼️ Preview do Sistema

A arquitetura de interface utiliza um padrão de três colunas (Dashboard Estendido), garantindo que as ferramentas de IA e os logs de atividade estejam sempre ao alcance do usuário.

![Preview do Dashboard](img/interface.png)

---

### ✨ Funcionalidades Implementadas

#### 🤖 Inteligência Artificial Documental
* **Categorização por IA (Google Gemini):** Sistema de upload assistido que identifica automaticamente se um documento é administrativo, financeiro ou confidencial.
* **Extração de Metadados:** Processamento de linguagem natural para preenchimento automático de campos, reduzindo o erro humano.

#### 🔐 Segurança e Governança
* **Recuperação de Senha Segura:** Fluxo de redefinição de senha via e-mail com integração Firebase e verificação de domínio autorizado.
* **Controle de Acesso (RBAC):** Níveis hierárquicos (Arquivista Chefe, TI e Funcionários) que limitam a visualização de documentos confidenciais.

#### 📦 Gestão e Rastreabilidade
* **Protocolo QR Code:** Geração de códigos exclusivos para cada registro, permitindo a vinculação imediata entre a pasta física e o arquivo digital.
* **Central de Ajuda Integrada:** Modais de FAQ e Suporte ao Cliente estilizados para auxiliar o usuário sem interromper o fluxo de trabalho.

#### 📱 Experiência do Usuário
* **Responsividade:** Interface adaptada para tablets e smartphones via CSS Grid e Flexbox.
* **Saudação Adaptativa:** Lógica em tempo real que altera a interface e saudações conforme o período do dia (Manhã, Tarde ou Noite).

---

### 💻 Tecnologias Utilizadas

* **Frontend:** HTML5 semântico, CSS3 (Variáveis, Grid, Flexbox) e JavaScript Vanilla (ES6+).
* **Backend & Cloud:** Firebase (Authentication, Realtime Database e Hosting).
* **Inteligência Artificial:** Google Gemini API para visão computacional e análise de texto.
* **Infraestrutura:** Docker e Docker Compose para padronização do ambiente de desenvolvimento.
* **Iconografia:** Font Awesome 6.0 e Google Fonts (Poppins/Inter).

---

### 📂 Estrutura de Arquivos


/projeto-architech
├── .docker/          # Configurações de containers e Dockerfile
├── html/             # Páginas internas (Arquivos, Configurações, FAQ)
├── css/              # Folhas de estilo modulares (Login, Dashboard, Modais)
├── js/               # Motores do sistema (Firebase, IA, UI logic)
├── img/              # Ativos visuais, logotipos e previews
├── index.html        # Página principal de autenticação
└── README.md         # Documentação técnica do projeto

🚀 Acesso e Execução
Domínio Oficial (Recomendado)
O projeto está em produção com certificado SSL ativo:
➡️ Acessar o Architech App

Execução Local (Docker)
Para rodar o ambiente espelhado ao de produção:

Certifique-se de ter o Docker instalado.

Execute o comando no terminal:

docker-compose up -d --build
Acesse http://localhost:8080.

👥 Equipe e Contribuições
🎨 Design Visual & Prototipagem: Adriane Barreto

Concepção visual original e arquitetura de UI/UX no Figma.

💻 Desenvolvimento Full-Stack: Vitor Lopes

Arquitetura de software, integração Firebase/IA, DevOps e responsividade.

🤝 Apoio no Desenvolvimento: Ana Luiza

Testes de usabilidade, QA (Quality Assurance) e refinamento de interface.

©️ Direitos Autorais e Licença
Projeto desenvolvido no SENAI Camaçari para fins acadêmicos.

© 2026 - Todos os direitos reservados.
A reprodução ou plágio deste conteúdo sem autorização prévia dos autores é estritamente proibida e sujeita a penalidades acadêmicas.