// src/screens/Analytics.styles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F2F2F7', padding: 24, paddingTop: 60 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#8E8E93', marginBottom: 25, lineHeight: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 12, marginTop: 10 },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20
  },
  materiaBarContainer: { marginBottom: 20 },
  barLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  materiaNome: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  materiaTempo: { fontSize: 13, fontWeight: '500', color: '#8E8E93' },
  barTrack: { height: 14, backgroundColor: '#E5E5EA', borderRadius: 7, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#007AFF', borderRadius: 7 },
  
  historyCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 30 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  historyMateria: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  historyDate: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  historyTime: { fontSize: 16, fontWeight: 'bold', color: '#34C759' },
  emptyText: { color: '#8E8E93', textAlign: 'center', paddingVertical: 10, fontSize: 14 }
});