
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Dark neo-futuristic color scheme
export const colors = {
  background: '#0a0e1a',      // deep space blue
  card: '#1a1f2e',            // dark slate
  text: '#e8eaed',            // soft white
  textSecondary: '#8b92a8',   // muted blue-gray
  primary: '#00d4ff',         // electric cyan
  secondary: '#7c3aed',       // vibrant purple
  accent: '#f59e0b',          // warm amber
  highlight: '#10b981',       // success green
  error: '#ef4444',           // error red
  warning: '#f59e0b',         // warning amber
  
  // Additional UI colors
  cardBorder: 'rgba(0, 212, 255, 0.2)',
  glassBackground: 'rgba(26, 31, 46, 0.7)',
  glowPrimary: 'rgba(0, 212, 255, 0.3)',
  glowSecondary: 'rgba(124, 58, 237, 0.3)',
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.card,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10,
    fontFamily: 'Inter_700Bold',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 4px 12px rgba(0, 212, 255, 0.1)',
    elevation: 4,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
});
