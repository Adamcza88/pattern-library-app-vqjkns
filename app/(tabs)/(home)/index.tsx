
import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { candlestickPatterns } from '@/data/patterns';
import { mockMasteryData } from '@/data/mockMastery';
import { PatternCard } from '@/components/PatternCard';
import { MasteryPanel } from '@/components/MasteryPanel';
import { FilterChips } from '@/components/FilterChips';
import { FilterPreset } from '@/types/pattern';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterPreset>('all');
  const [focusedPatternIds, setFocusedPatternIds] = useState<string[]>([]);
  
  // Filter patterns based on active filter
  const filteredPatterns = React.useMemo(() => {
    if (focusedPatternIds.length > 0) {
      return candlestickPatterns.filter(p => focusedPatternIds.includes(p.id));
    }
    
    switch (activeFilter) {
      case 'learning':
        return candlestickPatterns.filter(p => {
          const mastery = mockMasteryData.find(m => m.patternId === p.id);
          return mastery?.status === 'learning';
        });
      
      case 'mastered':
        return candlestickPatterns.filter(p => {
          const mastery = mockMasteryData.find(m => m.patternId === p.id);
          return mastery?.status === 'mastered';
        });
      
      case 'mistakes-7d':
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return candlestickPatterns.filter(p => {
          const mastery = mockMasteryData.find(m => m.patternId === p.id);
          return mastery?.recentMistakes.some(d => d.getTime() > sevenDaysAgo);
        });
      
      case 'confusable':
        return candlestickPatterns.filter(p => p.confusions && p.confusions.length > 0);
      
      default:
        return candlestickPatterns;
    }
  }, [activeFilter, focusedPatternIds]);
  
  const handleProblematicPress = (patternIds: string[]) => {
    setFocusedPatternIds(patternIds);
    setActiveFilter('all');
  };
  
  const handlePatternPress = (patternId: string) => {
    router.push(`/pattern/${patternId}`);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Candlestick Mastery</Text>
        <Text style={styles.subtitle}>Learn patterns through spaced repetition</Text>
      </View>
      
      <FlatList
        data={filteredPatterns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PatternCard
            pattern={item}
            mastery={mockMasteryData.find(m => m.patternId === item.id)}
            onPress={() => handlePatternPress(item.id)}
          />
        )}
        ListHeaderComponent={
          <React.Fragment>
            <MasteryPanel
              masteryData={mockMasteryData}
              onProblematicPress={handleProblematicPress}
            />
            <FilterChips
              activeFilter={activeFilter}
              onFilterChange={(filter) => {
                setActiveFilter(filter);
                setFocusedPatternIds([]);
              }}
            />
          </React.Fragment>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'Inter_800ExtraBold',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});
