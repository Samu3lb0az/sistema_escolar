import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTurmas } from '../hooks/useTurmas';
import { useTheme } from '../hooks/useTheme';
import { Header } from '../components/layout/Header';
import { AtividadeCard } from '../components/feature/AtividadeCard';
import { spacing, fontSize, borderRadius } from '../constants/theme';

export default function Atividades() {
  const { turmaId } = useLocalSearchParams();
  const { atividades, carregarAtividades, obterTurma, isLoading } = useTurmas();
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const turma = obterTurma(turmaId as string);

  useEffect(() => {
    if (turmaId) {
      carregarAtividades(turmaId as string);
    }
  }, [turmaId]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={turma?.nome || 'Atividades'}
        subtitle={`${atividades.length} atividade${atividades.length !== 1 ? 's' : ''}`}
        showBack
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        {atividades.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={80} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Nenhuma atividade cadastrada
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Adicione atividades para esta turma
            </Text>
          </View>
        ) : (
          <FlatList
            data={atividades}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AtividadeCard atividade={item} />}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => carregarAtividades(turmaId as string)}
                tintColor={theme.primary}
              />
            }
          />
        )}

        <View style={[styles.fabContainer, { paddingBottom: insets.bottom + spacing.md }]}>
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: theme.secondary }]}
            onPress={() => router.push(`/cadastrar-atividade?turmaId=${turmaId}`)}
          >
            <Ionicons name="add" size={32} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
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
