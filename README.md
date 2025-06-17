# README

// Projeto: Larify
// Slogan: "Sente-te em casa desde o primeiro clique."
// Stack: Next.js + Tailwind CSS + Supabase + Stripe + Google Maps API

// ===========================
// 📁 Estrutura Inicial do Projeto
// ===========================

/pages
├── index.tsx          // Landing Page
├── listings.tsx       // Página de pesquisa de imóveis
├── listing/[id].tsx   // Página de imóvel
├── login.tsx          // Login/Register
├── dashboard/index.tsx // Dashboard do agente

/components
├── Header.tsx
├── Footer.tsx
├── PropertyCard.tsx
├── Map.tsx

/lib
├── supabaseClient.ts
├── stripe.ts

/styles
├── globals.css

// ===========================
// 🧠 Prompt para o Cursor Agent (setup inicial)
// ===========================

/*
INSTRUÇÕES AO AGENTE CURSOR:

1. Criar um projeto Next.js com Tailwind CSS já configurado.
2. Criar a landing page com branding "Larify.pt" e slogan "Sente-te em casa desde o primeiro clique." — estilo minimalista, moderno e com hero section, CTA e footer.
3. Criar uma listagem simples de imóveis mockados (/listings), com filtro básico (tipologia, localização, preço).
4. Criar página de imóvel com galeria de imagens, descrição, mapa embutido (Google Maps com coordenadas mock).
5. Criar página de login com autenticação via Supabase.
6. Criar dashboard básica onde um agente pode ver os seus imóveis e criar um novo.
7. Adicionar suporte a dark mode (opcional).
8. Utilizar Tailwind para toda a estilização. Usar design clean e mobile-first.
*/

// ===========================
// 📦 Modelo de dados Supabase (Tabelas)
// ===========================

/*
Tabela: users
- id (UUID, PK)
- name (text)
- email (text, unique)
- role (enum: 'agent', 'buyer')
- created_at (timestamp)

Tabela: listings
- id (UUID, PK)
- user_id (FK → users.id)
- title (text)
- description (text)
- price (numeric)
- type (enum: 'apartamento', 'moradia', etc.)
- location (text)
- coords (geopoint: latitude, longitude)
- area (numeric)
- rooms (int)
- bathrooms (int)
- images (array of urls)
- created_at (timestamp)

Tabela: favorites
- id (UUID, PK)
- user_id (FK)
- listing_id (FK)
*/

// ===========================
// ✅ Objetivo para a Semana 1
// ===========================
// 1. Landing page com branding
// 2. Autenticação com Supabase
// 3. Listagem de imóveis mockados
// 4. Página de detalhe com mapa
// 5. Dashboard inicial (CRUD mínimo)


README.txt — Instruções para o Cursor AI
Este projeto chama-se Larify.pt — uma plataforma moderna onde particulares e agentes imobiliários
podem anunciar imóveis gratuitamente em Portugal.
O agente deve ter em conta os seguintes pontos ao desenvolver o projeto:

FUNCIONALIDADES ESSENCIAIS
1. Página Inicial (/)
Hero Section com nome e slogan: "Sente-te em casa desde o primeiro clique."
Call to Action: botão "Explorar imóveis"
Design moderno, clean, responsivo, em Tailwind CSS
2. Listagem de Imóveis (/listings)
Cards com imagem, título, preço, localização (cidade/freguesia), tipologia
Filtros: Localização, Preço mínimo/máximo, Tipologia
Paginação ou scroll infinito
3. Página de Detalhes do Imóvel (/listing/[id])
Galeria de imagens
Descrição longa
Mapa com localização (opcional: bairro/freguesia ou pin exato)
Nome do anunciante e botão "Contactar"
4. Autenticação (via Supabase)
Login e registo para particulares e agentes
Campos obrigatórios: Nome, Email, Tipo de Conta (Particular ou Agente), Telefone (opcional), NIF
(opcional)
5. Dashboard (autenticado)
Ver imóveis publicados
Criar novo imóvel: título, descrição, imagens, localização (texto livre ou por mapa), preço,
tipologia
Editar e apagar imóvel

⚖ TERMOS LEGAIS (incluir no site e respeitar)
Termos e Condições (obrigatório)
O conteúdo dos anúncios é da responsabilidade do utilizador.
O site não atua como mediador imobiliário, apenas como plataforma de publicação.
O site pode remover anúncios fraudulentos ou em violação dos termos.
Política de Privacidade (RGPD)
Recolha de dados: Nome, Email, IP, Imagens, Dados de login, Cookies.
Uso de dados: Apenas para funcionamento do site, autenticação e contacto entre partes.
Partilha com terceiros: Google Maps, Supabase (hospedagem), Stripe (se aplicável no futuro).
Direito de retificação e eliminação a pedido.

🛡 MODERAÇÃO E SEGURANÇA
Todos os imóveis devem ser moderados antes de aparecerem no site (modo básico: "pendente/
aprovado")
Sistema de denúncia de imóvel por utilizadores
Verificação opcional de email e NIF para agentes
Limite de imagens (máx. 10 por imóvel)

MONETIZAÇÃO FUTURA (para prever na arquitetura)
Destaques pagos (freemium): imóveis em destaque ou topo da listagem
Leads qualificados: Cobrança a agentes por contactos recebidos
Publicidade (Google Ads ou empresas locais)
Ferramentas premium para agências: estatísticas, exportações, CRM

🗃 BASE DE DADOS (Sugestão em Supabase)
Tabela: users
id
name
email
role: ["particular", "agente"]
nif (opcional)
created_at
Tabela: listings
id
user_id (FK)
title
description
price
typology
location_text
latitude (opcional)
longitude (opcional)
images (array)
is_verified (boolean)
status: ["pendente", "aprovado", "rejeitado"]
created_at

NOTAS ADICIONAIS
Design clean e mobile-first
Utilizar Tailwind CSS e Headless UI para componentes
Usar Supabase para Auth + DB + Storage de imagens
O site deve carregar rápido, ser acessível e usar SEO básico (ex: título e descrição dinâmica)

SUGESTÕES FUTURAS (não prioritárias)
Permitir vídeo nos anúncios (YouTube embed ou upload)
Página de favoritos (para utilizadores autenticados)
Notificações por email (nova mensagem ou novo imóvel na zona desejada)
Blog com dicas de compra/venda
Integração com WhatsApp para contacto rápido

Foco do MVP: funcionalidades básicas e experiência suave para o utilizador.