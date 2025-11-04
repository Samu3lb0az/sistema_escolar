import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTurmas } from '../hooks/useTurmas';
import { useTheme } from '../hooks/useTheme';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CustomAlert } from '../components/ui/CustomAlert';
import { spacing, fontSize, fontWeight, borderRadius } from '../constants/theme';

export default function CadastrarAtividade() {
  const { turmaId } = useLocalSearchParams();
  const { cadastrarAtividade, obterTurma } = useTurmas();
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const turma = obterTurma(turmaId as string);

  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const handleCadastrar = async () => {
    if (!descricao.trim()) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Campo obrigatório',
        message: 'Por favor, informe a descrição da atividade',
      });
      return;
    }

    setLoading(true);
    const sucesso = await cadastrarAtividade(turmaId as string, descricao.trim());
    setLoading(false);

    if (sucesso) {
      setAlert({
        visible: true,
        type: 'success',
        title: 'Atividade cadastrada!',
        message: 'A atividade foi criada com sucesso',
      });
      setTimeout(() => {
        router.back();
      }, 1500);
    } else {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Erro ao cadastrar',
        message: 'Não foi possível cadastrar a atividade',
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: theme.secondary }]}>
          <Ionicons name="document-text" size={48} color="#ffffff" />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Nova Atividade</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {turma?.nome}
        </Text>

        <View style={styles.form}>
          <Input
            label="Descrição da atividade"
            placeholder="Ex: Exercício de fixação sobre arrays"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            style={styles.textArea}
            autoFocus
          />

          <Button
            title="Cadastrar atividade"
            onPress={handleCadastrar}
            loading={loading}
            variant="secondary"
          />

          <Button
            title="Cancelar"
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </View>

      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={() => setAlert({ ...alert, visible: false })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    width: '100%',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
});
