import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  MATERIAS: '@estudos/materias',
  HORARIOS: '@estudos/horarios',
  SESSOES: '@estudos/sessoes',
};

export const DIAS_SEMANA = [
  { id: 1, label: 'Seg', nome: 'Segunda' },
  { id: 2, label: 'Ter', nome: 'Terça' },
  { id: 3, label: 'Qua', nome: 'Quarta' },
  { id: 4, label: 'Qui', nome: 'Quinta' },
  { id: 5, label: 'Sex', nome: 'Sexta' },
  { id: 6, label: 'Sáb', nome: 'Sábado' },
  { id: 0, label: 'Dom', nome: 'Domingo' },
];

export async function carregarDados() {
  try {
    const [materiasRaw, horariosRaw, sessoesRaw] = await Promise.all([
      AsyncStorage.getItem(KEYS.MATERIAS),
      AsyncStorage.getItem(KEYS.HORARIOS),
      AsyncStorage.getItem(KEYS.SESSOES),
    ]);

    return {
      materias: materiasRaw ? JSON.parse(materiasRaw) : null,
      horarios: horariosRaw ? JSON.parse(horariosRaw) : [],
      sessoes: sessoesRaw ? JSON.parse(sessoesRaw) : [],
    };
  } catch {
    return { materias: null, horarios: [], sessoes: [] };
  }
}

export async function salvarMaterias(materias) {
  await AsyncStorage.setItem(KEYS.MATERIAS, JSON.stringify(materias));
}

export async function salvarHorarios(horarios) {
  await AsyncStorage.setItem(KEYS.HORARIOS, JSON.stringify(horarios));
}

export async function salvarSessoes(sessoes) {
  await AsyncStorage.setItem(KEYS.SESSOES, JSON.stringify(sessoes));
}
