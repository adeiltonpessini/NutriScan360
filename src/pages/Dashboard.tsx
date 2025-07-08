import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard NutriScan360</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold">Informações do Usuário</h2>
            <p>Nome: {user?.nome}</p>
            <p>Email: {user?.email}</p>
            <p>Papel: {user?.role}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Ações Rápidas</h2>
            <div className="space-y-2">
              <Button variant="primary" onClick={() => {}}>
                Novo Diagnóstico
              </Button>
              <Button variant="secondary" onClick={() => {}}>
                Meus Animais
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Button variant="danger" onClick={signOut}>
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}
