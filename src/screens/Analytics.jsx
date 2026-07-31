import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Analytics.styles';
import { colors, getSubjectColor } from '../theme/colors';

export default function Analytics({ listaMaterias, sessoes }) {
  const totalMinutos = listaMaterias.reduce((acc, m) => acc + m.minutos, 0);
  const maxMinutos = Math.max(...listaMaterias.map((m) => m.minutos), 1);
  const materiasComTempo = listaMaterias.filter((m) => m.minutos > 0);

  const sessoesRecentes = [...(sessoes ?? [])]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 10);

  const formatarData = (iso) => {
    const d = new Date(iso);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    if (d.toDateString() === hoje.toDateString()) return 'Hoje';
    if (d.toDateString() === ontem.toDateString()) return 'Ontem';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.bg]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Estatísticas</Text>
        <Text style={styles.headerSubtitle}>
          Acompanhe seu progresso por disciplina
        </Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <LinearGradient
            colors={[colors.primary + '30', colors.primary + '10']}
            style={styles.statGradient}
          >
            <Ionicons name="time" size={24} color={colors.primary} />
            <Text style={styles.statValue}>
              {(totalMinutos / 60).toFixed(1)}h
            </Text>
            <Text style={styles.statLabel}>Total estudado</Text>
          </LinearGradient>
        </View>
        <View style={styles.statCard}>
          <LinearGradient
            colors={[colors.accent + '30', colors.accent + '10']}
            style={styles.statGradient}
          >
            <Ionicons name="book" size={24} color={colors.accent} />
            <Text style={styles.statValue}>{materiasComTempo.length}</Text>
            <Text style={styles.statLabel}>Disciplinas ativas</Text>
          </LinearGradient>
        </View>
        <View style={styles.statCard}>
          <LinearGradient
            colors={[colors.warning + '30', colors.warning + '10']}
            style={styles.statGradient}
          >
            <Ionicons name="flame" size={24} color={colors.warning} />
            <Text style={styles.statValue}>{sessoesRecentes.length}</Text>
            <Text style={styles.statLabel}>Sessões</Text>
          </LinearGradient>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Tempo por disciplina</Text>
      <View style={styles.chartCard}>
        {listaMaterias.length === 0 ? (
          <Text style={styles.emptyText}>
            Adicione disciplinas e inicie sessões de foco.
          </Text>
        ) : (
          listaMaterias.map((materia, index) => {
            const largura = (materia.minutos / maxMinutos) * 100;
            const cor = getSubjectColor(index);
            return (
              <View key={materia.id} style={styles.barContainer}>
                <View style={styles.barLabels}>
                  <View style={styles.barLabelLeft}>
                    <View
                      style={[styles.barDot, { backgroundColor: cor }]}
                    />
                    <Text style={styles.materiaNome} numberOfLines={1}>
                      {materia.nome}
                    </Text>
                  </View>
                  <Text style={styles.materiaTempo}>
                    {materia.minutos} min
                  </Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${Math.max(largura, materia.minutos > 0 ? 4 : 0)}%`,
                        backgroundColor: cor,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })
        )}
      </View>

      <Text style={styles.sectionTitle}>Histórico recente</Text>
      <View style={styles.historyCard}>
        {sessoesRecentes.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Ionicons
              name="document-text-outline"
              size={32}
              color={colors.textMuted}
            />
            <Text style={styles.emptyText}>
              Nenhuma sessão registrada ainda.
            </Text>
          </View>
        ) : (
          sessoesRecentes.map((sessao) => {
            const materia = listaMaterias.find(
              (m) => m.id === sessao.materiaId
            );
            return (
              <View key={sessao.id} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyMateria}>
                    {materia?.nome ?? 'Disciplina'}
                  </Text>
                  <Text style={styles.historyDate}>
                    {formatarData(sessao.data)} • Pomodoro
                  </Text>
                </View>
                <View style={styles.historyBadge}>
                  <Text style={styles.historyTime}>+{sessao.minutos} min</Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}
