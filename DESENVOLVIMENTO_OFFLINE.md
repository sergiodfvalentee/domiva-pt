# 🚀 Domiva - Modo de Desenvolvimento Offline

## ✨ Alterações Realizadas

O projeto foi convertido para funcionar completamente em **modo offline** para desenvolvimento frontend, sem dependências externas.

### 📦 Dependências Removidas
- `@supabase/supabase-js` - Cliente Supabase
- `@vercel/analytics` - Analytics do Vercel

### 🔧 Arquivos Modificados

#### 1. `package.json`
- Removidas dependências do Supabase e Vercel Analytics
- Projeto agora funciona apenas com React, Next.js e Tailwind

#### 2. `lib/supabaseClient.js`
- **ANTES**: Cliente real do Supabase
- **AGORA**: Cliente mock que simula todas as operações usando localStorage
- Armazena utilizadores e sessões no browser
- Simula delays de API para experiência realista

#### 3. `lib/auth.js`
- Mantém todas as funções originais
- Agora funciona com o cliente mock
- Logs detalhados para desenvolvimento
- Autenticação simulada mas funcional

#### 4. `middleware.js`
- **ANTES**: Rate limiting complexo e validações de segurança
- **AGORA**: Headers básicos para desenvolvimento
- Sem rate limiting
- Logs simplificados

#### 5. `app/layout.js`
- Removido componente Analytics do Vercel

## 🎯 Funcionalidades Disponíveis

### ✅ Completamente Funcionais
- [x] Página inicial com UI completa
- [x] Criar conta (salva no localStorage)
- [x] Login/Logout (simulado)
- [x] Dashboard (com dados mock)
- [x] Recuperar password (simulado)
- [x] Redefinir password (simulado)
- [x] Navegação entre páginas
- [x] Todos os estilos e componentes visuais

### 📊 Dados Simulados
- Utilizadores armazenados no `localStorage`
- Sessões persistem entre reloads
- Dados de perfil gerados automaticamente
- Validações de formulário funcionais

## 🏃‍♂️ Como Executar

```bash
# Instalar dependências (muito mais rápido agora!)
npm install

# Executar em modo desenvolvimento
npm run dev

# Abrir http://localhost:3000
```

## 🧪 Testar Funcionalidades

### Criar Conta
1. Ir para `/criar-conta`
2. Preencher formulário
3. Conta é criada e salva no localStorage
4. Login automático para o dashboard

### Login
1. Ir para `/login`
2. Usar qualquer email/password de conta criada
3. Ou criar nova conta primeiro

### Dados Persistentes
- Todos os dados ficam salvos no localStorage
- Para "reset", limpar localStorage do browser
- Múltiplas contas podem ser criadas

## 📁 Estrutura de Dados (localStorage)

```javascript
// Utilizadores registados
domiva_users: [
  {
    id: "user_1234567890",
    email: "test@example.com",
    user_metadata: {
      name: "João Silva",
      phone: "912345678",
      user_type: "particular"
    },
    created_at: "2024-01-01T00:00:00.000Z",
    email_confirmed_at: "2024-01-01T00:00:00.000Z"
  }
]

// Utilizador atual
domiva_current_user: { ... }
```

## 🎨 Desenvolvimento Frontend

Agora podes focar 100% no desenvolvimento visual:

- ✨ Melhorar componentes UI
- 🎨 Ajustar estilos e layouts
- 📱 Testar responsividade
- 🔄 Adicionar animações
- 📋 Criar novos formulários
- 🏗️ Estruturar páginas

## 🔄 Voltar ao Backend Online

Quando quiseres voltar ao backend real:

1. Reinstalar dependências:
```bash
npm install @supabase/supabase-js @vercel/analytics
```

2. Restaurar `lib/supabaseClient.js` com configuração real
3. Adicionar variáveis de ambiente `.env.local`
4. Restaurar middleware completo se necessário

## 💡 Vantagens do Modo Offline

- ⚡ **Desenvolvimento mais rápido** - sem API calls reais
- 🔄 **Testes imediatos** - sem configurar backend
- 📊 **Dados controlados** - criar cenários específicos
- 🎯 **Foco no frontend** - sem distrações de infraestrutura
- 💾 **Sem custos** - nenhum serviço externo

---

**Pronto para desenvolver! 🚀** 