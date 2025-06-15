import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useWorkoutStore, WorkoutPlan } from '@/stores/workoutStore';
import {
  Search,
  Filter,
  Play,
  Clock,
  TrendingUp,
  X,
  Plus,
  Star,
  Users,
  Zap,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function WorkoutsScreen() {
  const { colors } = useTheme();
  const { workoutPlans, isLoading, loadWorkoutPlans, startWorkout } = useWorkoutStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  const [workoutDetailModalVisible, setWorkoutDetailModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadWorkoutPlans();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkoutPlans();
    setRefreshing(false);
  };

  const categories = ['All', 'Strength', 'Cardio', 'Flexibility', 'HIIT', 'Yoga'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredPlans = workoutPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || plan.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || plan.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return colors.success;
      case 'Intermediate':
        return colors.warning;
      case 'Advanced':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

 const handleStartWorkout = async (planId: string) => {
  try {
    await startWorkout(planId);
    Alert.alert('Workout Started!', 'Your workout session has begun. Good luck!');
  } catch (error) {
    Alert.alert('Error', 'Could not start workout. Please try again.');
  }
};

  const toggleFavorite = (planId: string) => {
    setFavorites(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const showWorkoutDetail = (plan: WorkoutPlan) => {
    setSelectedWorkout(plan);
    setWorkoutDetailModalVisible(true);
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSearchQuery('');
    setFilterModalVisible(false);
  };

  const applyFilters = () => {
    setFilterModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Workouts</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Choose your workout and start training
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search workouts..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.surface }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              {
                backgroundColor:
                  selectedCategory === category ? colors.primary : colors.surface,
              },
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color:
                    selectedCategory === category ? '#FFFFFF' : colors.text,
                },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.workoutsContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.workoutsList}>
          {filteredPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[styles.workoutCard, { backgroundColor: colors.surface }]}
              onPress={() => showWorkoutDetail(plan)}
              activeOpacity={0.7}
            >
              <View style={styles.workoutHeader}>
                <View style={styles.workoutInfo}>
                  <Text style={[styles.workoutName, { color: colors.text }]}>
                    {plan.name}
                  </Text>
                  <Text
                    style={[styles.workoutDescription, { color: colors.textSecondary }]}
                  >
                    {plan.description}
                  </Text>
                </View>
                <View style={styles.workoutActions}>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(plan.id)}
                    style={styles.favoriteButton}
                  >
                    <Star 
                      size={20} 
                      color={favorites.includes(plan.id) ? colors.warning : colors.textSecondary}
                      fill={favorites.includes(plan.id) ? colors.warning : 'transparent'}
                    />
                  </TouchableOpacity>
                  <View
                    style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(plan.difficulty) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        { color: getDifficultyColor(plan.difficulty) },
                      ]}
                    >
                      {plan.difficulty}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.workoutStats}>
                <View style={styles.statItem}>
                  <Clock size={16} color={colors.textSecondary} />
                  <Text style={[styles.statText, { color: colors.textSecondary }]}>
                    {plan.duration} min
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <TrendingUp size={16} color={colors.textSecondary} />
                  <Text style={[styles.statText, { color: colors.textSecondary }]}>
                    {plan.exercises.length} exercises
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Zap size={16} color={colors.textSecondary} />
                  <Text style={[styles.statText, { color: colors.textSecondary }]}>
                    {plan.category}
                  </Text>
                </View>
              </View>

              <View style={styles.exercisesList}>
                {plan.exercises.slice(0, 3).map((exercise, index) => (
                  <Text
                    key={index}
                    style={[styles.exerciseText, { color: colors.textSecondary }]}
                  >
                    • {exercise.name}
                  </Text>
                ))}
                {plan.exercises.length > 3 && (
                  <Text style={[styles.exerciseText, { color: colors.textSecondary }]}>
                    +{plan.exercises.length - 3} more exercises
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: colors.primary }]}
                onPress={() => handleStartWorkout(plan.id)}
              >
                <Play size={20} color="#FFFFFF" />
                <Text style={styles.startButtonText}>Start Workout</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {filteredPlans.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              No workouts found matching your criteria
            </Text>
            <TouchableOpacity
              style={[styles.clearFiltersButton, { backgroundColor: colors.primary }]}
              onPress={clearFilters}
            >
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Filter Workouts
              </Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>
                Category
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterOptions}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor:
                            selectedCategory === category ? colors.primary : colors.background,
                        },
                      ]}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          {
                            color:
                              selectedCategory === category ? '#FFFFFF' : colors.text,
                          },
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>
                Difficulty
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterOptions}>
                  {difficulties.map((difficulty) => (
                    <TouchableOpacity
                      key={difficulty}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor:
                            selectedDifficulty === difficulty ? colors.primary : colors.background,
                        },
                      ]}
                      onPress={() => setSelectedDifficulty(difficulty)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          {
                            color:
                              selectedDifficulty === difficulty ? '#FFFFFF' : colors.text,
                          },
                        ]}
                      >
                        {difficulty}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={clearFilters}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Clear All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={applyFilters}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Workout Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={workoutDetailModalVisible}
        onRequestClose={() => setWorkoutDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.detailModalContent, { backgroundColor: colors.surface }]}>
            {selectedWorkout && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {selectedWorkout.name}
                  </Text>
                  <TouchableOpacity onPress={() => setWorkoutDetailModalVisible(false)}>
                    <X size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={[styles.workoutDetailDescription, { color: colors.textSecondary }]}>
                    {selectedWorkout.description}
                  </Text>

                  <View style={styles.workoutDetailStats}>
                    <View style={styles.detailStatItem}>
                      <Clock size={20} color={colors.primary} />
                      <Text style={[styles.detailStatText, { color: colors.text }]}>
                        {selectedWorkout.duration} minutes
                      </Text>
                    </View>
                    <View style={styles.detailStatItem}>
                      <TrendingUp size={20} color={colors.secondary} />
                      <Text style={[styles.detailStatText, { color: colors.text }]}>
                        {selectedWorkout.exercises.length} exercises
                      </Text>
                    </View>
                    <View style={styles.detailStatItem}>
                      <Zap size={20} color={colors.accent} />
                      <Text style={[styles.detailStatText, { color: colors.text }]}>
                        {selectedWorkout.difficulty}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.exercisesTitle, { color: colors.text }]}>
                    Exercises
                  </Text>
                  
                  {selectedWorkout.exercises.map((exercise, index) => (
                    <View key={index} style={[styles.exerciseDetailCard, { backgroundColor: colors.background }]}>
                      <Text style={[styles.exerciseDetailName, { color: colors.text }]}>
                        {index + 1}. {exercise.name}
                      </Text>
                      <Text style={[styles.exerciseDetailMuscle, { color: colors.textSecondary }]}>
                        Target: {exercise.muscle} • Equipment: {exercise.equipment}
                      </Text>
                      <View style={styles.exerciseInstructions}>
                        {exercise.instructions.slice(0, 2).map((instruction, instrIndex) => (
                          <Text key={instrIndex} style={[styles.instructionText, { color: colors.textSecondary }]}>
                            • {instruction}
                          </Text>
                        ))}
                        {exercise.instructions.length > 2 && (
                          <Text style={[styles.instructionText, { color: colors.primary }]}>
                            +{exercise.instructions.length - 2} more steps
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={[styles.startDetailButton, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    setWorkoutDetailModalVisible(false);
                    handleStartWorkout(selectedWorkout.id);
                  }}
                >
                  <Play size={20} color="#FFFFFF" />
                  <Text style={styles.startDetailButtonText}>Start This Workout</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  workoutsContainer: {
    flex: 1,
  },
  workoutsList: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 20,
  },
  workoutCard: {
    padding: 20,
    borderRadius: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  workoutInfo: {
    flex: 1,
    marginRight: 12,
  },
  workoutName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  workoutDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  workoutActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  exercisesList: {
    marginBottom: 20,
  },
  exerciseText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFiltersButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  clearFiltersText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  detailModalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  workoutDetailDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 20,
  },
  workoutDetailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
  },
  detailStatItem: {
    alignItems: 'center',
    gap: 8,
  },
  detailStatText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  exercisesTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  exerciseDetailCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  exerciseDetailName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  exerciseDetailMuscle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  exerciseInstructions: {
    gap: 4,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  startDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  startDetailButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
});