// app/editar-atividade.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useTurmas } from '../hooks/useTurmas';

export default function EditarAtividade() {
  const { atividadeId } = useLocalSearchParams();
  const { atividades, editarAtividade } = useTurmas();
  const router = useRouter();

  const atividade = atividades.find(a => String(a.id) === String(atividadeId));
  const [descricao, setDescricao] = useState(atividade?.descricao ?? '');

  useEffect(() => {
    if (!atividade && atividadeId) {
      // opcional: buscar atividade do servidor se não estiver em state local
    }
  }, [atividade, atividadeId]);

  async function salvar() {
    if (!atividadeId) return;
    const sucesso = await editarAtividade(String(atividadeId), descricao);
    if (sucesso) router.back();
    else {
      // mostrar erro (CustomAlert ou Toast)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Atividade</Text>
      <Input value={descricao} onChangeText={setDescricao} multiline numberOfLines={6} />
      <Button title="Salvar" onPress={salvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, marginBottom: 12 },
});
