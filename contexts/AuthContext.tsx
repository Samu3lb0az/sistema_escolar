import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AppState } from 'react-native';
import { AuthContextType, User } from '../types';
import { authService } from '../services/authService';
import { supabase } from '../services/supabaseClient';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carrega sessão inicial
    carregarSessao();

    // Listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: professor } = await supabase
            .from('professores')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (professor) {
            setUser({
              id: professor.id,
              nome: professor.nome,
              email: session.user.email!,
              senha: '', // Não armazenamos senha
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Gerencia refresh de token baseado no estado do app
    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.unsubscribe();
      appStateSubscription.remove();
    };
  }, []);

  const carregarSessao = async () => {
    try {
      setIsLoading(true);
      const professor = await authService.getUsuarioAtual();
      if (professor) {
        setUser({
          id: professor.id,
          nome: professor.nome,
          email: professor.email,
          senha: '',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const professor = await authService.login(email, senha);
      if (professor) {
        setUser({
          id: professor.id,
          nome: professor.nome,
          email: professor.email,
          senha: '',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const cadastrar = async (nome: string, email: string, senha: string): Promise<boolean> => {
    try {
      const professor = await authService.cadastrar(nome, email, senha);
      if (professor) {
        setUser({
          id: professor.id,
          nome: professor.nome,
          email: professor.email,
          senha: '',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, cadastrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
