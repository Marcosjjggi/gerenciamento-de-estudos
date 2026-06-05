// src/screens/Analytics.jsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from './Analytics.styles';

export default function Analytics({ listaMaterias }) {
  // Impede divisão por zero caso nenhuma matéria tenha tempo registrado
  const maxMinutos = Math.max(...listaMaterias.map(m => m.minutos), 1);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Seu Desempenho 📊</Text>
      <Text style={styles.subtitle}>Acompanhe o equilíbrio da sua dedicação semanal por disciplina:</Text>

      {/* Gráfico de Barras */}
      <View style={styles.chartCard}>
        {listaMaterias.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma matéria para gerar dados gráfico.</Text>
        ) : (
          listaMaterias.map((materia) => {
            const larguraPorcentagem = (materia.minutos / maxMinutos) * 100;
            return (
              <View key={materia.id} style={styles.materiaBarContainer}>
                <View style={styles.barLabels}>
                  <Text style={styles.materiaNome}>{materia.nome}</Text>
                  <Text style={styles.materiaTempo}>{(materia.minutos / 60).toFixed(1)}h ({materia.minutos} min)</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${Math.max(larguraPorcentagem, 4)}%` }]} />
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Lista de Histórico */}
      <Text style={styles.sectionTitle}>Histórico Recente 🗓️</Text>
      <View style={styles.historyCard}>
        {listaMaterias.filter(m => m.minutos > 0).length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma sessão de foco registrada hoje.</Text>
        ) : (
          listaMaterias.filter(m => m.minutos > 0).map((materia) => (
            <View key={materia.id} style={styles.historyItem}>
              <View>
                <Text style={styles.historyMateria}>Sessão Concluída: {materia.nome}</Text>
                <Text style={styles.historyDate}>Hoje • Método Pomodoro</Text>
              </View>
              <Text style={styles.historyTime}>+{materia.minutos} min</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}