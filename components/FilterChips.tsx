
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { FilterPreset } from '@/types/pattern';

interface FilterChipsProps {
  activeFilter: FilterPreset;
  onFilterChange: (filter: FilterPreset) => void;
}

const filters: { id: FilterPreset; label: string; icon: string }[] = [
  { id: 'all', label: 'All Patterns', icon: '📚' },
  { id: 'learning', label: 'Learning', icon: '📖' },
  { id: 'mastered', label: 'Mastered', icon: '✅' },
  { id: 'mistakes-7d', label: 'Recent Mistakes', icon: '⚠️' },
  { id: 'confusable', label: 'Confusable Pairs', icon: '🔄' },
];

export const FilterChips: React.FC<FilterChipsProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.chip,
              isActive && styles.chipActive,
            ]}
            onPress={() => onFilterChange(filter.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.chipIcon}>{filter.icon}</Text>
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  chipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    fontFamily: 'Inter_600SemiBold',
  },
  chipTextActive: {
    color: colors.primary,
  },
});
