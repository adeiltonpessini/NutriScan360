import React from 'react'
import { SignupForm } from '../components/auth/SignupForm'

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
              NutriScan360
            </h1>
            
            <div className="space-y-4">
              <SignupForm />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta? 
                <a href="/login" className="text-blue-500 hover:underline ml-1">
                  Faça login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
