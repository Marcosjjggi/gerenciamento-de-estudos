// App.styles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F2F2F7' 
  },
  content: { 
    flex: 1 
  },
  tabBar: { 
    flexDirection: 'row', 
    height: 75, 
    backgroundColor: '#FFFFFF', 
    borderTopWidth: 1, 
    borderTopColor: '#E5E5EA', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    paddingBottom: 15
  },
  tabItem: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  tabIcon: { 
    fontSize: 24, 
    color: '#8E8E93' 
  },
  tabLabel: { 
    fontSize: 12, 
    color: '#8E8E93', 
    fontWeight: '500', 
    marginTop: 2 
  },
  tabActive: { 
    color: '#007AFF' 
  }
});