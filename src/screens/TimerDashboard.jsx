import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { styles } from './TimerDashboard.styles';

export default function TimerDashboard({ listaMaterias, aoAdicionarMateria, aoConcluirFoco, aoDeletarMateria }) {
  const [materiaSelecionada, setMateriaSelecionada] = useState(listaMaterias[0] || { nome: 'Nenhuma' });
  const [tempoInput, setTempoInput] = useState('25'); 
  const [segundosRestantes, setSegundosRestantes] = useState(25 * 60); 
  const [estaRodando, setEstaRodando] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [novaMateriaNome, setNovaMateriaNome] = useState('');

  // Sincroniza o relógio com o input digitado
  useEffect(() => {
    if (!estaRodando) {
      const minutos = parseInt(tempoInput) || 0;
      setSegundosRestantes(minutos * 60);
    }
  }, [tempoInput]);

  // Atualiza a seleção caso a lista mude externamente (ex: deleção)
  useEffect(() => {
    if (listaMaterias.length > 0) {
      const aindaExiste = listaMaterias.find(m => m.id === materiaSelecionada.id);
      if (!aindaExiste) setMateriaSelecionada(listaMaterias[0]);
    } else {
      setMateriaSelecionada({ nome: 'Nenhuma' });
    }
  }, [listaMaterias]);

  // Lógica de contagem
  useEffect(() => {
    let intervalo = null;
    if (estaRodando && segundosRestantes > 0) {
      intervalo = setInterval(() => setSegundosRestantes(t => t - 1), 1000);
    } else if (segundosRestantes === 0 && estaRodando) {
      estaRodando(false);
      aoConcluirFoco(materiaSelecionada.id, parseInt(tempoInput) || 25);
      Alert.alert("Excelente trabalho! 🎉", `Sessão concluída em ${materiaSelecionada.nome}.`);
    }
    return () => clearInterval(intervalo);
  }, [estaRodando, segundosRestantes]);

  const formatarTempo = () => {
    const min = Math.floor(segundosRestantes / 60);
    const seg = segundosRestantes % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  const trocarMateria = () => {
    if (estaRodando || listaMaterias.length === 0) return;
    const indexAtual = listaMaterias.findIndex(m => m.id === materiaSelecionada.id);
    const proximoIndex = (indexAtual + 1) % listaMaterias.length;
    setMateriaSelecionada(listaMaterias[proximoIndex]);
  };

  const salvarNovaMateria = () => {
    if (!novaMateriaNome.trim()) return;
    aoAdicionarMateria(novaMateriaNome);
    setNovaMateriaNome('');
    setModalVisivel(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Gerenciador de estudos ⏱️</Text>

      {/* Alternar Matéria */}
      <TouchableOpacity style={styles.card} onPress={trocarMateria}>
        <Text style={styles.cardLabel}>Toque para alternar disciplina</Text>
        <Text style={styles.cardValue}>📚 {materiaSelecionada.nome}</Text>
      </TouchableOpacity>

      {/* Definir minutos */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Quanto tempo deseja focar?</Text>
        <View style={styles.inputRow}>
          <TextInput 
            style={styles.input}
            keyboardType="number-pad"
            value={tempoInput}
            onChangeText={setTempoInput}
            editable={!estaRodando}
          />
          <Text style={styles.inputUnit}>minutos</Text>
        </View>
      </View>

      {/* Relógio */}
      <View style={styles.timerCircle}>
        <Text style={styles.timerText}>{formatarTempo()}</Text>
        <Text style={styles.activeMateriaTag}>{materiaSelecionada.nome}</Text>
      </View>

      {/* Grade de Botões */}
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.mainButton, estaRodando ? styles.btnPause : styles.btnStart]}
          onPress={() => setEstaRodando(!estaRodando)}
        >
          <Text style={styles.buttonText}>{estaRodando ? 'Pausar' : 'Iniciar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnReset} onPress={() => { setEstaRodando(false); setSegundosRestantes((parseInt(tempoInput) || 25) * 60); }}>
          <Text style={styles.buttonText}>🔄</Text>
        </TouchableOpacity>

        {/* Botão de Excluir Matéria Ativa */}
        <TouchableOpacity 
          style={styles.btnDelete} 
          onPress={() => {
            if (estaRodando) return;
            if (!materiaSelecionada.id) {
              Alert.alert("Erro", "Nenhuma matéria para excluir.");
              return;
            }
            aoDeletarMateria(materiaSelecionada.id);
          }}
        >
          <Text style={styles.buttonText}>🗑️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnReset, { backgroundColor: '#007AFF' }]} onPress={() => setModalVisivel(true)}>
          <Text style={styles.buttonText}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* Cadastro de Matéria */}
      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Disciplina</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="Nome da matéria..."
              value={novaMateriaNome}
              onChangeText={setNovaMateriaNome}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.mainButton, { backgroundColor: '#007AFF' }]} onPress={salvarNovaMateria}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.mainButton, { backgroundColor: '#FF3B30' }]} onPress={() => setModalVisivel(false)}>
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}