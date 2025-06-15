import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Activity, Target, Users } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleGetStarted = () => {
    router.push('/(auth)/signup');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: '#FFFFFF' }]}>
              FitTrack Pro
            </Text>
            <Text style={[styles.subtitle, { color: '#FFFFFF' }]}>
              Your Ultimate Fitness Companion
            </Text>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Activity size={32} color="#FFFFFF" />
              <Text style={[styles.featureText, { color: '#FFFFFF' }]}>
                Track Workouts
              </Text>
            </View>
            <View style={styles.feature}>
              <Target size={32} color="#FFFFFF" />
              <Text style={[styles.featureText, { color: '#FFFFFF' }]}>
                Set Goals
              </Text>
            </View>
            <View style={styles.feature}>
              <Users size={32} color="#FFFFFF" />
              <Text style={[styles.featureText, { color: '#FFFFFF' }]}>
                Connect & Compete
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: '#FFFFFF' }]}
              onPress={handleGetStarted}
            >
              <Text style={[styles.primaryButtonText, { color: colors.primary }]}>
                Get Started
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: '#FFFFFF' }]}
              onPress={handleLogin}
            >
              <Text style={[styles.secondaryButtonText, { color: '#FFFFFF' }]}>
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={[styles.guestButtonText, { color: '#FFFFFF' }]}>
                Continue as Guest
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    opacity: 0.9,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 60,
  },
  feature: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  guestButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
});