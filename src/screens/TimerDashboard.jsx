import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { styles } from './TimerDashboard.styles';
import { colors, getSubjectColor } from '../theme/colors';

const PRESETS = [15, 25, 45, 60, 90];

export default function TimerDashboard({
  listaMaterias,
  aoAdicionarMateria,
  aoConcluirFoco,
  aoDeletarMateria,
}) {
  const [materiaSelecionada, setMateriaSelecionada] = useState(
    listaMaterias[0] || { nome: 'Nenhuma' }
  );
  const [tempoInput, setTempoInput] = useState('25');
  const [segundosRestantes, setSegundosRestantes] = useState(25 * 60);
  const [estaRodando, setEstaRodando] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [novaMateriaNome, setNovaMateriaNome] = useState('');
  const concluidoRef = useRef(false);

  useEffect(() => {
    if (estaRodando) return;
    const minutos = parseInt(tempoInput, 10) || 0;
    setSegundosRestantes(minutos * 60);
  }, [tempoInput]);

  useEffect(() => {
    if (listaMaterias.length > 0) {
      const aindaExiste = listaMaterias.find(
        (m) => m.id === materiaSelecionada.id
      );
      if (!aindaExiste) setMateriaSelecionada(listaMaterias[0]);
    } else {
      setMateriaSelecionada({ nome: 'Nenhuma' });
    }
  }, [listaMaterias]);

  useEffect(() => {
    let intervalo = null;
    if (estaRodando && segundosRestantes > 0) {
      concluidoRef.current = false;
      intervalo = setInterval(
        () => setSegundosRestantes((t) => t - 1),
        1000
      );
    } else if (segundosRestantes === 0 && estaRodando && !concluidoRef.current) {
      concluidoRef.current = true;
      setEstaRodando(false);
      const minutos = parseInt(tempoInput, 10) || 25;
      if (materiaSelecionada.id) {
        aoConcluirFoco(materiaSelecionada.id, minutos);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Notifications.scheduleNotificationAsync({
        content: {
          title: '🎉 Sessão concluída!',
          body: `${minutos} min de foco em ${materiaSelecionada.nome}`,
          sound: true,
        },
        trigger: null,
      });
      Alert.alert(
        'Excelente trabalho!',
        `Sessão de ${minutos} min concluída em ${materiaSelecionada.nome}.`
      );
      setSegundosRestantes(minutos * 60);
    }
    return () => clearInterval(intervalo);
  }, [estaRodando, segundosRestantes]);

  const formatarTempo = () => {
    const min = Math.floor(segundosRestantes / 60);
    const seg = segundosRestantes % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  const progresso =
    parseInt(tempoInput, 10) > 0
      ? 1 - segundosRestantes / (parseInt(tempoInput, 10) * 60)
      : 0;

  const materiaIndex = listaMaterias.findIndex(
    (m) => m.id === materiaSelecionada.id
  );
  const corMateria = getSubjectColor(Math.max(materiaIndex, 0));

  const salvarNovaMateria = () => {
    if (!novaMateriaNome.trim()) return;
    aoAdicionarMateria(novaMateriaNome.trim());
    setNovaMateriaNome('');
    setModalVisivel(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const toggleTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEstaRodando(!estaRodando);
  };

  const resetar = () => {
    const totalSegundos = (parseInt(tempoInput, 10) || 25) * 60;
    const segundosDecorridos = totalSegundos - segundosRestantes;

    if (segundosDecorridos >= 30 && materiaSelecionada.id) {
      const minutosEstudados = Math.ceil(segundosDecorridos / 60);
      aoConcluirFoco(materiaSelecionada.id, minutosEstudados);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Tempo registrado',
        `${minutosEstudados} min adicionados em ${materiaSelecionada.nome}.`
      );
    }

    setEstaRodando(false);
    setSegundosRestantes(totalSegundos);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
        <Text style={styles.headerTitle}>Foco</Text>
        <Text style={styles.headerSubtitle}>Timer Pomodoro inteligente</Text>
      </LinearGradient>

      {/* Seletor de matérias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.materiasScroll}
        contentContainerStyle={styles.materiasRow}
      >
        {listaMaterias.map((m, i) => {
          const ativo = m.id === materiaSelecionada.id;
          const cor = getSubjectColor(i);
          return (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.materiaChip,
                ativo && { borderColor: cor, backgroundColor: cor + '25' },
              ]}
              onPress={() => {
                if (!estaRodando) {
                  setMateriaSelecionada(m);
                  Haptics.selectionAsync();
                }
              }}
              disabled={estaRodando}
            >
              <View style={[styles.materiaDot, { backgroundColor: cor }]} />
              <Text
                style={[
                  styles.materiaChipText,
                  ativo && { color: cor },
                ]}
              >
                {m.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={styles.addChip}
          onPress={() => setModalVisivel(true)}
        >
          <Ionicons name="add" size={20} color={colors.primary} />
        </TouchableOpacity>
      </ScrollView>

      {/* Timer circular */}
      <View style={styles.timerWrapper}>
        <View style={[styles.timerRingOuter, { borderColor: corMateria + '30' }]}>
          <View
            style={[
              styles.timerRingProgress,
              {
                borderColor: corMateria,
                borderTopColor: progresso > 0.25 ? corMateria : 'transparent',
                borderRightColor: progresso > 0.5 ? corMateria : 'transparent',
                borderBottomColor: progresso > 0.75 ? corMateria : 'transparent',
              },
            ]}
          />
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatarTempo()}</Text>
            <Text style={styles.timerLabel}>
              {estaRodando ? 'Em foco...' : 'Pronto'}
            </Text>
          </View>
        </View>
      </View>

      {/* Presets de tempo */}
      <View style={styles.presetRow}>
        {PRESETS.map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.presetChip,
              tempoInput === String(p) && styles.presetChipActive,
            ]}
            onPress={() => {
              if (!estaRodando) setTempoInput(String(p));
            }}
            disabled={estaRodando}
          >
            <Text
              style={[
                styles.presetText,
                tempoInput === String(p) && styles.presetTextActive,
              ]}
            >
              {p}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.customTimeRow}>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={tempoInput}
          onChangeText={setTempoInput}
          editable={!estaRodando}
          maxLength={3}
        />
        <Text style={styles.inputUnit}>minutos personalizados</Text>
      </View>

      {/* Controles */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btnSecondary} onPress={resetar}>
          <Ionicons name="refresh" size={22} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleTimer} style={styles.btnPrimaryWrap}>
          <LinearGradient
            colors={
              estaRodando
                ? [colors.warning, '#FF8C42']
                : [colors.accent, '#00B88D']
            }
            style={styles.btnPrimary}
          >
            <Ionicons
              name={estaRodando ? 'pause' : 'play'}
              size={28}
              color="#FFF"
            />
            <Text style={styles.btnPrimaryText}>
              {estaRodando ? 'Pausar' : 'Iniciar'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => {
            if (estaRodando || !materiaSelecionada.id) return;
            Alert.alert(
              'Excluir disciplina',
              `Remover "${materiaSelecionada.nome}"?`,
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Excluir',
                  style: 'destructive',
                  onPress: () => aoDeletarMateria(materiaSelecionada.id),
                },
              ]
            );
          }}
        >
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova disciplina</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Cálculo, React Native..."
              placeholderTextColor={colors.textMuted}
              value={novaMateriaNome}
              onChangeText={setNovaMateriaNome}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnSalvarWrap}
                onPress={salvarNovaMateria}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryLight]}
                  style={styles.btnSalvar}
                >
                  <Text style={styles.btnSalvarText}>Adicionar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
