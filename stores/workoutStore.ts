import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscle: string;
  equipment: string;
  instructions: string[];
  image?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  exercises: Exercise[];
  category: string;
}

export interface WorkoutSession {
  id: string;
  planId: string;
  date: string;
  duration: number;
  completed: boolean;
  exercises: {
    exerciseId: string;
    sets: { reps: number; weight?: number; duration?: number }[];
  }[];
}

interface WorkoutState {
  workoutPlans: WorkoutPlan[];
  workoutHistory: WorkoutSession[];
  currentWorkout: WorkoutSession | null;
  isLoading: boolean;
  loadWorkoutPlans: () => Promise<void>;
  startWorkout: (planId: string) => void;
  completeWorkout: (session: WorkoutSession) => Promise<void>;
  loadWorkoutHistory: () => Promise<void>;
}

const WORKOUT_PLANS_KEY = 'cached_workout_plans';
const WORKOUT_HISTORY_KEY = 'workoutHistory';

const sampleWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Full Body Strength',
    description: 'Complete full body workout for strength building',
    difficulty: 'Intermediate',
    duration: 45,
    category: 'Strength',
    exercises: [
      {
        id: '1',
        name: 'Push-ups',
        category: 'Strength',
        muscle: 'Chest',
        equipment: 'Bodyweight',
        instructions: [
          'Start in a plank position with hands shoulder-width apart',
          'Lower your body until chest nearly touches the floor',
          'Push back up to starting position',
          'Keep your body in a straight line throughout'
        ]
      },
      {
        id: '2',
        name: 'Squats',
        category: 'Strength',
        muscle: 'Legs',
        equipment: 'Bodyweight',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower your body by bending knees and pushing hips back',
          'Keep chest up and knees behind toes',
          'Return to starting position'
        ]
      },
      {
        id: '3',
        name: 'Plank',
        category: 'Core',
        muscle: 'Core',
        equipment: 'Bodyweight',
        instructions: [
          'Start in a push-up position',
          'Lower down to forearms',
          'Keep body in straight line from head to heels',
          'Hold position while breathing normally'
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Cardio Blast',
    description: 'High-intensity cardio workout to burn calories',
    difficulty: 'Beginner',
    duration: 30,
    category: 'Cardio',
    exercises: [
      {
        id: '4',
        name: 'Jumping Jacks',
        category: 'Cardio',
        muscle: 'Full Body',
        equipment: 'Bodyweight',
        instructions: [
          'Start with feet together and arms at sides',
          'Jump feet apart while raising arms overhead',
          'Jump back to starting position',
          'Maintain steady rhythm'
        ]
      },
      {
        id: '5',
        name: 'High Knees',
        category: 'Cardio',
        muscle: 'Legs',
        equipment: 'Bodyweight',
        instructions: [
          'Stand with feet hip-width apart',
          'Run in place lifting knees to hip level',
          'Pump arms naturally',
          'Keep core engaged'
        ]
      }
    ]
  }
];

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workoutPlans: [],
  workoutHistory: [],
  currentWorkout: null,
  isLoading: false,

  loadWorkoutPlans: async () => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulacja API
      set({ workoutPlans: sampleWorkoutPlans, isLoading: false });
      await AsyncStorage.setItem(WORKOUT_PLANS_KEY, JSON.stringify(sampleWorkoutPlans));
    } catch (error) {
      console.warn('Error loading workout plans, using cache:', error);
      const cached = await AsyncStorage.getItem(WORKOUT_PLANS_KEY);
      if (cached) {
        set({ workoutPlans: JSON.parse(cached), isLoading: false });
      } else {
        set({ isLoading: false });
      }
    }
  },

  startWorkout: (planId: string) => {
    const plan = get().workoutPlans.find(p => p.id === planId);
    if (plan) {
      const session: WorkoutSession = {
        id: Date.now().toString(),
        planId,
        date: new Date().toISOString(),
        duration: 0,
        completed: false,
        exercises: plan.exercises.map(exercise => ({ exerciseId: exercise.id, sets: [] }))
      };
      set({ currentWorkout: session });
    }
  },

  completeWorkout: async (session: WorkoutSession) => {
    set({ isLoading: true });
    try {
      const completedSession = { ...session, completed: true };
      const history = [...get().workoutHistory, completedSession];
      await AsyncStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(history));
      set({ workoutHistory: history, currentWorkout: null, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error saving workoutHistory:', error);
    }
  },

  loadWorkoutHistory: async () => {
    set({ isLoading: true });
    try {
      const historyData = await AsyncStorage.getItem(WORKOUT_HISTORY_KEY);
      if (historyData) {
        set({ workoutHistory: JSON.parse(historyData), isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      console.error('Error loading workout history:', error);
    }
  }
}));
