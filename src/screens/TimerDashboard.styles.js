// src/screens/TimerDashboard.styles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', padding: 24, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 20, marginTop: 40 },
  
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 15,
    alignItems: 'center'
  },
  cardLabel: { fontSize: 13, fontWeight: '600', color: '#8E8E93', textTransform: 'uppercase', marginBottom: 6 },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },

  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  input: {
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    width: 70,
    textAlign: 'center'
  },
  inputUnit: { fontSize: 16, fontWeight: '500', color: '#3A3A3C' },

  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 8,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginVertical: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  timerText: { fontSize: 50, fontWeight: '300', color: '#1C1C1E', fontVariant: ['tabular-nums'] },
  activeMateriaTag: { fontSize: 14, fontWeight: '600', color: '#3A3A3C', marginTop: 5, textAlign: 'center' },

  buttonRow: { flexDirection: 'row', gap: 12, width: '100%', justifyContent: 'center' },
  mainButton: { flex: 2, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 5, elevation: 3 },
  btnStart: { backgroundColor: '#34C759' }, 
  btnPause: { backgroundColor: '#FF9500' }, 
  
  btnReset: { backgroundColor: '#AEAEB2', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  
  // Estilo do novo botão de excluir
  btnDelete: { backgroundColor: '#FF3B30', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 5, elevation: 3 },
  
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 15 },
  textInput: { backgroundColor: '#F2F2F7', borderRadius: 12, padding: 16, fontSize: 16, color: '#1C1C1E', marginBottom: 20, borderWidth: 1, borderColor: '#E5E5EA' }
});