import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Card } from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { Atividade } from '../../types';
import { spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { AtividadeActionsModal } from './AtividadeActionsModal';
import { CustomAlert } from '../ui/CustomAlert';
import { useTurmas } from '../../hooks/useTurmas';

interface AtividadeCardProps {
  atividade: Atividade;
}

export function AtividadeCard({ atividade }: AtividadeCardProps) {
  const { theme } = useTheme();
  const { editarAtividade, excluirAtividade } = useTurmas();
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  async function handleSave(descricao: string) {
    return await editarAtividade(atividade.id, descricao);
  }

  async function handleDelete() {
    const sucesso = await excluirAtividade(atividade.id);
    return sucesso;
  }

  return (
    <Card>
      <View style={styles.rowTop}>
        <View style={styles.leftRow}>
          <View style={[styles.numeroBadge, { backgroundColor: theme.secondary }]}>
            <Text style={styles.numeroText}>{atividade.numero}</Text>
          </View>
          <View style={styles.content}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Atividade {atividade.numero}</Text>
            <Text style={[styles.descricao, { color: theme.text }]}>{atividade.descricao}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setShowOptions(true)} style={styles.optionsButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <Modal visible={showOptions} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowOptions(false)} />
        <View style={[styles.optionsContainer, { backgroundColor: theme.surface }]}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              setShowOptions(false);
              setShowEditModal(true);
            }}
          >
            <Ionicons name="create-outline" size={18} color={theme.text} />
            <Text style={[styles.optionText, { color: theme.text }]}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionItem, { marginTop: spacing.sm }]}
            onPress={() => {
              setShowOptions(false);
              setShowConfirmDelete(true);
            }}
          >
            <Ionicons name="trash-outline" size={18} color={theme.danger} />
            <Text style={[styles.optionText, { color: theme.danger }]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <AtividadeActionsModal
        visible={showEditModal}
        atividade={atividade}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
      />

      <CustomAlert
        visible={showConfirmDelete}
        type="confirm"
        title="Excluir atividade"
        message="Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita."
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={async () => {
          const sucesso = await handleDelete();
          setShowConfirmDelete(false);
          // opcional: toast/feedback em caso de erro
        }}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  content: {
    flex: 1,
  },
  label: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  descricao: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: 22,
  },
  optionsButton: {
    padding: spacing.xs,
    marginLeft: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  optionsContainer: {
    position: 'absolute',
    right: 16,
    top: 80,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  optionText: {
    marginLeft: spacing.xs,
    fontSize: fontSize.md,
  },
});
