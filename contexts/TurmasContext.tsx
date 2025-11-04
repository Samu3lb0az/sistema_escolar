import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { TurmasContextType, Turma, Atividade } from '../types';
import { turmasService } from '../services/turmasService';
import { atividadesService } from '../services/atividadesService';
import { useAuth } from '../hooks/useAuth';

export const TurmasContext = createContext<TurmasContextType | undefined>(undefined);

export function TurmasProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      carregarTurmas();
    } else {
      setTurmas([]);
      setAtividades([]);
    }
  }, [user]);

  const carregarTurmas = async (): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const turmasData = await turmasService.listarPorProfessor(user.id);
      setTurmas(turmasData);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cadastrarTurma = async (nome: string): Promise<boolean> => {
    if (!user) return false;

    try {
      await turmasService.cadastrar(nome, user.id);
      await carregarTurmas();
      return true;
    } catch (error) {
      console.error('Erro ao cadastrar turma:', error);
      return false;
    }
  };

  const excluirTurma = async (turmaId: string): Promise<{ sucesso: boolean; mensagem?: string }> => {
    try {
      const temAtividades = await atividadesService.verificarSeTemAtividades(turmaId);
      
      if (temAtividades) {
        return {
          sucesso: false,
          mensagem: 'Você não pode excluir uma turma com atividades cadastradas',
        };
      }

      await turmasService.excluir(turmaId);
      await carregarTurmas();
      return { sucesso: true };
    } catch (error) {
      console.error('Erro ao excluir turma:', error);
      return { sucesso: false, mensagem: 'Erro ao excluir turma' };
    }
  };

  const carregarAtividades = async (turmaId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const atividadesData = await atividadesService.listarPorTurma(turmaId);
      setAtividades(atividadesData);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cadastrarAtividade = async (turmaId: string, descricao: string): Promise<boolean> => {
    try {
      await atividadesService.cadastrar(turmaId, descricao);
      await carregarAtividades(turmaId);
      return true;
    } catch (error) {
      console.error('Erro ao cadastrar atividade:', error);
      return false;
    }
  };

  const editarAtividade = async (atividadeId: string, descricao: string): Promise<boolean> => {
    try {
      const atividade = atividades.find(a => String(a.id) === String(atividadeId));
      if (!atividade) {
        console.warn('Atividade não encontrada localmente ao editar:', atividadeId);
        // tentar recarregar todas as atividades não sendo possível obter turmaId
        return false;
      }

      const sucesso = await atividadesService.editar(atividadeId, descricao);
      if (sucesso) {
        await carregarAtividades(atividade.turmaId);
      }
      return sucesso;
    } catch (error) {
      console.error('Erro ao editar atividade:', error);
      return false;
    }
  };

  const excluirAtividade = async (atividadeId: string): Promise<boolean> => {
    try {
      const atividade = atividades.find(a => String(a.id) === String(atividadeId));
      if (!atividade) {
        console.warn('Atividade não encontrada localmente ao excluir:', atividadeId);
        return false;
      }

      const sucesso = await atividadesService.excluir(atividadeId);
      if (sucesso) {
        await carregarAtividades(atividade.turmaId);
      }
      return sucesso;
    } catch (error) {
      console.error('Erro ao excluir atividade:', error);
      return false;
    }
  };

  const obterTurma = (turmaId: string): Turma | undefined => {
    return turmas.find(t => t.id === turmaId);
  };

  return (
    <TurmasContext.Provider
      value={{
        turmas,
        atividades,
        isLoading,
        carregarTurmas,
        cadastrarTurma,
        excluirTurma,
        carregarAtividades,
        cadastrarAtividade,
        editarAtividade,
        excluirAtividade,
        obterTurma,
      }}
    >
      {children}
    </TurmasContext.Provider>
  );
}
