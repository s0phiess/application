import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
  Button,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'expo-router';
import { User, Settings, Target, Trophy, Heart, Moon, Sun, Bell, Lock, CircleHelp as HelpCircle, LogOut, ChevronRight, CreditCard as Edit, Camera, X, Save, ChartBar as BarChart3, Calendar, Award, MapPin } from 'lucide-react-native';

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [goalsModalVisible, setGoalsModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [weeklyGoal, setWeeklyGoal] = useState('5');
  const [dailyCalories, setDailyCalories] = useState('2000');
  const [dailyWater, setDailyWater] = useState('2000');

  // Location state


  


  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)');
          },
        },
      ]
    );
  };

  const handleSaveProfile = () => {
    setEditProfileModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleSaveGoals = () => {
    setGoalsModalVisible(false);
    Alert.alert('Success', 'Goals updated successfully!');
  };

  const stats = [
    {
      label: 'Workouts',
      value: '24',
      icon: Target,
      color: colors.primary,
      subtitle: 'This month',
    },
    {
      label: 'Achievements',
      value: '12',
      icon: Trophy,
      color: colors.secondary,
      subtitle: 'Unlocked',
    },
    {
      label: 'Streak',
      value: '5 days',
      icon: Heart,
      color: colors.accent,
      subtitle: 'Current',
    },
  ];

  const achievements = [
    {
      title: 'First Workout',
      description: 'Complete your first workout',
      icon: '🎯',
      earned: true,
      date: '2 weeks ago',
    },
    {
      title: '7-Day Streak',
      description: 'Work out for 7 consecutive days',
      icon: '🔥',
      earned: true,
      date: '1 week ago',
    },
    {
      title: 'Early Bird',
      description: 'Complete 5 morning workouts',
      icon: '🌅',
      earned: true,
      date: '3 days ago',
    },
    {
      title: 'Nutrition Master',
      description: 'Log meals for 30 days',
      icon: '🥗',
      earned: false,
      progress: 65,
    },
    {
      title: 'Social Butterfly',
      description: 'Add 10 friends',
      icon: '👥',
      earned: false,
      progress: 30,
    },
    {
      title: 'Hydration Hero',
      description: 'Drink 2L water for 14 days',
      icon: '💧',
      earned: false,
      progress: 85,
    },
  ];

  type SettingsItem = {
    icon: React.ComponentType<any>;
    label: string;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchToggle?: () => void;
    hasChevron?: boolean;
    onPress?: () => void;
    isDestructive?: boolean;
  };

  type SettingsGroup = {
    title: string;
    items: SettingsItem[];
  };

  const settingsGroups: SettingsGroup[] = [
    {
      title: 'Preferences',
      items: [
        {
          icon: isDark ? Moon : Sun,
          label: 'Dark Mode',
          hasSwitch: true,
          switchValue: isDark,
          onSwitchToggle: toggleTheme,
          isDestructive: false,
        },
        {
          icon: Bell,
          label: 'Notifications',
          hasChevron: true,
          onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon!'),
          isDestructive: false,
        },
        {
          icon: Target,
          label: 'Goals & Targets',
          hasChevron: true,
          onPress: () => setGoalsModalVisible(true),
          isDestructive: false,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: Lock,
          label: 'Privacy Settings',
          hasChevron: true,
          onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon!'),
          isDestructive: false,
        },
        {
          icon: Settings,
          label: 'Account Settings',
          hasChevron: true,
          onPress: () => setEditProfileModalVisible(true),
          isDestructive: false,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Support',
          hasChevron: true,
          onPress: () => Alert.alert('Help & Support', 'Contact us at support@fittrack.com'),
          isDestructive: false,
        },
        {
          icon: LogOut,
          label: 'Logout',
          isDestructive: true,
          onPress: handleLogout,
        },
      ],
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
     

      {/* Profile Header */}
      <View style={styles.header}>
        
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('Coming Soon', 'Photo upload will be available soon!')}
            >
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        

          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || 'User'}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email || 'user@example.com'}
            </Text>
            {user?.isGuest && (
              <TouchableOpacity 
                style={[styles.guestBadge, { backgroundColor: colors.accent + '20' }]}
                onPress={() => router.push('/(auth)/signup')}
              >
                <Text style={[styles.guestText, { color: colors.accent }]}>
                  Guest User - Tap to Sign Up
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.editProfileButton, { backgroundColor: colors.surface }]}
          onPress={() => setEditProfileModalVisible(true)}
        >
          <Edit size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Stats
          </Text>
          <TouchableOpacity onPress={() => setStatsModalVisible(true)}>
            <BarChart3 size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.statCard, { backgroundColor: colors.surface }]}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: stat.color + '20' },
                ]}
              >
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {stat.label}
              </Text>
              <Text style={[styles.statSubtitle, { color: colors.textSecondary }]}>
                {stat.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Achievements
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.achievementsContainer}
        >
          {achievements.map((achievement, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.achievementCard,
                {
                  backgroundColor: colors.surface,
                  opacity: achievement.earned ? 1 : 0.7,
                },
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={[styles.achievementTitle, { color: colors.text }]}>
                {achievement.title}
              </Text>
              <Text
                style={[styles.achievementDescription, { color: colors.textSecondary }]}
              >
                {achievement.description}
              </Text>
              {achievement.earned ? (
                <View
                  style={[
                    styles.earnedBadge,
                    { backgroundColor: colors.success + '20' },
                  ]}
                >
                  <Award size={12} color={colors.success} />
                  <Text style={[styles.earnedText, { color: colors.success }]}>
                    Earned
                  </Text>
                </View>
              ) : (
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { backgroundColor: colors.primary + '20' },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: colors.primary,
                          width: achievement.progress !== undefined ? `${achievement.progress}%` : undefined,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                    {achievement.progress}%
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Settings
        </Text>
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>
              {group.title}
            </Text>
            <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
              {group.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex < group.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <View
                      style={[
                        styles.settingIcon,
                        {
                          backgroundColor: item.isDestructive
                            ? colors.error + '20'
                            : colors.primary + '20',
                        },
                      ]}
                    >
                      <item.icon
                        size={20}
                        color={item.isDestructive ? colors.error : colors.primary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.settingLabel,
                        {
                          color: item.isDestructive ? colors.error : colors.text,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  <View style={styles.settingRight}>
                    {item.hasSwitch && (
                      <Switch
                        value={item.switchValue}
                        onValueChange={item.onSwitchToggle}
                        trackColor={{
                          false: colors.border,
                          true: colors.primary + '40',
                        }}
                        thumbColor={item.switchValue ? colors.primary : colors.textSecondary}
                      />
                    )}
                    {item.hasChevron && (
                      <ChevronRight size={20} color={colors.textSecondary} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editProfileModalVisible}
        onRequestClose={() => setEditProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={() => setEditProfileModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.editForm}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Full Name
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Email
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => setEditProfileModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveProfile}
              >
                <Save size={16} color="#FFFFFF" />
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Goals Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={goalsModalVisible}
        onRequestClose={() => setGoalsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Set Your Goals
              </Text>
              <TouchableOpacity onPress={() => setGoalsModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.editForm}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Weekly Workout Goal
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={weeklyGoal}
                  onChangeText={setWeeklyGoal}
                  placeholder="5"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Daily Calorie Goal
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={dailyCalories}
                  onChangeText={setDailyCalories}
                  placeholder="2000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Daily Water Goal (ml)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={dailyWater}
                  onChangeText={setDailyWater}
                  placeholder="2000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => setGoalsModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveGoals}
              >
                <Target size={16} color="#FFFFFF" />
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  Save Goals
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Stats Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={statsModalVisible}
        onRequestClose={() => setStatsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.detailedStatsModal, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Detailed Statistics
              </Text>
              <TouchableOpacity onPress={() => setStatsModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.detailedStatsContainer}>
                <View style={[styles.statDetailCard, { backgroundColor: colors.background }]}>
                  <Text style={[styles.statDetailTitle, { color: colors.text }]}>
                    This Month
                  </Text>
                  <View style={styles.statDetailRow}>
                    <Text style={[styles.statDetailLabel, { color: colors.textSecondary }]}>
                      Workouts Completed
                    </Text>
                    <Text style={[styles.statDetailValue, { color: colors.primary }]}>
                      24
                    </Text>
                  </View>
                  <View style={styles.statDetailRow}>
                    <Text style={[styles.statDetailLabel, { color: colors.textSecondary }]}>
                      Total Exercise Time
                    </Text>
                    <Text style={[styles.statDetailValue, { color: colors.primary }]}>
                      18h 30m
                    </Text>
                  </View>
                  <View style={styles.statDetailRow}>
                    <Text style={[styles.statDetailLabel, { color: colors.textSecondary }]}>
                      Calories Burned
                    </Text>
                    <Text style={[styles.statDetailValue, { color: colors.primary }]}>
                      12,450
                    </Text>
                  </View>
                </View>

                <View style={[styles.statDetailCard, { backgroundColor: colors.background }]}>
                  <Text style={[styles.statDetailTitle, { color: colors.text }]}>
                    All Time
                  </Text>
                  <View style={styles.statDetailRow}>
                    <Text style={[styles.statDetailLabel, { color: colors.textSecondary }]}>
                      Total Workouts
                    </Text>
                    <Text style={[styles.statDetailValue, { color: colors.secondary }]}>
                      156
                    </Text>
                  </View>
                  <View style={styles.statDetailRow}>
                    <Text style={[styles.statDetailLabel, { color: colors.textSecondary }]}>
                      Longest Streak
                    </Text>
                    <Text style={[styles.statDetailValue, { color: colors.secondary }]}>
                      21 days
                    </Text>
                  </View>
                  <View style={styles.statDetailRow}>
                    <Text style={[styles.statDetailLabel, { color: colors.textSecondary }]}>
                      Total Exercise Time
                    </Text>
                    <Text style={[styles.statDetailValue, { color: colors.secondary }]}>
                      124h 15m
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  guestBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  guestText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  editProfileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
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
  seeAllText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  achievementsContainer: {
    paddingBottom: 0,
  },
  achievementCard: {
    width: 160,
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  earnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  earnedText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  settingsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
  detailedStatsModal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%',
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
  editForm: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  detailedStatsContainer: {
    gap: 16,
  },
  statDetailCard: {
    padding: 16,
    borderRadius: 12,
  },
  statDetailTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  statDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statDetailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  statDetailValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});