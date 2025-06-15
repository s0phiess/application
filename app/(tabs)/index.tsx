import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/stores/authStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useRouter } from 'expo-router';
import {
  Activity,
  Target,
  Flame,
  Clock,
  Trophy,
  ChevronRight,
  TrendingUp,
  Plus,
  Calendar,
  Settings,
  Bell,
  X,
  MapPin,
} from 'lucide-react-native';


const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { user, loadUser } = useAuthStore();
  const { workoutHistory, loadWorkoutHistory } = useWorkoutStore();
  const router = useRouter();
  
  const [refreshing, setRefreshing] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState('5');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month'>('week');
  const [location, setLocation] = useState<any>(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Ask for permission and get location
        const { status } = await (await import('expo-location')).requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationErrorMsg('Permission to access location was denied');
          return;
        }
        const loc = await (await import('expo-location')).getCurrentPositionAsync({});
        setLocation(loc);
      } catch (error) {
        setLocationErrorMsg('Failed to fetch location');
      }
    })();
  }, []);

  useEffect(() => {
    loadUser();
    loadWorkoutHistory();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadUser(), loadWorkoutHistory()]);
    setRefreshing(false);
  };

  const thisWeekWorkouts = workoutHistory.filter(workout => {
    const workoutDate = new Date(workout.date);
    const today = new Date();
    const weekAgo = new Date(today.setDate(today.getDate() - 7));
    return workoutDate >= weekAgo;
  }).length;

  const thisMonthWorkouts = workoutHistory.filter(workout => {
    const workoutDate = new Date(workout.date);
    const today = new Date();
    const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
    return workoutDate >= monthAgo;
  }).length;

  const totalWorkouts = workoutHistory.length;
  const completedWorkouts = workoutHistory.filter(w => w.completed).length;
  const averageWorkoutTime = workoutHistory.length > 0 
    ? Math.round(workoutHistory.reduce((sum, w) => sum + w.duration, 0) / workoutHistory.length)
    : 0;

  const currentStreak = calculateStreak();

  function calculateStreak() {
    if (workoutHistory.length === 0) return 0;
    
    const sortedWorkouts = workoutHistory
      .filter(w => w.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.date);
      const daysDiff = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= streak + 1) {
        streak++;
        currentDate = workoutDate;
      } else {
        break;
      }
    }
    
    return streak;
  }

  const stats = [
    {
      title: selectedTimeframe === 'week' ? 'This Week' : 'This Month',
      value: selectedTimeframe === 'week' ? thisWeekWorkouts.toString() : thisMonthWorkouts.toString(),
      subtitle: 'Workouts',
      icon: Activity,
      color: colors.primary,
      onPress: () => setSelectedTimeframe(selectedTimeframe === 'week' ? 'month' : 'week'),
    },
    {
      title: 'Total',
      value: totalWorkouts.toString(),
      subtitle: 'Sessions',
      icon: Target,
      color: colors.secondary,
      onPress: () => router.push('/(tabs)/workouts'),
    },
    {
      title: 'Streak',
      value: currentStreak.toString(),
      subtitle: 'Days',
      icon: Flame,
      color: colors.accent,
      onPress: () => {},
    },
    {
      title: 'Avg Time',
      value: averageWorkoutTime.toString(),
      subtitle: 'Minutes',
      icon: Clock,
      color: colors.info,
      onPress: () => {},
    },
  ];

  const quickActions = [
    {
      title: 'Start Workout',
      subtitle: 'Begin your training session',
      icon: Activity,
      color: colors.primary,
      onPress: () => router.push('/(tabs)/workouts'),
    },
    {
      title: 'Log Nutrition',
      subtitle: 'Track your meals',
      icon: Target,
      color: colors.secondary,
      onPress: () => router.push('/(tabs)/nutrition'),
    },
    {
      title: 'View Progress',
      subtitle: 'Check your achievements',
      icon: TrendingUp,
      color: colors.accent,
      onPress: () => router.push('/(tabs)/profile'),
    },
    {
      title: 'Join Challenge',
      subtitle: 'Compete with friends',
      icon: Trophy,
      color: colors.info,
      onPress: () => router.push('/(tabs)/social'),
    },
  ];

  const handleSaveGoal = () => {
    const goal = parseInt(weeklyGoal);
    if (goal > 0 && goal <= 14) {
      setGoalModalVisible(false);
      Alert.alert('Success', `Weekly goal updated to ${goal} workouts!`);
    } else {
      Alert.alert('Error', 'Please enter a valid goal between 1 and 14 workouts.');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},
          </Text>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.name || 'User'}
          </Text>
        </View>
        <View style={styles.headerActions}>
 
 <TouchableOpacity 
  style={[styles.headerButton, { backgroundColor: colors.surface }]}
  onPress={() => {
    if (location) {
      Alert.alert(
        'Your Location',
        `Latitude: ${location.coords.latitude}\nLongitude: ${location.coords.longitude}`
      );
    } else {
      Alert.alert('Location not available');
    }
  }}
>
  <MapPin size={20} color={colors.text} />
</TouchableOpacity>


  {/* Dzwonek */}
  <TouchableOpacity 
    style={[styles.headerButton, { backgroundColor: colors.surface }]}
    onPress={() => {}}
  >
    <Bell size={20} color={colors.text} />
  </TouchableOpacity>

  {/* Ustawienia */}
  <TouchableOpacity 
    style={[styles.headerButton, { backgroundColor: colors.surface }]}
    onPress={() => router.push('/(tabs)/profile')}
  >
    <Settings size={20} color={colors.text} />
  </TouchableOpacity>
</View>
          
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.statCard, { backgroundColor: colors.surface }]}
            onPress={stat.onPress}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[stat.color + '20', stat.color + '10']}
              style={styles.statIconContainer}
            >
              <stat.icon size={24} color={stat.color} />
            </LinearGradient>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statTitle, { color: colors.textSecondary }]}>
              {stat.title}
            </Text>
            <Text style={[styles.statSubtitle, { color: colors.textSecondary }]}>
              {stat.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.actionContent}>
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: action.color + '20' },
                  ]}
                >
                  <action.icon size={24} color={action.color} />
                </View>
                <View style={styles.actionText}>
                  <Text style={[styles.actionTitle, { color: colors.text }]}>
                    {action.title}
                  </Text>
                  <Text
                    style={[styles.actionSubtitle, { color: colors.textSecondary }]}
                  >
                    {action.subtitle}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Weekly Progress
          </Text>
          <TouchableOpacity onPress={() => setGoalModalVisible(true)}>
            <Text style={[styles.editGoalText, { color: colors.primary }]}>
              Edit Goal
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.progressCard, { backgroundColor: colors.surface }]}
          onPress={() => setGoalModalVisible(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.progressGradient}
          >
            <View style={styles.progressContent}>
              <Text style={styles.progressTitle}>This Week's Goal</Text>
              <Text style={styles.progressValue}>
                {thisWeekWorkouts}/{weeklyGoal} Workouts
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min((thisWeekWorkouts / parseInt(weeklyGoal)) * 100, 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressSubtitle}>
                {Math.max(0, parseInt(weeklyGoal) - thisWeekWorkouts)} more to reach your goal!
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Activity
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/workouts')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.activityList}>
          {workoutHistory.slice(0, 3).map((workout, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.activityItem, { backgroundColor: colors.surface }]}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <View style={styles.activityContent}>
                <View
                  style={[
                    styles.activityIcon,
                    { backgroundColor: colors.primary + '20' },
                  ]}
                >
                  <Activity size={20} color={colors.primary} />
                </View>
                <View style={styles.activityDetails}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>
                    Workout Completed
                  </Text>
                  <Text
                    style={[styles.activityTime, { color: colors.textSecondary }]}
                  >
                    {new Date(workout.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text style={[styles.activityDuration, { color: colors.textSecondary }]}>
                {workout.duration}min
              </Text>
            </TouchableOpacity>
          ))}
          
          {workoutHistory.length === 0 && (
            <View style={styles.emptyActivity}>
              <Text style={[styles.emptyActivityText, { color: colors.textSecondary }]}>
                No recent activity. Start your first workout!
              </Text>
              <TouchableOpacity
                style={[styles.startFirstWorkoutButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/(tabs)/workouts')}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.startFirstWorkoutText}>Start Workout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Goal Setting Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={goalModalVisible}
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Set Weekly Goal
              </Text>
              <TouchableOpacity onPress={() => setGoalModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
              How many workouts do you want to complete this week?
            </Text>
            
            <TextInput
              style={[
                styles.goalInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={weeklyGoal}
              onChangeText={setWeeklyGoal}
              keyboardType="numeric"
              placeholder="Enter goal (1-14)"
              placeholderTextColor={colors.textSecondary}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => setGoalModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveGoal}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  Save Goal
                </Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    width: (width - 56) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  statSubtitle: {
    fontSize: 12,
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
  editGoalText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  seeAllText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  quickActions: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  progressCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  progressGradient: {
    padding: 20,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  progressValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  activityDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyActivityText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    textAlign: 'center',
  },
  startFirstWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  startFirstWorkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
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
    lineHeight: 24,
  },
  goalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
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