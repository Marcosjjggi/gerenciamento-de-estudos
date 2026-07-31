import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { styles } from './Schedule.styles';
import { colors, getSubjectColor } from '../theme/colors';
import { DIAS_SEMANA } from '../utils/storage';

const PRESETS_DURACAO = [25, 45, 60, 90, 120];
const PRESETS_ALERTA = [0, 5, 10, 15];

export default function Schedule({
  listaMaterias,
  horarios,
  aoAdicionarHorario,
  aoRemoverHorario,
  aoToggleNotificacao,
}) {
  const [diaSelecionado, setDiaSelecionado] = useState(
    new Date().getDay()
  );
  const [modalVisivel, setModalVisivel] = useState(false);
  const [materiaId, setMateriaId] = useState(listaMaterias[0]?.id ?? '');
  const [hora, setHora] = useState('08:00');
  const [duracao, setDuracao] = useState(60);
  const [minutosAntes, setMinutosAntes] = useState(5);
  const [notificacaoAtiva, setNotificacaoAtiva] = useState(true);

  const horariosDoDia = horarios
    .filter((h) => h.diaSemana === diaSelecionado)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const totalMinutosDia = horariosDoDia.reduce(
    (acc, h) => acc + h.duracaoMinutos,
    0
  );

  const abrirModal = () => {
    if (listaMaterias.length === 0) {
      Alert.alert(
        'Sem disciplinas',
        'Adicione uma disciplina na aba Timer antes de criar horários.'
      );
      return;
    }
    setMateriaId(listaMaterias[0].id);
    setHora('08:00');
    setDuracao(60);
    setMinutosAntes(5);
    setNotificacaoAtiva(true);
    setModalVisivel(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const salvarHorario = () => {
    if (!materiaId) return;
    if (!/^\d{1,2}:\d{2}$/.test(hora)) {
      Alert.alert('Horário inválido', 'Use o formato HH:MM (ex: 14:30)');
      return;
    }

    aoAdicionarHorario({
      materiaId,
      diaSemana: diaSelecionado,
      hora,
      duracaoMinutos: duracao,
      notificacaoAtiva,
      minutosAntesAlerta: minutosAntes,
    });

    setModalVisivel(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const confirmarRemocao = (id) => {
    Alert.alert('Remover horário', 'Deseja excluir este bloco de estudo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => aoRemoverHorario(id),
      },
    ]);
  };

  const diaInfo = DIAS_SEMANA.find((d) => d.id === diaSelecionado);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.gradientStart, colors.bg]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Meus Horários</Text>
        <Text style={styles.headerSubtitle}>
          Organize sua semana e receba lembretes
        </Text>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daysScroll}
        contentContainerStyle={styles.daysRow}
      >
        {DIAS_SEMANA.map((dia) => {
          const ativo = dia.id === diaSelecionado;
          const qtd = horarios.filter((h) => h.diaSemana === dia.id).length;
          return (
            <TouchableOpacity
              key={dia.id}
              style={[styles.dayChip, ativo && styles.dayChipActive]}
              onPress={() => {
                setDiaSelecionado(dia.id);
                Haptics.selectionAsync();
              }}
            >
              <Text style={[styles.dayLabel, ativo && styles.dayLabelActive]}>
                {dia.label}
              </Text>
              {qtd > 0 && (
                <View style={[styles.dayBadge, ativo && styles.dayBadgeActive]}>
                  <Text
                    style={[
                      styles.dayBadgeText,
                      ativo && styles.dayBadgeTextActive,
                    ]}
                  >
                    {qtd}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text style={styles.summaryValue}>
            {Math.floor(totalMinutosDia / 60)}h {totalMinutosDia % 60}m
          </Text>
          <Text style={styles.summaryLabel}>{diaInfo?.nome ?? ''}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons
            name="notifications-outline"
            size={20}
            color={colors.accent}
          />
          <Text style={styles.summaryValue}>{horariosDoDia.length}</Text>
          <Text style={styles.summaryLabel}>blocos</Text>
        </View>
      </View>

      <ScrollView
        style={styles.lista}
        contentContainerStyle={styles.listaContent}
        showsVerticalScrollIndicator={false}
      >
        {horariosDoDia.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="calendar-outline"
              size={48}
              color={colors.textMuted}
            />
            <Text style={styles.emptyTitle}>Nenhum horário</Text>
            <Text style={styles.emptyText}>
              Toque no + para adicionar um bloco de estudo em{' '}
              {diaInfo?.nome?.toLowerCase()}.
            </Text>
          </View>
        ) : (
          horariosDoDia.map((horario, index) => {
            const materia = listaMaterias.find(
              (m) => m.id === horario.materiaId
            );
            const cor = getSubjectColor(
              listaMaterias.findIndex((m) => m.id === horario.materiaId)
            );

            return (
              <View key={horario.id} style={styles.horarioCard}>
                <View style={[styles.corBarra, { backgroundColor: cor }]} />
                <View style={styles.horarioContent}>
                  <View style={styles.horarioTop}>
                    <Text style={styles.horarioHora}>{horario.hora}</Text>
                    <Text style={styles.horarioDuracao}>
                      {horario.duracaoMinutos} min
                    </Text>
                  </View>
                  <Text style={styles.horarioMateria}>
                    {materia?.nome ?? 'Disciplina removida'}
                  </Text>
                  <View style={styles.horarioFooter}>
                    <View style={styles.notifRow}>
                      <Ionicons
                        name={
                          horario.notificacaoAtiva
                            ? 'notifications'
                            : 'notifications-off-outline'
                        }
                        size={16}
                        color={
                          horario.notificacaoAtiva
                            ? colors.accent
                            : colors.textMuted
                        }
                      />
                      <Text style={styles.notifText}>
                        {horario.notificacaoAtiva
                          ? `Alerta ${horario.minutosAntesAlerta} min antes`
                          : 'Sem alerta'}
                      </Text>
                    </View>
                    <View style={styles.acoesRow}>
                      <Switch
                        value={horario.notificacaoAtiva}
                        onValueChange={(v) =>
                          aoToggleNotificacao(horario.id, v)
                        }
                        trackColor={{
                          false: colors.border,
                          true: colors.primary + '80',
                        }}
                        thumbColor={
                          horario.notificacaoAtiva
                            ? colors.primary
                            : colors.textMuted
                        }
                      />
                      <TouchableOpacity
                        onPress={() => confirmarRemocao(horario.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color={colors.danger}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={abrirModal}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo bloco de estudo</Text>
            <Text style={styles.modalDia}>{diaInfo?.nome}</Text>

            <Text style={styles.fieldLabel}>Disciplina</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.materiasScroll}
            >
              {listaMaterias.map((m, i) => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.materiaChip,
                    materiaId === m.id && {
                      backgroundColor: getSubjectColor(i) + '30',
                      borderColor: getSubjectColor(i),
                    },
                  ]}
                  onPress={() => setMateriaId(m.id)}
                >
                  <Text
                    style={[
                      styles.materiaChipText,
                      materiaId === m.id && { color: getSubjectColor(i) },
                    ]}
                  >
                    {m.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.fieldLabel}>Horário de início</Text>
            <TextInput
              style={styles.textInput}
              value={hora}
              onChangeText={setHora}
              placeholder="08:00"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
            />

            <Text style={styles.fieldLabel}>Duração</Text>
            <View style={styles.presetRow}>
              {PRESETS_DURACAO.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.presetChip,
                    duracao === d && styles.presetChipActive,
                  ]}
                  onPress={() => setDuracao(d)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      duracao === d && styles.presetTextActive,
                    ]}
                  >
                    {d}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Alertar antes</Text>
            <View style={styles.presetRow}>
              {PRESETS_ALERTA.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.presetChip,
                    minutosAntes === m && styles.presetChipActive,
                  ]}
                  onPress={() => setMinutosAntes(m)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      minutosAntes === m && styles.presetTextActive,
                    ]}
                  >
                    {m === 0 ? 'Na hora' : `${m}m`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Ativar notificação</Text>
              <Switch
                value={notificacaoAtiva}
                onValueChange={setNotificacaoAtiva}
                trackColor={{
                  false: colors.border,
                  true: colors.primary + '80',
                }}
                thumbColor={
                  notificacaoAtiva ? colors.primary : colors.textMuted
                }
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSalvar} onPress={salvarHorario}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryLight]}
                  style={styles.btnSalvarGradient}
                >
                  <Text style={styles.btnSalvarText}>Salvar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
