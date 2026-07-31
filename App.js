import React, { useState, useEffect, useCallback } from 'react';
import { View, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TimerDashboard from './src/screens/TimerDashboard';
import Analytics from './src/screens/Analytics';
import Schedule from './src/screens/Schedule';
import TabBar from './src/components/TabBar';
import { colors } from './src/theme/colors';
import {
  carregarDados,
  salvarMaterias,
  salvarHorarios,
  salvarSessoes,
} from './src/utils/storage';
import { agendarHorarios } from './src/utils/notifications';
import { styles } from './App.styles';

const MATERIAS_INICIAIS = [
  { id: '1', nome: 'Estrutura de Dados', minutos: 0 },
  { id: '2', nome: 'Cálculo Diferencial', minutos: 0 },
  { id: '3', nome: 'React Native', minutos: 0 },
];

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('timer');
  const [carregando, setCarregando] = useState(true);
  const [materias, setMaterias] = useState(MATERIAS_INICIAIS);
  const [horarios, setHorarios] = useState([]);
  const [sessoes, setSessoes] = useState([]);

  const reagendarNotificacoes = useCallback(async (hrs, mats) => {
    const resultado = await agendarHorarios(hrs, mats);
    if (resultado.negado && hrs.some((h) => h.notificacaoAtiva)) {
      Alert.alert(
        'Notificações desativadas',
        'Ative as permissões de notificação nas configurações do celular para receber lembretes de estudo.'
      );
    }
  }, []);

  useEffect(() => {
    (async () => {
      const dados = await carregarDados();
      if (dados.materias?.length) setMaterias(dados.materias);
      setHorarios(dados.horarios);
      setSessoes(dados.sessoes);
      setCarregando(false);
    })();
  }, []);

  useEffect(() => {
    if (carregando) return;
    salvarMaterias(materias);
  }, [materias, carregando]);

  useEffect(() => {
    if (carregando) return;
    salvarHorarios(horarios);
    reagendarNotificacoes(horarios, materias);
  }, [horarios, materias, carregando, reagendarNotificacoes]);

  useEffect(() => {
    if (carregando) return;
    salvarSessoes(sessoes);
  }, [sessoes, carregando]);

  const adicionarMateria = (nomeDaMateria) => {
    const proximoId =
      materias.length > 0
        ? (
            Math.max(...materias.map((m) => parseInt(m.id, 10))) + 1
          ).toString()
        : '1';
    setMaterias([
      ...materias,
      { id: proximoId, nome: nomeDaMateria, minutos: 0 },
    ]);
  };

  const deletarMateria = (idMateria) => {
    setMaterias(materias.filter((m) => m.id !== idMateria));
    setHorarios(horarios.filter((h) => h.materiaId !== idMateria));
  };

  const registrarTempoEstudado = (idMateria, minutos) => {
    setMaterias((prev) =>
      prev.map((m) =>
        m.id === idMateria ? { ...m, minutos: m.minutos + minutos } : m
      )
    );
    setSessoes((prev) => [
      {
        id: Date.now().toString(),
        materiaId: idMateria,
        minutos,
        data: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const adicionarHorario = (dados) => {
    const novo = {
      id: Date.now().toString(),
      ...dados,
    };
    setHorarios((prev) => [...prev, novo]);
  };

  const removerHorario = (id) => {
    setHorarios((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleNotificacaoHorario = (id, ativo) => {
    setHorarios((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, notificacaoAtiva: ativo } : h
      )
    );
  };

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        {abaAtiva === 'timer' && (
          <TimerDashboard
            listaMaterias={materias}
            aoAdicionarMateria={adicionarMateria}
            aoConcluirFoco={registrarTempoEstudado}
            aoDeletarMateria={deletarMateria}
          />
        )}
        {abaAtiva === 'schedule' && (
          <Schedule
            listaMaterias={materias}
            horarios={horarios}
            aoAdicionarHorario={adicionarHorario}
            aoRemoverHorario={removerHorario}
            aoToggleNotificacao={toggleNotificacaoHorario}
          />
        )}
        {abaAtiva === 'analytics' && (
          <Analytics listaMaterias={materias} sessoes={sessoes} />
        )}
      </View>
      <TabBar abaAtiva={abaAtiva} aoMudarAba={setAbaAtiva} />
    </SafeAreaView>
  );
}
