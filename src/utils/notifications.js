import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function solicitarPermissaoNotificacao() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function cancelarTodasNotificacoes() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

function parseHora(horaStr) {
  const [h, m] = horaStr.split(':').map(Number);
  return { hour: h, minute: m };
}

export async function agendarHorarios(horarios, materias) {
  await cancelarTodasNotificacoes();

  const permitido = await solicitarPermissaoNotificacao();
  if (!permitido) return { agendados: 0, negado: true };

  let agendados = 0;

  for (const horario of horarios) {
    if (!horario.notificacaoAtiva) continue;

    const materia = materias.find((m) => m.id === horario.materiaId);
    const nomeMateria = materia?.nome ?? 'Estudo';
    const { hour, minute } = parseHora(horario.hora);
    const minutosAntes = horario.minutosAntesAlerta ?? 5;

    let alertHour = hour;
    let alertMinute = minute - minutosAntes;
    if (alertMinute < 0) {
      alertMinute += 60;
      alertHour = (alertHour - 1 + 24) % 24;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📚 Hora de estudar!',
          body: `${nomeMateria} em ${minutosAntes} min — ${horario.duracaoMinutos} min de foco`,
          sound: true,
          data: { horarioId: horario.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: horario.diaSemana === 0 ? 1 : horario.diaSemana + 1,
          hour: alertHour,
          minute: alertMinute,
        },
      });
      agendados += 1;
    } catch {
      // Ignora falha individual
    }
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('estudos', {
      name: 'Lembretes de estudo',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6C63FF',
    });
  }

  return { agendados, negado: false };
}
