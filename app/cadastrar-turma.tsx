import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTurmas } from '../hooks/useTurmas';
import { useTheme } from '../hooks/useTheme';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CustomAlert } from '../components/ui/CustomAlert';
import { spacing, fontSize, fontWeight, borderRadius } from '../constants/theme';

export default function CadastrarTurma() {
  const { cadastrarTurma } = useTurmas();
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [nome, setNome] = useState('');
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
    if (!nome.trim()) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Campo obrigatório',
        message: 'Por favor, informe o nome da turma',
      });
      return;
    }

    setLoading(true);
    const sucesso = await cadastrarTurma(nome.trim());
    setLoading(false);

    if (sucesso) {
      setAlert({
        visible: true,
        type: 'success',
        title: 'Turma cadastrada!',
        message: `A turma "${nome}" foi criada com sucesso`,
      });
      setTimeout(() => {
        router.back();
      }, 1500);
    } else {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Erro ao cadastrar',
        message: 'Não foi possível cadastrar a turma',
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
        <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
          <Ionicons name="add-circle" size={48} color="#ffffff" />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Nova Turma</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Informe o nome da turma e confirme para cadastrar
        </Text>

        <View style={styles.form}>
          <Input
            label="Nome da turma"
            placeholder="Ex: Desenvolvimento de Sistemas 1DES"
            value={nome}
            onChangeText={setNome}
            autoFocus
          />

          <Button
            title="Cadastrar turma"
            onPress={handleCadastrar}
            loading={loading}
            variant="primary"
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
});
