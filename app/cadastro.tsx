import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CustomAlert } from '../components/ui/CustomAlert';
import { spacing, fontSize, fontWeight, borderRadius } from '../constants/theme';

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Campos obrigatórios',
        message: 'Por favor, preencha todos os campos',
      });
      return;
    }

    if (senha !== confirmarSenha) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Senhas não coincidem',
        message: 'As senhas digitadas não são iguais',
      });
      return;
    }

    if (senha.length < 6) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Senha muito curta',
        message: 'A senha deve ter no mínimo 6 caracteres',
      });
      return;
    }

    setLoading(true);
    const sucesso = await cadastrar(nome, email, senha);
    setLoading(false);

    if (sucesso) {
      setAlert({
        visible: true,
        type: 'success',
        title: 'Cadastro realizado!',
        message: 'Sua conta foi criada com sucesso',
      });
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1500);
    } else {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Erro no cadastro',
        message: 'Este email já está cadastrado',
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + spacing.md },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: theme.secondary }]}>
              <Ionicons name="person-add" size={48} color="#ffffff" />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Criar Conta</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Preencha os dados para se cadastrar
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Nome completo"
              placeholder="Digite seu nome"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />

            <Input
              label="Email"
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.passwordContainer}>
              <Input
                label="Senha"
                placeholder="Digite sua senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <Input
              label="Confirmar senha"
              placeholder="Digite sua senha novamente"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />

            <Button
              title="Cadastrar"
              onPress={handleCadastro}
              loading={loading}
              variant="primary"
            />

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.back()}
            >
              <Text style={[styles.loginText, { color: theme.textSecondary }]}>
                Já tem uma conta?{' '}
                <Text style={[styles.loginLinkText, { color: theme.primary }]}>
                  Faça login
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
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
  },
  form: {
    width: '100%',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: spacing.md,
    top: 38,
    padding: spacing.sm,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    fontSize: fontSize.md,
  },
  loginLinkText: {
    fontWeight: fontWeight.semibold,
  },
});
