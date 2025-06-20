-- 🧹 LIMPEZA COMPLETA DE DADOS DE TESTE
-- Execute este script no SQL Editor do Supabase

-- ⚠️ ATENÇÃO: Este script apaga TODOS os dados de utilizadores!
-- Use apenas em ambiente de desenvolvimento

-- 1. Apagar todos os perfis de utilizador
DELETE FROM public.profiles;

-- 2. Apagar todos os favoritos (se existirem)
DELETE FROM public.user_favorites WHERE true;

-- 3. Apagar todas as propriedades (se existirem)
DELETE FROM public.listings WHERE true;

-- 4. Verificar utilizadores restantes na tabela auth
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '❌ NÃO CONFIRMADO'
    ELSE '✅ CONFIRMADO'
  END as status
FROM auth.users
ORDER BY created_at DESC;

-- 5. Contar registos restantes
SELECT 
  'auth.users' as tabela, 
  count(*) as total 
FROM auth.users
UNION ALL
SELECT 
  'public.profiles' as tabela, 
  count(*) as total 
FROM public.profiles
UNION ALL
SELECT 
  'public.user_favorites' as tabela, 
  count(*) as total 
FROM public.user_favorites;

-- NOTA IMPORTANTE:
-- Para apagar utilizadores da tabela auth.users completamente:
-- 1. Ir para Authentication > Users no dashboard do Supabase
-- 2. Selecionar todos os utilizadores
-- 3. Clicar em "Delete user" para cada um
-- 
-- OU usar a API admin (se tiver service key):
-- const { error } = await supabase.auth.admin.deleteUser(userId)

-- Cleanup completed! Check results above and manually delete users from Supabase Auth dashboard if needed. 