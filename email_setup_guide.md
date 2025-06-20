# 📧 Configurar Email de Verificação no Supabase

## 🚨 **PROBLEMA ATUAL**
- Emails de verificação não chegam aos utilizadores
- Supabase gratuito tem limitações de email
- Verificação obrigatória está ativa (✅ bom sinal!)

## 🔧 **SOLUÇÕES**

### **Solução 1: Usar Gmail SMTP (Recomendado para desenvolvimento)**

1. **No Supabase Dashboard**:
   - Project Settings → Authentication → SMTP Settings
   - Enable custom SMTP

2. **Configurações Gmail**:
   ```
   Host: smtp.gmail.com
   Port: 587
   Username: seu.email@gmail.com
   Password: [app password do Gmail]
   ```

3. **Criar App Password no Gmail**:
   - Google Account → Security → 2-Step Verification
   - App passwords → Generate password
   - Usar essa password no Supabase

### **Solução 2: Usar Provedor Gratuito (Sendgrid/Mailgun)**

**SendGrid** (100 emails/dia grátis):
1. Criar conta em sendgrid.com
2. Gerar API key
3. Configurar no Supabase SMTP

### **Solução 3: Temporária - Desativar Verificação**

Para testes rápidos (⚠️ menos seguro):
1. Supabase → Authentication → User Signups
2. Desativar "Enable email confirmations"
3. Testar funcionamento básico
4. Reativar depois

### **Solução 4: Ver Emails no Supabase Logs**

Para desenvolvimento:
1. Supabase → Logs
2. Filtrar por "auth"
3. Ver links de verificação nos logs

## 🧪 **TESTE RÁPIDO**

1. **Verificar se está bloqueando**:
   - Criar conta nova
   - Tentar login → deve dar erro de verificação ✅

2. **Verificar configuração atual**:
   ```sql
   -- Execute no SQL Editor do Supabase
   SELECT 
     id,
     email,
     email_confirmed_at,
     created_at
   FROM auth.users 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```

## 🎯 **PRIORIDADES**

1. **Primeiro**: Confirmar que verificação obrigatória funciona
2. **Segundo**: Configurar SMTP ou usar logs para obter links
3. **Terceiro**: Testar fluxo completo

## 🔍 **DEBUG ATUAL**

Execute no SQL Editor:
```sql
-- Ver utilizadores não confirmados
SELECT 
  email,
  email_confirmed_at IS NULL as not_confirmed,
  created_at
FROM auth.users 
WHERE email_confirmed_at IS NULL;
```

**Que solução prefere tentar primeiro?** 