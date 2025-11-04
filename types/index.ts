export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
}

export interface Professor {
  id: string;
  nome: string;
  email: string;
}

export interface Turma {
  id: string;
  nome: string;
  numero: number;
  professorId: string;
  dataCriacao: string;
}

export interface Atividade {
  id: string;
  descricao: string;
  numero: number;
  turmaId: string;
  dataCriacao: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export interface TurmasContextType {
  turmas: Turma[];
  atividades: Atividade[];
  isLoading: boolean;
  carregarTurmas: () => Promise<void>;
  cadastrarTurma: (nome: string) => Promise<boolean>;
  excluirTurma: (turmaId: string) => Promise<{ sucesso: boolean; mensagem?: string }>;
  carregarAtividades: (turmaId: string) => Promise<void>;
  cadastrarAtividade: (turmaId: string, descricao: string) => Promise<boolean>;
  editarAtividade: (atividadeId: string, descricao: string) => Promise<boolean>;
  excluirAtividade: (atividadeId: string) => Promise<boolean>;
  obterTurma: (turmaId: string) => Turma | undefined;
}
