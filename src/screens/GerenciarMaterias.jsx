import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GerenciarMaterias() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Matérias</Text>
      {/* TODO: FRONT-END - Renderizar a lista de matérias aqui */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold' }
});