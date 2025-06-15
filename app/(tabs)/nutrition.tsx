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
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useNutritionStore } from '@/stores/nutritionStore';
import { Plus, Search, Droplets, Target, TrendingUp, Apple, X, Minus, Calendar, ChartBar as BarChart3 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function NutritionScreen() {
  const { colors } = useTheme();
  const {
    foods,
    mealEntries,
    nutritionGoals,
    waterIntake,
    loadFoods,
    loadMealEntries,
    loadWaterIntake,
    addWaterIntake,
    addMealEntry,
  } = useNutritionStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [addFoodModalVisible, setAddFoodModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState('1');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

  useEffect(() => {
    loadFoods();
    loadMealEntries();
    loadWaterIntake();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadFoods(), loadMealEntries(), loadWaterIntake()]);
    setRefreshing(false);
  };

  const todaysMeals = mealEntries.filter(
    entry => new Date(entry.date).toDateString() === selectedDate
  );

  const todaysWater = waterIntake.find(entry => entry.date === selectedDate)?.amount || 0;

  const calculateTotalNutrition = () => {
    return todaysMeals.reduce(
      (total, meal) => {
        const food = foods.find(f => f.id === meal.foodId);
        if (food) {
          total.calories += food.calories * meal.quantity;
          total.protein += food.protein * meal.quantity;
          total.carbs += food.carbs * meal.quantity;
          total.fat += food.fat * meal.quantity;
        }
        return total;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const totalNutrition = calculateTotalNutrition();

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { key: 'lunch', label: 'Lunch', icon: '☀️' },
    { key: 'dinner', label: 'Dinner', icon: '🌙' },
    { key: 'snack', label: 'Snack', icon: '🍎' },
  ];

  const macros = [
    {
      name: 'Calories',
      current: Math.round(totalNutrition.calories),
      goal: nutritionGoals.calories,
      unit: 'kcal',
      color: colors.primary,
    },
    {
      name: 'Protein',
      current: Math.round(totalNutrition.protein),
      goal: nutritionGoals.protein,
      unit: 'g',
      color: colors.secondary,
    },
    {
      name: 'Carbs',
      current: Math.round(totalNutrition.carbs),
      goal: nutritionGoals.carbs,
      unit: 'g',
      color: colors.accent,
    },
    {
      name: 'Fat',
      current: Math.round(totalNutrition.fat),
      goal: nutritionGoals.fat,
      unit: 'g',
      color: colors.info,
    },
  ];

  const handleAddWater = (amount: number) => {
    addWaterIntake(amount);
  };

  const handleAddFood = () => {
    if (selectedFood && quantity) {
      addMealEntry({
        foodId: selectedFood.id,
        quantity: parseFloat(quantity),
        mealType: selectedMealType,
        date: new Date().toISOString(),
      });
      setAddFoodModalVisible(false);
      setSelectedFood(null);
      setQuantity('1');
      Alert.alert('Success', 'Food added to your meal!');
    }
  };

  const openAddFoodModal = (food: any) => {
    setSelectedFood(food);
    setAddFoodModalVisible(true);
  };

  const getMealEntries = (mealType: string) => {
    return todaysMeals.filter(entry => entry.mealType === mealType);
  };

  const getMealCalories = (mealType: string) => {
    return getMealEntries(mealType).reduce((total, entry) => {
      const food = foods.find(f => f.id === entry.foodId);
      return total + (food ? food.calories * entry.quantity : 0);
    }, 0);
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const waterButtons = [
    { amount: 250, label: '250ml', icon: '🥤' },
    { amount: 500, label: '500ml', icon: '🍶' },
    { amount: 750, label: '750ml', icon: '🍾' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Nutrition</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Track your daily nutrition and hydration
        </Text>
      </View>

      {/* Date Selector */}
      <View style={styles.section}>
        <TouchableOpacity style={[styles.dateSelector, { backgroundColor: colors.surface }]}>
          <Calendar size={20} color={colors.primary} />
          <Text style={[styles.dateText, { color: colors.text }]}>
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Daily Overview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Today's Overview
          </Text>
          <TouchableOpacity>
            <BarChart3 size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.macrosGrid}>
          {macros.map((macro, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.macroCard, { backgroundColor: colors.surface }]}
              activeOpacity={0.7}
            >
              <View style={styles.macroHeader}>
                <Text style={[styles.macroName, { color: colors.text }]}>
                  {macro.name}
                </Text>
                <View
                  style={[
                    styles.macroIcon,
                    { backgroundColor: macro.color + '20' },
                  ]}
                >
                  <Target size={16} color={macro.color} />
                </View>
              </View>
              <Text style={[styles.macroValue, { color: colors.text }]}>
                {macro.current}
                <Text style={[styles.macroUnit, { color: colors.textSecondary }]}>
                  {macro.unit}
                </Text>
              </Text>
              <View style={styles.macroProgress}>
                <View
                  style={[
                    styles.macroProgressBar,
                    { backgroundColor: macro.color + '20' },
                  ]}
                >
                  <View
                    style={[
                      styles.macroProgressFill,
                      {
                        backgroundColor: macro.color,
                        width: `${Math.min((macro.current / macro.goal) * 100, 100)}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.macroGoal, { color: colors.textSecondary }]}>
                  / {macro.goal}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Water Intake */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Water Intake
          </Text>
          <View style={styles.waterButtons}>
            {waterButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.waterButton, { backgroundColor: colors.info + '20' }]}
                onPress={() => handleAddWater(button.amount)}
              >
                <Text style={styles.waterButtonEmoji}>{button.icon}</Text>
                <Text style={[styles.waterButtonText, { color: colors.info }]}>
                  +{button.amount}ml
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.waterCard, { backgroundColor: colors.surface }]}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.info + '20', colors.info + '10']}
            style={styles.waterGradient}
          >
            <View style={styles.waterContent}>
              <Droplets size={32} color={colors.info} />
              <Text style={[styles.waterAmount, { color: colors.text }]}>
                {todaysWater}ml
              </Text>
              <Text style={[styles.waterGoal, { color: colors.textSecondary }]}>
                / {nutritionGoals.water}ml
              </Text>
              <View style={styles.waterProgressBar}>
                <View
                  style={[
                    styles.waterProgressFill,
                    {
                      backgroundColor: colors.info,
                      width: `${Math.min((todaysWater / nutritionGoals.water) * 100, 100)}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Meals */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Meals
        </Text>
        {mealTypes.map((meal) => (
          <View key={meal.key} style={[styles.mealCard, { backgroundColor: colors.surface }]}>
            <View style={styles.mealHeader}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealEmoji}>{meal.icon}</Text>
                <View>
                  <Text style={[styles.mealName, { color: colors.text }]}>
                    {meal.label}
                  </Text>
                  <Text style={[styles.mealCalories, { color: colors.textSecondary }]}>
                    {Math.round(getMealCalories(meal.key))} calories
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.addMealButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setSelectedMealType(meal.key as any);
                  setSearchQuery('');
                }}
              >
                <Plus size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {getMealEntries(meal.key).length > 0 && (
              <View style={styles.mealEntries}>
                {getMealEntries(meal.key).map((entry, index) => {
                  const food = foods.find(f => f.id === entry.foodId);
                  return (
                    <View key={index} style={styles.mealEntry}>
                      <Text style={[styles.mealEntryName, { color: colors.text }]}>
                        {food?.name} x{entry.quantity}
                      </Text>
                      <Text style={[styles.mealEntryCalories, { color: colors.textSecondary }]}>
                        {food ? Math.round(food.calories * entry.quantity) : 0} cal
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Food Search */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Add Food to {mealTypes.find(m => m.key === selectedMealType)?.label}
        </Text>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search foods..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Food List */}
      {searchQuery.length > 0 && (
        <View style={styles.section}>
          <View style={styles.foodsList}>
            {filteredFoods.slice(0, 5).map((food) => (
              <TouchableOpacity
                key={food.id}
                style={[styles.foodCard, { backgroundColor: colors.surface }]}
                onPress={() => openAddFoodModal(food)}
                activeOpacity={0.7}
              >
                <View style={styles.foodInfo}>
                  <Text style={[styles.foodName, { color: colors.text }]}>
                    {food.name}
                  </Text>
                  <Text style={[styles.foodServing, { color: colors.textSecondary }]}>
                    per {food.serving}
                  </Text>
                  <View style={styles.foodNutrition}>
                    <Text style={[styles.foodCalories, { color: colors.primary }]}>
                      {food.calories} cal
                    </Text>
                    <Text style={[styles.foodMacro, { color: colors.textSecondary }]}>
                      P: {food.protein}g
                    </Text>
                    <Text style={[styles.foodMacro, { color: colors.textSecondary }]}>
                      C: {food.carbs}g
                    </Text>
                    <Text style={[styles.foodMacro, { color: colors.textSecondary }]}>
                      F: {food.fat}g
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.addFoodButton, { backgroundColor: colors.primary }]}
                  onPress={() => openAddFoodModal(food)}
                >
                  <Plus size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Add Food Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addFoodModalVisible}
        onRequestClose={() => setAddFoodModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            {selectedFood && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    Add {selectedFood.name}
                  </Text>
                  <TouchableOpacity onPress={() => setAddFoodModalVisible(false)}>
                    <X size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                  Adding to {mealTypes.find(m => m.key === selectedMealType)?.label}
                </Text>

                <View style={styles.quantitySection}>
                  <Text style={[styles.quantityLabel, { color: colors.text }]}>
                    Quantity ({selectedFood.serving})
                  </Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={[styles.quantityButton, { backgroundColor: colors.border }]}
                      onPress={() => setQuantity(Math.max(0.5, parseFloat(quantity) - 0.5).toString())}
                    >
                      <Minus size={20} color={colors.text} />
                    </TouchableOpacity>
                    <TextInput
                      style={[
                        styles.quantityInput,
                        {
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                      value={quantity}
                      onChangeText={setQuantity}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={[styles.quantityButton, { backgroundColor: colors.border }]}
                      onPress={() => setQuantity((parseFloat(quantity) + 0.5).toString())}
                    >
                      <Plus size={20} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.nutritionPreview, { backgroundColor: colors.background }]}>
                  <Text style={[styles.previewTitle, { color: colors.text }]}>
                    Nutrition Preview
                  </Text>
                  <View style={styles.previewStats}>
                    <Text style={[styles.previewStat, { color: colors.primary }]}>
                      {Math.round(selectedFood.calories * parseFloat(quantity))} cal
                    </Text>
                    <Text style={[styles.previewStat, { color: colors.textSecondary }]}>
                      P: {Math.round(selectedFood.protein * parseFloat(quantity))}g
                    </Text>
                    <Text style={[styles.previewStat, { color: colors.textSecondary }]}>
                      C: {Math.round(selectedFood.carbs * parseFloat(quantity))}g
                    </Text>
                    <Text style={[styles.previewStat, { color: colors.textSecondary }]}>
                      F: {Math.round(selectedFood.fat * parseFloat(quantity))}g
                    </Text>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.border }]}
                    onPress={() => setAddFoodModalVisible(false)}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.text }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.primary }]}
                    onPress={handleAddFood}
                  >
                    <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                      Add Food
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  macroCard: {
    width: (width - 56) / 2,
    padding: 16,
    borderRadius: 16,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  macroName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  macroIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  macroUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  macroProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  macroProgressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  macroProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  macroGoal: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  waterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  waterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  waterButtonEmoji: {
    fontSize: 12,
  },
  waterButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  waterCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  waterGradient: {
    padding: 20,
  },
  waterContent: {
    alignItems: 'center',
  },
  waterAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
  },
  waterGoal: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  waterProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  waterProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  mealCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mealEmoji: {
    fontSize: 24,
  },
  mealName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  mealCalories: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  addMealButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealEntries: {
    marginTop: 12,
    gap: 8,
  },
  mealEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealEntryName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  mealEntryCalories: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  searchBar: {
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
  foodsList: {
    gap: 12,
  },
  foodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  foodServing: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  foodNutrition: {
    flexDirection: 'row',
    gap: 12,
  },
  foodCalories: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  foodMacro: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  addFoodButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  modalDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 20,
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  nutritionPreview: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  previewStats: {
    flexDirection: 'row',
    gap: 16,
  },
  previewStat: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
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
});