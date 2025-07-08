import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginForm: React.FC = () => {
  const { signIn } = useAuth()

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setError 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password)
    } catch (error: any) {
      setError('root', { 
        type: 'manual', 
        message: 'Credenciais inválidas. Tente novamente.' 
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login NutriScan360</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input 
              type="email" 
              {...register('email')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input 
              type="password" 
              {...register('password')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          {errors.root && (
            <p className="text-red-500 text-sm text-center">{errors.root.message}</p>
          )}
          <Button type="submit" className="w-full">
            Entrar
          </Button>
          <div className="text-center mt-4">
            <Link to="/signup" className="text-blue-500 hover:underline">
              Não tem uma conta? Cadastre-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
