import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useTurmas } from '../../hooks/useTurmas';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/layout/Header';
import { TurmaCard } from '../../components/feature/TurmaCard';
import { CustomAlert } from '../../components/ui/CustomAlert';
import { spacing, fontSize, borderRadius } from '../../constants/theme';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { turmas, excluirTurma, carregarTurmas, isLoading } = useTurmas();
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const handleLogout = () => {
    setAlert({
      visible: true,
      type: 'confirm',
      title: 'Sair do sistema',
      message: 'Deseja realmente sair?',
      onConfirm: async () => {
        setAlert({ ...alert, visible: false });
        await logout();
        router.replace('/login');
      },
      onCancel: () => setAlert({ ...alert, visible: false }),
    });
  };

  const handleExcluirTurma = (turmaId: string, turmaNome: string) => {
    setAlert({
      visible: true,
      type: 'confirm',
      title: 'Confirmar exclusão',
      message: `Deseja realmente excluir a turma "${turmaNome}"?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        setAlert({ ...alert, visible: false });
        const resultado = await excluirTurma(turmaId);
        
        if (resultado.sucesso) {
          setAlert({
            visible: true,
            type: 'success',
            title: 'Turma excluída',
            message: 'A turma foi removida com sucesso',
          });
        } else {
          setAlert({
            visible: true,
            type: 'error',
            title: 'Não foi possível excluir',
            message: resultado.mensagem || 'Erro ao excluir turma',
          });
        }
      },
      onCancel: () => setAlert({ ...alert, visible: false }),
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={user?.nome || 'Professor'}
        subtitle={`${turmas.length} turma${turmas.length !== 1 ? 's' : ''} cadastrada${turmas.length !== 1 ? 's' : ''}`}
        rightAction={{
          icon: 'log-out-outline',
          onPress: handleLogout,
        }}
      />

      <View style={styles.content}>
        {turmas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={80} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Nenhuma turma cadastrada
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Comece adicionando sua primeira turma
            </Text>
          </View>
        ) : (
          <FlatList
            data={turmas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TurmaCard
                turma={item}
                onVisualizar={() => router.push(`/atividades?turmaId=${item.id}`)}
                onExcluir={() => handleExcluirTurma(item.id, item.nome)}
              />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={carregarTurmas}
                tintColor={theme.primary}
              />
            }
          />
        )}

        <View style={[styles.fabContainer, { paddingBottom: insets.bottom + spacing.md }]}>
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/cadastrar-turma')}
          >
            <Ionicons name="add" size={32} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        confirmText={alert.type === 'confirm' ? 'Confirmar' : 'OK'}
        cancelText="Cancelar"
        onConfirm={alert.onConfirm || (() => setAlert({ ...alert, visible: false }))}
        onCancel={alert.onCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 0,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
