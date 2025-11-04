import { supabase } from './supabaseClient';
import { Professor } from '../types';

export const authService = {
  async login(email: string, senha: string): Promise<Professor | null> {
    try {
      // Autentica com Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (authError || !authData.user) {
        console.error('Erro no login:', authError?.message);
        return null;
      }

      // Busca dados do professor
      const { data: professor, error: profileError } = await supabase
        .from('professores')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !professor) {
        console.error('Erro ao buscar perfil:', profileError?.message);
        return null;
      }

      return {
        id: professor.id,
        nome: professor.nome,
        email: authData.user.email!,
      };
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      return null;
    }
  },

  async cadastrar(nome: string, email: string, senha: string): Promise<Professor | null> {
    try {
      // Cadastra usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome,
          },
        },
      });

      if (authError || !authData.user) {
        console.error('Erro no cadastro:', authError?.message);
        return null;
      }

      // Insere dados do professor na tabela
      const { error: insertError } = await supabase
        .from('professores')
        .insert({
          id: authData.user.id,
          nome,
        });

      if (insertError) {
        console.error('Erro ao criar perfil:', insertError.message);
        return null;
      }

      return {
        id: authData.user.id,
        nome,
        email,
      };
    } catch (error) {
      console.error('Erro inesperado no cadastro:', error);
      return null;
    }
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  async getUsuarioAtual(): Promise<Professor | null> {
    try {
      // Recupera sessão atual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return null;
      }

      // Busca dados do professor
      const { data: professor, error } = await supabase
        .from('professores')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error || !professor) {
        return null;
      }

      return {
        id: professor.id,
        nome: professor.nome,
        email: session.user.email!,
      };
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  },
};
