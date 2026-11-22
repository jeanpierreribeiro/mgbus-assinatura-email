# Levantamento e Especificação Técnica: Gerador de Assinaturas de E-mail (mgbus)

Documento de especificação funcional e técnica para desenvolvimento da aplicação interna de geração e padronização de assinaturas de e-mail da **mgbus**.

---

## 1. Visão Geral da Aplicação

A aplicação tem como objetivo permitir que colaboradores da **mgbus** criem, customizem e exportem assinaturas de e-mail profissionais e padronizadas de forma simples, em tempo real e com compatibilidade total entre os principais clientes de e-mail (Gmail, Outlook Web/Desktop, Apple Mail, Thunderbird, etc.).

A interface é dividida em duas áreas principais:
1. **Painel de Configuração (Esquerda):** Menus em abas verticais para preenchimento de dados, imagens, seleção de templates e estilos.
2. **Área de Pré-visualização Interativa (Direita):** Mockup de cliente de e-mail com reatividade instantânea (*WYSIWYG*) e ações de exportação.

---

## 2. Módulos e Abas de Configuração

### Aba 1: Modelos (Templates de Layout)
Disponibilização de múltiplos layouts pré-formatados:
* **Estrutura de Grade:**
  * **Layout Horizontal:** Foto/logotipo à esquerda, linha divisória vertical estilizada e dados de contato à direita.
  * **Layout Vertical/Empilhado:** Foto/logotipo centralizados no topo ou alinhados à esquerda acima dos dados textuais.
  * **Layout em Duas Colunas:** Dados cadastrais na primeira coluna, ícones de redes sociais e banner promocional na coluna lateral.
* **Critério Técnico:** Todos os templates utilizam marcação baseada em tabelas HTML aninhadas (`<table>`, `<tr>`, `<td>`), dispensando Flexbox ou CSS Grid no e-mail final para assegurar compatibilidade legada.

---

### Aba 2: Detalhes (Dados Cadastrais)
Campos do formulário com atualização em tempo real:
* **Identificação Profissional:**
  * Nome e Sobrenome.
  * Cargo / Função na mgbus.
  * Departamento / Setor (ex.: Tráfego, Manutenção, TI, RH, Diretoria).
  * Empresa / Filial (`mgbus`).
* **Canais de Contato:**
  * Telefone comercial / Ramal.
  * Telefone celular / WhatsApp comercial.
  * Endereço de e-mail corporativo (`@mgbus...`).
  * Site oficial da empresa.
* **Endereço Físico / Garagens / Unidades:**
  * Linha 1: Logradouro e número.
  * Linha 2: Bairro e complemento.
  * Linha 3: Cidade, UF e CEP.
* **Redes Sociais Oficiais:**
  * Campos para inserção de URLs: LinkedIn, Instagram, Facebook, X (Twitter) e WhatsApp (`https://wa.me/...`).
  * Geração dinâmica dos ícones correspondentes com links diretos.
* **Campos Personalizados Dinâmicos:**
  * Botão `+ Adicionar campo` permitindo incluir pares chave/valor livres (ex.: Matrícula, Certificações, Registro Operacional).
* **Rodapé Jurídico / Termos de Privacidade:**
  * Caixa de texto para termos de confidencialidade, conformidade com a LGPD e aviso de segurança da informação.

---

### Aba 3: Imagens e Mídia
Gerenciamento de mídias com links públicos e seguros (HTTPS):
* **Foto de Perfil (Avatar):**
  * Campo para URL da foto do colaborador ou upload para CDN interno.
  * Opções de formato visual: circular (`border-radius: 50%`) ou cantos arredondados.
* **Logotipo Institucional:**
  * Logotipo padrão da mgbus (com suporte a variações de cor ou contraste).
* **Banner de Ação (CTA Promocional / Informativo):**
  * URL da imagem do banner (ex.: avisos internos, aplicativos, campanhas institucionais).
  * URL de redirecionamento ao clicar no banner.

---

### Aba 4: Estilos e Tipografia
Padronização visual alinhada à identidade visual da mgbus:
* **Paleta de Cores (Seletores com código HEX e presets da marca):**
  * **Cor Primária:** Aplicada a divisórias, ícones sociais, destaques e linhas decorativas.
  * **Cor do Texto:** Aplicada a nomes, cargos e detalhes de texto.
  * **Cor dos Links:** Aplicada a e-mails, endereços e URLs clicáveis.
* **Tipografia Compatível (*Web-Safe Fonts*):**
  * Seleção de fontes nativas universais: Arial, Trebuchet MS, Verdana, Tahoma, Georgia, Times New Roman.
  * Seletor de escala de tamanho: Pequeno, Médio e Grande.

---

## 3. Comportamento do Painel de Pré-visualização (Preview)

* **Mockup de E-mail:** Interface que simula a janela de composição de uma mensagem (barra superior, campos `Para:`, `Assunto:` e corpo do e-mail).
* **Renderização Condicional:** Campos não preenchidos são automaticamente omitidos do HTML sem deixar espaços vazios ou quebrar a estética.
* **Tratamento de Links:** Adição automática de protocolos funcionais (`mailto:`, `tel:`, `https://`).
* **Botão "Apagar todos os campos":** Permite limpar todo o formulário com confirmação de segurança.

---

## 4. Fluxo de Exportação e Instalação

Ao acionar o botão principal **"Criar Assinatura"**, o usuário tem acesso às opções de uso:

1. **Copiar Assinatura (Rich Text / Formatação Direta):**
   * Copia o elemento renderizado diretamente para a área de transferência (`Clipboard API` com tipo `text/html`).
   * Permite colar (`Ctrl + V`) diretamente nos campos de assinatura do **Gmail**, **Outlook Web**, **Apple Mail**, etc.
2. **Copiar Código HTML Puro:**
   * Copia o código HTML com estilos inline (`style="..."`), compatível com clientes que recebem código-fonte ou importação de arquivos de assinatura.
3. **Instruções e Tutoriais Rápidos:**
   * Abas expansíveis com passo a passo ilustrado para configuração nos principais clientes de e-mail corporativos.

---

## 5. Diretrizes Técnicas de Desenvolvimento

1. **Estrutura HTML do E-mail:**
   * Utilizar exclusivamente tabelas aninhadas (`<table cellpadding="0" cellspacing="0" border="0">`).
   * Não utilizar seletores CSS externos, classes de frameworks (Tailwind, Bootstrap) ou regras de layout modernas (`display: flex`, `display: grid`) no código final da assinatura.
   * Todos os estilos visuais devem ser aplicados inline em cada elemento `<td>`, `<span>`, `<a>` ou `<img>`.
2. **Armazenamento de Imagens:**
   * Todas as imagens (logotipos, ícones sociais, avatares) devem estar hospedadas em URLs HTTPS públicas, com certificados válidos e dimensões explícitas (`width` e `height`) no HTML.
3. **Stack Sugerida para o Aplicativo Web:**
   * Frontend: React / Vue / Vanilla TypeScript com Tailwind CSS para a interface do aplicativo.
   * Mecanismo de template para geração de HTML limpo de e-mail isolado.
