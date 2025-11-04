import { supabase } from './supabaseClient';
import { Turma } from '../types';

export const turmasService = {
  async listarPorProfessor(professorId: string): Promise<Turma[]> {
    try {
      const { data, error } = await supabase
        .from('turmas')
        .select('*')
        .eq('id_professor', professorId)
        .order('id_turma', { ascending: true });

      if (error) {
        console.error('Erro ao listar turmas:', error.message);
        return [];
      }

      return (data || []).map((turma, index) => ({
        id: turma.id_turma.toString(),
        nome: turma.nome,
        numero: index + 1,
        professorId: turma.id_professor,
        dataCriacao: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Erro inesperado ao listar turmas:', error);
      return [];
    }
  },

  async cadastrar(nome: string, professorId: string): Promise<Turma> {
    try {
      const { data, error } = await supabase
        .from('turmas')
        .insert({
          nome,
          id_professor: professorId,
        })
        .select()
        .single();

      if (error || !data) {
        console.error('Erro ao cadastrar turma:', error?.message);
        throw new Error('Não foi possível cadastrar a turma');
      }

      return {
        id: data.id_turma.toString(),
        nome: data.nome,
        numero: 1,
        professorId: data.id_professor,
        dataCriacao: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Erro inesperado ao cadastrar turma:', error);
      throw error;
    }
  },

  async excluir(turmaId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('turmas')
        .delete()
        .eq('id_turma', parseInt(turmaId));

      if (error) {
        console.error('Erro ao excluir turma:', error.message);
        throw new Error('Não foi possível excluir a turma');
      }
    } catch (error) {
      console.error('Erro inesperado ao excluir turma:', error);
      throw error;
    }
  },

  async obterPorId(turmaId: string): Promise<Turma | null> {
    try {
      const { data, error } = await supabase
        .from('turmas')
        .select('*')
        .eq('id_turma', parseInt(turmaId))
        .single();

      if (error || !data) {
        console.error('Erro ao obter turma:', error?.message);
        return null;
      }

      return {
        id: data.id_turma.toString(),
        nome: data.nome,
        numero: 1,
        professorId: data.id_professor,
        dataCriacao: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Erro inesperado ao obter turma:', error);
      return null;
    }
  },
};
