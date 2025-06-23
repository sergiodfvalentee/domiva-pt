# 🏠 Domiva - Plataforma Imobiliária Portuguesa

*"Sinta-se em casa desde o primeiro clique."*

Uma plataforma moderna de imóveis portuguesa onde particulares e agentes imobiliários podem anunciar propriedades gratuitamente em Portugal.

## 🎯 **VISÃO DO PROJETO**

### **Missão Principal**
Criar uma plataforma imobiliária moderna e user-friendly focada no mercado português, permitindo que tanto particulares como agentes profissionais anunciem propriedades com facilidade.

### **Utilizadores-Alvo**
- **Particulares**: Indivíduos privados vendendo/arrendando as suas propriedades
- **Agentes**: Agentes imobiliários profissionais e agências
- **Compradores/Arrendatários**: Pessoas à procura de propriedades em Portugal

---

## 🚀 **ESTADO ATUAL DO PROJETO**

### ✅ **Modo de Desenvolvimento Offline (Ativo)**

O projeto foi **convertido para modo offline** para acelerar o desenvolvimento frontend, removendo todas as dependências externas e criando um sistema mock completo.

#### **Sistema Mock Implementado:**
- 🔄 **Cliente Supabase Simulado**: Todas as operações de autenticação funcionais
- 💾 **localStorage**: Persistência de dados local no browser
- ⏱️ **Delays Realistas**: Simula latência de API para experiência authentic
- 📊 **Dados Persistentes**: Utilizadores e sessões mantêm-se entre reloads

#### **Funcionalidades 100% Funcionais:**
- [x] **Página inicial** com UI completa e filtros interativos
- [x] **Criar conta** (salva no localStorage)
- [x] **Login/Logout** (autenticação simulada mas funcional)
- [x] **Dashboard** com dados mock personalizados por tipo de utilizador
- [x] **Recuperar password** (simulação de envio de email)
- [x] **Redefinir password** (funcional com validações)
- [x] **Navegação** entre todas as páginas
- [x] **Responsive design** para mobile, tablet e desktop
- [x] **Validação de formulários** client-side

---

## 🎨 **PRÓXIMOS PASSOS - DESENVOLVIMENTO FRONTEND**

### **FASE 1: Refinamento UI/UX (1-2 semanas)**

#### **1.1 Melhorar Homepage**
- [ ] **Animações suaves** nas transições entre secções
- [ ] **Hover effects** mais sophisticados nos cards
- [ ] **Loading skeletons** para melhor UX
- [ ] **Micro-interações** nos filtros rápidos
- [ ] **Scroll animations** (fade in, slide up)

#### **1.2 Otimizar Responsividade**
- [ ] **Mobile-first** refinements
- [ ] **Tablet layout** específico
- [ ] **Desktop wide-screen** optimizations
- [ ] **Touch interactions** melhoradas
- [ ] **Gestures** para mobile (swipe, etc.)

#### **1.3 Sistema de Cores & Tipografia**
- [ ] **Palette de cores** mais refinada
- [ ] **Tipografia hierárquica** consistente
- [ ] **Dark mode** opcional
- [ ] **Contrast ratios** para acessibilidade
- [ ] **Brand identity** mais forte

### **FASE 2: Páginas de Imóveis (2-3 semanas)**

#### **2.1 Página de Listagem de Imóveis**
- [ ] **Grid/List view** toggle
- [ ] **Filtros avançados** (preço, localização, tipologia)
- [ ] **Ordenação** (preço, data, relevância)
- [ ] **Pagination** ou infinite scroll
- [ ] **Map view** com pins de propriedades
- [ ] **Saved searches** functionality

#### **2.2 Página de Detalhes do Imóvel**
- [ ] **Galeria de imagens** com lightbox
- [ ] **Virtual tour** 360° placeholder
- [ ] **Mapa interativo** da localização
- [ ] **Características** do imóvel organizadas
- [ ] **Calculadora de financiamento**
- [ ] **Botão de contacto** com modal
- [ ] **Propriedades similares** sugeridas

#### **2.3 Formulário de Adicionar Imóvel**
- [ ] **Multi-step wizard** para criar anúncio
- [ ] **Upload de imagens** com preview
- [ ] **Autocomplete** para moradas
- [ ] **Validação em tempo real**
- [ ] **Draft saving** (guardar progresso)
- [ ] **Preview** antes de publicar

### **FASE 3: Dashboard & Perfis (1-2 semanas)**

#### **3.1 Dashboard do Utilizador**
- [ ] **Analytics widgets** (visualizações, contactos)
- [ ] **Gestão de anúncios** (editar, pausar, eliminar)
- [ ] **Favoritos** organizados
- [ ] **Mensagens** recebidas
- [ ] **Histórico de atividade**
- [ ] **Estatísticas personalizadas** por tipo de utilizador

#### **3.2 Perfil do Utilizador**
- [ ] **Edição de perfil** completa
- [ ] **Upload de avatar**
- [ ] **Verificação de conta** badges
- [ ] **Portfolio** para agentes
- [ ] **Reviews/ratings** system
- [ ] **Social links** para agentes

### **FASE 4: Funcionalidades Avançadas (2-3 semanas)**

#### **4.1 Sistema de Pesquisa**
- [ ] **Search as you type** com autocomplete
- [ ] **Filtros geográficos** (distrito, concelho, freguesia)
- [ ] **Range sliders** para preço e área
- [ ] **Tags visuais** para características
- [ ] **Pesquisa por mapa** (draw area)
- [ ] **Saved searches** com alerts

#### **4.2 Componentes Interativos**
- [ ] **Image carousels** melhorados
- [ ] **Progress indicators** em formulários
- [ ] **Tooltips informativos**
- [ ] **Modal system** consistente
- [ ] **Toast notifications**
- [ ] **Loading states** em todas as ações

#### **4.3 Performance & Acessibilidade**
- [ ] **Lazy loading** de imagens
- [ ] **Code splitting** por rotas
- [ ] **SEO optimization** completa
- [ ] **Accessibility audit** (WCAG 2.1)
- [ ] **Performance audit** (Core Web Vitals)
- [ ] **Error boundaries** robustos

---

## 🛠️ **STACK TECNOLÓGICO**

### **Frontend**
- **Framework**: Next.js 15 (App Router)
- **Linguagem**: JavaScript ES6+
- **Styling**: Tailwind CSS
- **Ícones**: Lucide React
- **Animações**: CSS Transitions + futuras (Framer Motion?)

### **Desenvolvimento**
- **Autenticação**: Sistema mock com localStorage
- **Dados**: Persistência local para desenvolvimento
- **Estado**: React hooks + context (futuro)

### **Futuro Backend**
- **Database**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Storage**: Supabase Storage (imagens)
- **Real-time**: Supabase subscriptions

---

## 🏃‍♂️ **COMO EXECUTAR**

```bash
# Clonar repositório
git clone https://github.com/sergiodfvalentee/domiva-pt.git
cd domiva-pt

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Abrir http://localhost:3000
```

### **Testar Funcionalidades**
1. **Criar conta** em `/criar-conta`
2. **Fazer login** em `/login`
3. **Explorar dashboard** em `/dashboard`
4. **Navegar** entre todas as páginas

---

## 📋 **METODOLOGIA DE DESENVOLVIMENTO**

### **Abordagem Frontend-First**
1. **Prototipar** todas as funcionalidades visualmente
2. **Refinar UX** sem limitações de backend
3. **Otimizar performance** e responsividade
4. **Implementar backend** quando UI estiver perfeita

### **Processo de Design**
1. **Wireframes** de baixa fidelidade
2. **Protótipos** interativos
3. **Design system** consistente
4. **User testing** com feedback

### **Controlo de Qualidade**
- **Code reviews** regulares
- **Performance monitoring**
- **Accessibility testing**
- **Cross-browser testing**
- **Mobile device testing**

---

## 📁 **ESTRUTURA DO PROJETO**

```
Domiva/
├── app/                          # Next.js App Router
│   ├── page.js                   # Homepage
│   ├── layout.js                 # Layout principal
│   ├── globals.css               # Estilos globais
│   ├── login/page.js             # Página de login
│   ├── criar-conta/page.js       # Registo
│   ├── recuperar-password/page.js # Recuperação
│   ├── redefinir-password/page.js # Reset password
│   └── dashboard/page.js         # Dashboard
├── lib/                          # Utilitários
│   ├── supabaseClient.js         # Cliente mock
│   ├── auth.js                   # Funções auth
│   └── validation.js             # Validações
├── components/                   # Componentes React (futuro)
├── middleware.js                 # Middleware Next.js
├── DESENVOLVIMENTO_OFFLINE.md    # Guia offline
└── README.md                     # Este ficheiro
```

---

## 🎯 **OBJETIVOS DE CURTO PRAZO**

### **Próximas 2 Semanas**
- [ ] Refinar homepage com animações
- [ ] Implementar páginas de listagem de imóveis
- [ ] Criar componentes reutilizáveis
- [ ] Otimizar experiência mobile

### **Próximo Mês**
- [ ] Sistema completo de gestão de imóveis
- [ ] Dashboard avançado para utilizadores
- [ ] Pesquisa e filtros sofisticados
- [ ] UI/UX polida e profissional

### **Próximos 2 Meses**
- [ ] Migração para backend real (Supabase)
- [ ] Sistema de autenticação produção
- [ ] Upload de imagens funcional
- [ ] Deploy em produção

---

## 📞 **CONTACTO & CONTRIBUIÇÃO**

Este projeto está em desenvolvimento ativo. Para questões ou sugestões:

- **Email**: [seu-email@domiva.pt]
- **GitHub**: [github.com/sergiodfvalentee/domiva-pt]

---

## 📄 **LICENÇA**

Este projeto está sob licença MIT. Ver ficheiro `LICENSE` para mais detalhes.

---

**Domiva.pt - O futuro dos imóveis em Portugal 🏡🇵🇹** 