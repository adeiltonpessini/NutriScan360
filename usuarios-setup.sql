-- Criar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tipo de enum para roles de usuário
CREATE TYPE user_role AS ENUM ('admin', 'veterinario', 'empresa', 'cliente');

-- Criar tabela usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL,
  empresa_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhorar performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_empresa_id ON usuarios(empresa_id);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_usuarios_modtime
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
