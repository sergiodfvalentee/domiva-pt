-- Criar tabela profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('particular', 'agente')) DEFAULT 'particular',
  nif TEXT,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela listings
CREATE TABLE IF NOT EXISTS listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  typology TEXT NOT NULL,
  location_text TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  images TEXT[],
  area DECIMAL(8, 2),
  rooms INTEGER,
  bathrooms INTEGER,
  is_verified BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('pendente', 'aprovado', 'rejeitado')) DEFAULT 'aprovado',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir utilizadores de exemplo
INSERT INTO profiles (name, email, role, telefone) VALUES
('Maria Silva', 'maria.silva@remax.pt', 'agente', '+351 912 345 678'),
('João Santos', 'joao.santos@gmail.com', 'particular', '+351 913 456 789'),
('Ana Costa', 'ana.costa@century21.pt', 'agente', '+351 914 567 890'),
('Pedro Oliveira', 'pedro.oliveira@hotmail.com', 'particular', '+351 915 678 901'),
('Sofia Ferreira', 'sofia.ferreira@era.pt', 'agente', '+351 916 789 012'),
('Miguel Rodrigues', 'miguel.rodrigues@gmail.com', 'particular', '+351 917 890 123'),
('Carla Mendes', 'carla.mendes@kw.pt', 'agente', '+351 918 901 234'),
('Ricardo Alves', 'ricardo.alves@gmail.com', 'particular', '+351 919 012 345');

-- Inserir imóveis de exemplo
INSERT INTO listings (user_id, title, description, price, typology, location_text, latitude, longitude, images, area, rooms, bathrooms, status) VALUES

-- Imóveis da Maria Silva (agente)
((SELECT id FROM profiles WHERE email = 'maria.silva@remax.pt'), 
'Apartamento T3 com Vista Mar - Cascais', 
'Magnífico apartamento T3 com vista deslumbrante sobre o mar, localizado numa das zonas mais prestigiadas de Cascais. Completamente renovado com materiais de primeira qualidade.', 
450000, 'T3', 'Cascais, Lisboa', 38.6979, -9.4215,
ARRAY['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&auto=format'],
120, 3, 2, 'aprovado'),

((SELECT id FROM profiles WHERE email = 'maria.silva@remax.pt'), 
'Moradia T4 com Jardim - Oeiras', 
'Excelente moradia T4 com jardim privativo e piscina. Localizada em zona residencial tranquila, próxima de escolas e transportes.', 
680000, 'T4', 'Oeiras, Lisboa', 38.6872, -9.3097,
ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format'],
180, 4, 3, 'aprovado'),

-- Imóveis do João Santos (particular)
((SELECT id FROM profiles WHERE email = 'joao.santos@gmail.com'), 
'Apartamento T2 Renovado - Sintra', 
'Apartamento T2 completamente renovado no centro histórico de Sintra. Ideal para primeira habitação ou investimento.', 
280000, 'T2', 'Sintra, Lisboa', 38.8029, -9.3817,
ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop&auto=format'],
85, 2, 1, 'aprovado'),

-- Imóveis da Ana Costa (agente)
((SELECT id FROM profiles WHERE email = 'ana.costa@century21.pt'), 
'Loft Moderno - Lisboa Príncipe Real', 
'Loft moderno e luminoso no coração do Príncipe Real. Espaço único com pé direito alto e acabamentos de luxo.', 
550000, 'Loft', 'Príncipe Real, Lisboa', 38.7139, -9.1495,
ARRAY['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format'],
95, 1, 1, 'aprovado'),

((SELECT id FROM profiles WHERE email = 'ana.costa@century21.pt'), 
'Apartamento T3 - Porto Centro', 
'Apartamento T3 no centro do Porto, próximo da Ribeira. Edifício histórico completamente reabilitado.', 
320000, 'T3', 'Porto, Porto', 41.1579, -8.6291,
ARRAY['https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1505843795480-5cfb3c03f6ff?w=800&h=600&fit=crop&auto=format'],
110, 3, 2, 'aprovado'),

-- Imóveis da Sofia Ferreira (agente)
((SELECT id FROM profiles WHERE email = 'sofia.ferreira@era.pt'), 
'Apartamento T4 com Terraço - Braga', 
'Espaçoso apartamento T4 com terraço de 50m². Localização privilegiada no centro de Braga, próximo de todas as comodidades.', 
280000, 'T4', 'Braga, Braga', 41.5518, -8.4229,
ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&auto=format'],
140, 4, 2, 'aprovado'),

-- Imóveis do Miguel Rodrigues (particular)
((SELECT id FROM profiles WHERE email = 'miguel.rodrigues@gmail.com'), 
'Quinta com Piscina - Aveiro', 
'Magnífica quinta com 5000m² de terreno, piscina e casa principal T6. Ideal para turismo rural ou residência familiar.', 
750000, 'Quinta', 'Aveiro, Aveiro', 40.6443, -8.6455,
ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&auto=format'],
300, 6, 4, 'aprovado'),

-- Imóveis da Carla Mendes (agente)
((SELECT id FROM profiles WHERE email = 'carla.mendes@kw.pt'), 
'Apartamento T2 - Faro Centro', 
'Apartamento T2 no centro de Faro, próximo da marina. Excelente oportunidade de investimento no Algarve.', 
195000, 'T2', 'Faro, Faro', 37.0194, -7.9304,
ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&h=600&fit=crop&auto=format'],
75, 2, 1, 'aprovado'),

((SELECT id FROM profiles WHERE email = 'carla.mendes@kw.pt'), 
'Moradia V3 com Piscina - Albufeira', 
'Moradia V3 com piscina privativa a 5 minutos da praia. Ideal para férias ou investimento turístico.', 
420000, 'V3', 'Albufeira, Faro', 37.0887, -8.2507,
ARRAY['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop&auto=format'],
150, 3, 2, 'aprovado'),

-- Imóveis do Ricardo Alves (particular)
((SELECT id FROM profiles WHERE email = 'ricardo.alves@gmail.com'), 
'Apartamento T1 - Coimbra Universidade', 
'Apartamento T1 próximo da Universidade de Coimbra. Perfeito para estudantes ou jovens profissionais.', 
125000, 'T1', 'Coimbra, Coimbra', 40.2033, -8.4103,
ARRAY['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&auto=format'],
45, 1, 1, 'aprovado');

-- Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para permitir leitura pública
CREATE POLICY "Allow public read access on profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on listings" ON listings FOR SELECT USING (true);

-- Mostrar estatísticas
SELECT 'Profiles criados:' as info, COUNT(*) as total FROM profiles
UNION ALL
SELECT 'Listings criados:' as info, COUNT(*) as total FROM listings; 