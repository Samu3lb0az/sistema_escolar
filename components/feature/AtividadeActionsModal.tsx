import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { spacing, borderRadius, fontSize } from '../../constants/theme';
import { Atividade } from '../../types';

interface Props {
  visible: boolean;
  atividade?: Atividade | null;
  onClose: () => void;
  onSave: (descricao: string) => Promise<boolean> | boolean;
}

export function AtividadeActionsModal({ visible, atividade, onClose, onSave }: Props) {
  const { theme } = useTheme();
  const [descricao, setDescricao] = useState(atividade?.descricao ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDescricao(atividade?.descricao ?? '');
  }, [atividade, visible]);

  async function salvar() {
    if (!atividade) return;
    setSaving(true);
    try {
      const sucesso = await onSave(descricao);
      if (sucesso) onClose();
      // caso contrario, manter aberto para nova tentativa
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text }]}>Editar Atividade</Text>

          <Input
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            style={{ marginBottom: spacing.md }}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btnCancel]} onPress={onClose}>
              <Text style={{ color: theme.textSecondary }}>Cancelar</Text>
            </TouchableOpacity>

            <Button title="Salvar" onPress={salvar} loading={saving} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    padding: spacing.lg,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    alignItems: 'center',
  },
  btnCancel: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
});
