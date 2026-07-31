export const colors = {
  bg: '#0F0F1A',
  bgCard: '#1A1A2E',
  bgElevated: '#252542',
  border: '#2D2D4A',
  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  accent: '#00D9A5',
  accentWarm: '#FF6B6B',
  warning: '#FFB347',
  text: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textMuted: '#6B6B80',
  success: '#34D399',
  danger: '#EF4444',
  gradientStart: '#1A1A2E',
  gradientEnd: '#16213E',
};

export const subjectColors = [
  '#6C63FF',
  '#00D9A5',
  '#FF6B6B',
  '#FFB347',
  '#45B7D1',
  '#A78BFA',
  '#F472B6',
  '#34D399',
];

export function getSubjectColor(index) {
  return subjectColors[index % subjectColors.length];
}
