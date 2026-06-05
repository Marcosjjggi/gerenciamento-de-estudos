import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import TimerDashboard from './src/screens/TimerDashboard';
import Analytics from './src/screens/Analytics';

import { styles } from './App.styles';

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('timer');

  // Estado global com dados simulados
  const [materias, setMaterias] = useState([
    { id: '1', nome: 'Estrutura de Dados', minutos: 45 },
    { id: '2', nome: 'Cálculo Diferencial', minutos: 90 },
    { id: '3', nome: 'React Native', minutos: 25 },
    { id: '4', nome: 'Inteligência Artificial', minutos: 25 },
    { id: '5', nome: 'Rede de Computadores', minutos: 25 },
    { id: '6', nome: 'Programação para Internet', minutos: 25 },
  ]);

  // Função para cadastrar nova matéria
  const adicionarMateria = (nomeDaMateria) => {
    // Descobre o ID mais alto atual para somar + 1, ou começa do 1 se a lista estiver vazia
    const proximoId = materias.length > 0 
      ? (Math.max(...materias.map(m => parseInt(m.id))) + 1).toString() 
      : '1';

    const nova = {
      id: proximoId, // Aqui sempre sempre somara o numero tipo 1 + 1 ai vai ser 2 depois +1 = 3 e por ai vai!
      nome: nomeDaMateria,
      minutos: 0
    };
    setMaterias([...materias, nova]);
  };

  // Função para excluir matéria (Requisito concluído!)
  const deletarMateria = (idMateria) => {
    setMaterias(materias.filter(m => m.id !== idMateria));
    Alert.alert("Sucesso 🎉", "Disciplina excluída com sucesso do aplicativo.");
  };

  // Função para computar tempo no gráfico
  const registrarTempoEstudado = (idMateria, minutos) => {
    setMaterias(materiasAtualizadas => 
      materiasAtualizadas.map(m => m.id === idMateria ? { ...m, minutos: m.minutos + minutos } : m)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {abaAtiva === 'timer' ? (
          <TimerDashboard 
            listaMaterias={materias} 
            aoAdicionarMateria={adicionarMateria}
            aoConcluirFoco={registrarTempoEstudado}
            aoDeletarMateria={deletarMateria}
          />
        ) : (
          <Analytics listaMaterias={materias} />
        )}
      </View>

      {/* Navegação Inferior */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setAbaAtiva('timer')}>
          <Text style={[styles.tabIcon, abaAtiva === 'timer' && styles.tabActive]}>⏱️</Text>
          <Text style={[styles.tabLabel, abaAtiva === 'timer' && styles.tabActive]}>Timer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setAbaAtiva('analytics')}>
          <Text style={[styles.tabIcon, abaAtiva === 'analytics' && styles.tabActive]}>📊</Text>
          <Text style={[styles.tabLabel, abaAtiva === 'analytics' && styles.tabActive]}>Estatísticas</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}