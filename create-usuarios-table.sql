-- Criar extensão UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tipo de enum se não existir
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'veterinario', 'empresa', 'cliente');
  END IF;
END $$;

-- Criar tabela usuarios se não existir
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'usuarios') THEN
    CREATE TABLE usuarios (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role user_role NOT NULL,
      empresa_id UUID,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Adicionar índice para performance
    CREATE INDEX idx_usuarios_email ON usuarios(email);
    CREATE INDEX idx_usuarios_empresa_id ON usuarios(empresa_id);
  END IF;
END $$;
