import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Carrega variáveis de ambiente
dotenv.config()

async function executeSQL(supabase, sqlFilePath) {
  const sql = fs.readFileSync(path.resolve(sqlFilePath), 'utf8')
  
  try {
    // Usar método de execução de SQL via RPC
    const { error } = await supabase.rpc('execute_sql', { sql_query: sql })
    
    if (error) {
      console.error('❌ Erro ao executar SQL:', error)
      return false
    }
    
    return true
  } catch (err) {
    console.error('❌ Erro inesperado ao executar SQL:', err)
    return false
  }
}

async function createExecuteSqlFunction(supabase) {
  const createFunctionSql = `
    CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT) 
    RETURNS VOID AS $$
    BEGIN
      EXECUTE sql_query;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `

  try {
    const { error } = await supabase.rpc('execute_sql', { sql_query: createFunctionSql })
    
    if (error) {
      console.error('❌ Erro ao criar função execute_sql:', error)
      return false
    }
    
    return true
  } catch (err) {
    console.error('❌ Erro inesperado ao criar função:', err)
    return false
  }
}

async function testSupabaseConnection() {
  console.log('🔍 Iniciando teste de conexão com Supabase...')

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Credenciais do Supabase não encontradas!')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    // Criar função execute_sql
    console.log('🔗 Criando função execute_sql...')
    const functionCreated = await createExecuteSqlFunction(supabase)
    
    if (!functionCreated) {
      console.error('❌ Falha ao criar função execute_sql')
      process.exit(1)
    }

    // Criar tabela usuarios
    console.log('🔗 Criando tabela usuarios...')
    const tableCreated = await executeSQL(supabase, 'create-usuarios-table.sql')
    
    if (!tableCreated) {
      console.error('❌ Falha ao criar tabela usuarios')
      process.exit(1)
    }

    console.log('✅ Tabela usuarios criada com sucesso!')

    // Teste 1: Conexão básica
    console.log('🔗 Verificando conexão básica...')
    const { data, error } = await supabase.from('usuarios').select('*').limit(1)
    
    if (error) {
      console.error('❌ Erro ao consultar tabela usuarios:', error)
      process.exit(1)
    }

    console.log('✅ Conexão com tabela usuarios: OK')
    console.log('📊 Registros encontrados:', data.length)

    // Teste 2: Autenticação
    console.log('🔐 Testando autenticação...')
    const testEmail = 'teste@nutriscan360.com'
    const testPassword = 'TesteSenha123!'

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    })

    if (authError) {
      console.error('❌ Erro no registro de usuário:', authError)
      process.exit(1)
    }

    console.log('✅ Registro de usuário: OK')
    console.log('👤 Usuário criado:', authData.user?.email)

    // Teste 3: Login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })

    if (loginError) {
      console.error('❌ Erro no login:', loginError)
      process.exit(1)
    }

    console.log('✅ Login de usuário: OK')
    console.log('🎉 Todos os testes de Supabase concluídos com sucesso!')
  } catch (err) {
    console.error('❌ Erro inesperado:', err)
    process.exit(1)
  }
}

testSupabaseConnection()
