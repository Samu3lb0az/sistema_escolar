import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { TurmasProvider } from '../contexts/TurmasContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <TurmasProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="cadastro" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen 
            name="cadastrar-turma" 
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="atividades" 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="cadastrar-atividade" 
            options={{ presentation: 'modal' }}
          />
        </Stack>
      </TurmasProvider>
    </AuthProvider>
  );
}
