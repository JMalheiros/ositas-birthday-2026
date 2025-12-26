import { useState } from 'react';
import { Lock } from 'lucide-react';
import { verifyPassword } from '@/utils/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const isValid = await verifyPassword(password);
      
      if (isValid) {
        setIsAuthenticated(true);
      } else {
        setError('Senha incorreta. Tente novamente.');
        setPassword('');
      }
    } catch (err) {
      setError('Erro ao validar senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4">
        <div className="max-w-md w-full">
          <div className="bg-primary rounded-2xl shadow-2xl p-8 border-4 border-secondary">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-primary rounded-full p-4 mb-4">
                <Lock className="w-12 h-12 text-black" />
              </div>
              <p className="text-black text-center">
                Esta página está protegida. Digite a senha para acessar o conteúdo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="Digite a senha"
                  disabled={isLoading}
                  autoFocus
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="bg-white text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full bg-gray-600 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? 'Verificando...' : 'Entrar'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-black">
              <p>Conteúdo exclusivo para convidados</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
