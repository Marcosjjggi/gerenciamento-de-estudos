import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { styles } from './TabBar.styles';
import { colors } from '../theme/colors';

const ABAS = [
  { id: 'timer', label: 'Foco', icon: 'timer-outline', iconActive: 'timer' },
  {
    id: 'schedule',
    label: 'Horários',
    icon: 'calendar-outline',
    iconActive: 'calendar',
  },
  {
    id: 'analytics',
    label: 'Stats',
    icon: 'bar-chart-outline',
    iconActive: 'bar-chart',
  },
];

export default function TabBar({ abaAtiva, aoMudarAba }) {
  return (
    <View style={styles.tabBar}>
      {ABAS.map((aba) => {
        const ativo = abaAtiva === aba.id;
        return (
          <TouchableOpacity
            key={aba.id}
            style={styles.tabItem}
            onPress={() => {
              aoMudarAba(aba.id);
              Haptics.selectionAsync();
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, ativo && styles.iconWrapActive]}>
              <Ionicons
                name={ativo ? aba.iconActive : aba.icon}
                size={22}
                color={ativo ? colors.primary : colors.textMuted}
              />
            </View>
            <Text style={[styles.tabLabel, ativo && styles.tabLabelActive]}>
              {aba.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
