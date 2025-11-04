import { supabase } from './supabaseClient';
import { Atividade } from '../types';

export const atividadesService = {
  async listarPorTurma(turmaId: string): Promise<Atividade[]> {
    try {
      const { data, error } = await supabase
        .from('atividades')
        .select('*')
        .eq('id_turma', parseInt(turmaId))
        .order('id_atividade', { ascending: true });

      if (error) {
        console.error('Erro ao listar atividades:', error.message);
        return [];
      }

      return (data || []).map((atividade, index) => ({
        id: atividade.id_atividade.toString(),
        descricao: atividade.descricao,
        numero: index + 1,
        turmaId: atividade.id_turma.toString(),
        dataCriacao: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Erro inesperado ao listar atividades:', error);
      return [];
    }
  },

  async cadastrar(turmaId: string, descricao: string): Promise<Atividade> {
    try {
      const { data, error } = await supabase
        .from('atividades')
        .insert({
          descricao,
          id_turma: parseInt(turmaId),
        })
        .select()
        .single();

      if (error || !data) {
        console.error('Erro ao cadastrar atividade:', error?.message);
        throw new Error('Não foi possível cadastrar a atividade');
      }

      return {
        id: data.id_atividade.toString(),
        descricao: data.descricao,
        numero: 1,
        turmaId: data.id_turma.toString(),
        dataCriacao: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Erro inesperado ao cadastrar atividade:', error);
      throw error;
    }
  },

  async verificarSeTemAtividades(turmaId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('atividades')
        .select('id_atividade')
        .eq('id_turma', parseInt(turmaId))
        .limit(1);

      if (error) {
        console.error('Erro ao verificar atividades:', error.message);
        return false;
      }

      return (data || []).length > 0;
    } catch (error) {
      console.error('Erro inesperado ao verificar atividades:', error);
      return false;
    }
  },

  async editar(atividadeId: string, descricao: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('atividades')
        .update({ descricao })
        .eq('id_atividade', parseInt(atividadeId));

      if (error) {
        console.error('Erro ao editar atividade:', error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro inesperado ao editar atividade:', error);
      return false;
    }
  },

  async excluir(atividadeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('atividades')
        .delete()
        .eq('id_atividade', parseInt(atividadeId));

      if (error) {
        console.error('Erro ao excluir atividade:', error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro inesperado ao excluir atividade:', error);
      return false;
    }
  },
};
