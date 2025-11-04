import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { Turma } from '../../types';
import { spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';

interface TurmaCardProps {
  turma: Turma;
  onVisualizar: () => void;
  onExcluir: () => void;
}

export function TurmaCard({ turma, onVisualizar, onExcluir }: TurmaCardProps) {
  const { theme } = useTheme();

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.infoContainer}>
          <View style={[styles.numeroBadge, { backgroundColor: theme.primary }]}>
            <Text style={styles.numeroText}>{turma.numero}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.turmaTitle, { color: theme.text }]}>{turma.nome}</Text>
            <Text style={[styles.turmaSubtitle, { color: theme.textSecondary }]}>
              Turma {turma.numero}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton, { backgroundColor: theme.danger }]}
          onPress={onExcluir}
        >
          <Ionicons name="trash-outline" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.viewButton, { backgroundColor: theme.success }]}
          onPress={onVisualizar}
        >
          <Ionicons name="eye-outline" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Visualizar</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.md,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numeroBadge: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  numeroText: {
    color: '#ffffff',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  titleContainer: {
    flex: 1,
  },
  turmaTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  turmaSubtitle: {
    fontSize: fontSize.sm,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
    minHeight: 44,
  },
  deleteButton: {},
  viewButton: {},
  buttonText: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
