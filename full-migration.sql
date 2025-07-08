-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tipos de enum
CREATE TYPE user_role AS ENUM ('admin', 'veterinario', 'empresa', 'cliente');
CREATE TYPE animal_type AS ENUM ('cao', 'gato', 'cavalo', 'outros');
CREATE TYPE health_status AS ENUM ('saudavel', 'sobrepeso', 'baixo_peso', 'convalescente');
CREATE TYPE produto_categoria AS ENUM ('racao', 'suplemento', 'medicamento', 'acessorio');

-- Tabela de Usuários
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  role user_role NOT NULL,
  empresa_id UUID,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Empresas
CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  tipo_empresa TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Animais
CREATE TABLE animais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  tipo animal_type NOT NULL,
  raca TEXT,
  idade NUMERIC(5,2),
  peso NUMERIC(6,2),
  status_saude health_status DEFAULT 'saudavel',
  proprietario_id UUID REFERENCES usuarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Histórico Médico
CREATE TABLE historico_medico (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID REFERENCES animais(id),
  veterinario_id UUID REFERENCES usuarios(id),
  data_consulta DATE NOT NULL,
  diagnostico TEXT,
  observacoes TEXT,
  peso_atual NUMERIC(6,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Produtos
CREATE TABLE produtos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria produto_categoria NOT NULL,
  preco NUMERIC(10,2) NOT NULL,
  empresa_id UUID REFERENCES empresas(id),
  composicao JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Recomendações Nutricionais
CREATE TABLE recomendacoes_nutricionais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID REFERENCES animais(id),
  veterinario_id UUID REFERENCES usuarios(id),
  produto_id UUID REFERENCES produtos(id),
  quantidade_diaria NUMERIC(6,2),
  observacoes TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Métricas de Saúde
CREATE TABLE metricas_saude (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID REFERENCES animais(id),
  data_medicao DATE NOT NULL,
  peso NUMERIC(6,2),
  condicao_corporal NUMERIC(3,1),
  nivel_atividade TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_empresa_id ON usuarios(empresa_id);
CREATE INDEX idx_animais_proprietario ON animais(proprietario_id);
CREATE INDEX idx_historico_medico_animal ON historico_medico(animal_id);
CREATE INDEX idx_produtos_empresa ON produtos(empresa_id);

-- Funções para atualizar timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_usuarios_modtime
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_empresas_modtime
BEFORE UPDATE ON empresas
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_animais_modtime
BEFORE UPDATE ON animais
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_produtos_modtime
BEFORE UPDATE ON produtos
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
