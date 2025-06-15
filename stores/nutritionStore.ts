import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  serving: string;
}

export interface MealEntry {
  id: string;
  foodId: string;
  quantity: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export interface WaterIntake {
  date: string;
  amount: number;
}

interface NutritionState {
  foods: Food[];
  mealEntries: MealEntry[];
  nutritionGoals: NutritionGoals;
  waterIntake: WaterIntake[];
  isLoading: boolean;
  loadFoods: () => Promise<void>;
  addMealEntry: (entry: Omit<MealEntry, 'id'>) => Promise<void>;
  loadMealEntries: () => Promise<void>;
  addWaterIntake: (amount: number) => Promise<void>;
  loadWaterIntake: () => Promise<void>;
  updateNutritionGoals: (goals: NutritionGoals) => Promise<void>;
}

const sampleFoods: Food[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    serving: '100g'
  },
  {
    id: '2',
    name: 'Brown Rice',
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    fiber: 1.8,
    serving: '100g'
  },
  {
    id: '3',
    name: 'Broccoli',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    serving: '100g'
  },
  {
    id: '4',
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    serving: '1 medium'
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    fiber: 0,
    serving: '100g'
  }
];

const defaultGoals: NutritionGoals = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 67,
  water: 2000,
};

export const useNutritionStore = create<NutritionState>((set, get) => ({
  foods: [],
  mealEntries: [],
  nutritionGoals: defaultGoals,
  waterIntake: [],
  isLoading: false,

  loadFoods: async () => {
  set({ isLoading: true });
  try {
    // Udajemy pobieranie z API
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ foods: sampleFoods, isLoading: false });
    await AsyncStorage.setItem('foods', JSON.stringify(sampleFoods));
  } catch (error) {
    console.error('Error loading foods:', error);
    // Spróbuj wczytać z cache
    const cached = await AsyncStorage.getItem('foods');
    if (cached) {
      const foods = JSON.parse(cached);
      set({ foods, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  }
},


  addMealEntry: async (entry: Omit<MealEntry, 'id'>) => {
    try {
      const newEntry: MealEntry = {
        ...entry,
        id: Date.now().toString(),
      };
      
      const entries = [...get().mealEntries, newEntry];
      await AsyncStorage.setItem('mealEntries', JSON.stringify(entries));
      set({ mealEntries: entries });
    } catch (error) {
      console.error('Error adding meal entry:', error);
    }
  },

  loadMealEntries: async () => {
    try {
      const entriesData = await AsyncStorage.getItem('mealEntries');
      if (entriesData) {
        const entries = JSON.parse(entriesData);
        set({ mealEntries: entries });
      }
    } catch (error) {
      console.error('Error loading meal entries:', error);
    }
  },

  addWaterIntake: async (amount: number) => {
    try {
      const today = new Date().toDateString();
      const waterIntake = get().waterIntake;
      const existingEntry = waterIntake.find(entry => entry.date === today);
      
      let updatedIntake;
      if (existingEntry) {
        updatedIntake = waterIntake.map(entry =>
          entry.date === today
            ? { ...entry, amount: entry.amount + amount }
            : entry
        );
      } else {
        updatedIntake = [...waterIntake, { date: today, amount }];
      }
      
      await AsyncStorage.setItem('waterIntake', JSON.stringify(updatedIntake));
      set({ waterIntake: updatedIntake });
    } catch (error) {
      console.error('Error adding water intake:', error);
    }
  },

  loadWaterIntake: async () => {
    try {
      const intakeData = await AsyncStorage.getItem('waterIntake');
      if (intakeData) {
        const intake = JSON.parse(intakeData);
        set({ waterIntake: intake });
      }
    } catch (error) {
      console.error('Error loading water intake:', error);
    }
  },

  updateNutritionGoals: async (goals: NutritionGoals) => {
    try {
      await AsyncStorage.setItem('nutritionGoals', JSON.stringify(goals));
      set({ nutritionGoals: goals });
    } catch (error) {
      console.error('Error updating nutrition goals:', error);
    }
  },
}));