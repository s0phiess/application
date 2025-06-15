import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Users,
  Trophy,
  Heart,
  MessageCircle,
  Share,
  TrendingUp,
  Award,
  Target,
  Plus,
  X,
  Send,
  UserPlus,
  Search,
  Filter,
} from 'lucide-react-native';

export default function SocialScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [newComment, setNewComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'feed' | 'challenges' | 'leaderboard'>('feed');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const challenges = [
    {
      id: '1',
      title: '30-Day Push-up Challenge',
      description: 'Complete 1000 push-ups in 30 days',
      participants: 24,
      daysLeft: 15,
      progress: 65,
      joined: false,
    },
    {
      id: '2',
      title: 'Weekly Step Goal',
      description: 'Walk 70,000 steps this week',
      participants: 12,
      daysLeft: 3,
      progress: 80,
      joined: true,
    },
    {
      id: '3',
      title: 'Hydration Hero',
      description: 'Drink 2L of water daily for 7 days',
      participants: 18,
      daysLeft: 5,
      progress: 40,
      joined: false,
    },
  ];

  const friends = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      status: 'Just completed a 5K run! 🏃‍♀️ Feeling amazing and ready to tackle the day!',
      time: '2h ago',
      likes: 12,
      comments: 3,
      image: 'https://images.pexels.com/photos/2803158/pexels-photo-2803158.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      status: 'New PR on bench press: 225 lbs! 💪 All those months of training are paying off.',
      time: '4h ago',
      likes: 18,
      comments: 5,
      image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '3',
      name: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      status: 'Morning yoga session complete ✨ Starting the day with mindfulness and gratitude.',
      time: '6h ago',
      likes: 8,
      comments: 2,
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '4',
      name: 'Alex Rodriguez',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      status: 'Meal prep Sunday! 🥗 Preparing healthy meals for the week ahead.',
      time: '8h ago',
      likes: 15,
      comments: 4,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const leaderboard = [
    { name: 'Alex Thompson', points: 2450, rank: 1, avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'Jessica Lee', points: 2380, rank: 2, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'David Park', points: 2320, rank: 3, avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'You', points: 2280, rank: 4, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'Maria Garcia', points: 2150, rank: 5, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
  ];

  const tabs = [
    { key: 'feed', label: 'Feed', icon: Users },
    { key: 'challenges', label: 'Challenges', icon: Trophy },
    { key: 'leaderboard', label: 'Leaderboard', icon: Award },
  ];

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const openComments = (post: any) => {
    setSelectedPost(post);
    setCommentModalVisible(true);
  };

  const joinChallenge = (challengeId: string) => {
    Alert.alert(
      'Join Challenge',
      'Are you ready to take on this challenge?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join', 
          onPress: () => {
            Alert.alert('Success', 'You have joined the challenge! Good luck!');
          }
        },
      ]
    );
  };

  const createChallenge = () => {
    setChallengeModalVisible(true);
  };

  const renderFeed = () => (
    <View style={styles.feedContainer}>
      {friends.map((friend) => (
        <View
          key={friend.id}
          style={[styles.postCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.postHeader}>
            <Image
              source={{ uri: friend.avatar }}
              style={styles.avatar}
            />
            <View style={styles.postInfo}>
              <Text style={[styles.friendName, { color: colors.text }]}>
                {friend.name}
              </Text>
              <Text style={[styles.postTime, { color: colors.textSecondary }]}>
                {friend.time}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.postStatus, { color: colors.text }]}>
            {friend.status}
          </Text>
          
          {friend.image && (
            <Image
              source={{ uri: friend.image }}
              style={styles.postImage}
            />
          )}
          
          <View style={styles.postActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => toggleLike(friend.id)}
            >
              <Heart 
                size={18} 
                color={likedPosts.includes(friend.id) ? colors.error : colors.textSecondary}
                fill={likedPosts.includes(friend.id) ? colors.error : 'transparent'}
              />
              <Text
                style={[
                  styles.actionText, 
                  { 
                    color: likedPosts.includes(friend.id) ? colors.error : colors.textSecondary 
                  }
                ]}
              >
                {friend.likes + (likedPosts.includes(friend.id) ? 1 : 0)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => openComments(friend)}
            >
              <MessageCircle size={18} color={colors.textSecondary} />
              <Text
                style={[styles.actionText, { color: colors.textSecondary }]}
              >
                {friend.comments}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderChallenges = () => (
    <View style={styles.challengesContainer}>
      <TouchableOpacity
        style={[styles.createChallengeButton, { backgroundColor: colors.primary }]}
        onPress={createChallenge}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.createChallengeText}>Create Challenge</Text>
      </TouchableOpacity>
      
      {challenges.map((challenge) => (
        <View
          key={challenge.id}
          style={[styles.challengeCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.challengeHeader}>
            <View
              style={[
                styles.challengeIcon,
                { backgroundColor: colors.primary + '20' },
              ]}
            >
              <Trophy size={24} color={colors.primary} />
            </View>
            <View style={styles.challengeInfo}>
              <Text style={[styles.challengeTitle, { color: colors.text }]}>
                {challenge.title}
              </Text>
              <Text style={[styles.challengeDays, { color: colors.textSecondary }]}>
                {challenge.daysLeft} days left
              </Text>
            </View>
            {challenge.joined && (
              <View style={[styles.joinedBadge, { backgroundColor: colors.success + '20' }]}>
                <Text style={[styles.joinedText, { color: colors.success }]}>
                  Joined
                </Text>
              </View>
            )}
          </View>
          
          <Text
            style={[styles.challengeDescription, { color: colors.textSecondary }]}
          >
            {challenge.description}
          </Text>
          
          <View style={styles.challengeProgress}>
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
                    width: `${challenge.progress}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.text }]}>
              {challenge.progress}% complete
            </Text>
          </View>
          
          <View style={styles.challengeFooter}>
            <View style={styles.participantsInfo}>
              <Users size={16} color={colors.textSecondary} />
              <Text
                style={[styles.participantsText, { color: colors.textSecondary }]}
              >
                {challenge.participants} participants
              </Text>
            </View>
            {!challenge.joined && (
              <TouchableOpacity
                style={[styles.joinButton, { backgroundColor: colors.primary }]}
                onPress={() => joinChallenge(challenge.id)}
              >
                <Text style={styles.joinButtonText}>Join</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderLeaderboard = () => (
    <View style={styles.leaderboardContainer}>
      <View style={[styles.leaderboardCard, { backgroundColor: colors.surface }]}>
        {leaderboard.map((user, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.leaderboardItem,
              user.name === 'You' && { backgroundColor: colors.primary + '10' }
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.leaderboardLeft}>
              <View
                style={[
                  styles.rankBadge,
                  {
                    backgroundColor:
                      user.rank <= 3 ? colors.accent + '20' : colors.background,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.rankText,
                    {
                      color: user.rank <= 3 ? colors.accent : colors.textSecondary,
                      fontFamily: user.rank <= 3 ? 'Inter-Bold' : 'Inter-Regular',
                    },
                  ]}
                >
                  {user.rank}
                </Text>
              </View>
              <Image
                source={{ uri: user.avatar }}
                style={styles.leaderboardAvatar}
              />
              <Text
                style={[
                  styles.leaderboardName,
                  {
                    color: colors.text,
                    fontFamily: user.name === 'You' ? 'Inter-Bold' : 'Inter-SemiBold',
                  },
                ]}
              >
                {user.name}
              </Text>
            </View>
            <Text style={[styles.leaderboardPoints, { color: colors.primary }]}>
              {user.points} pts
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Social</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.surface }]}>
            <Search size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.surface }]}>
            <UserPlus size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              {
                backgroundColor:
                  selectedTab === tab.key ? colors.primary : colors.surface,
              },
            ]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <tab.icon 
              size={20} 
              color={selectedTab === tab.key ? '#FFFFFF' : colors.text} 
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: selectedTab === tab.key ? '#FFFFFF' : colors.text,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {selectedTab === 'feed' && renderFeed()}
        {selectedTab === 'challenges' && renderChallenges()}
        {selectedTab === 'leaderboard' && renderLeaderboard()}
      </ScrollView>

      {/* Comments Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentModalVisible}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Comments
              </Text>
              <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.commentsContainer}>
              <View style={styles.commentItem}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100' }}
                  style={styles.commentAvatar}
                />
                <View style={styles.commentContent}>
                  <Text style={[styles.commentAuthor, { color: colors.text }]}>
                    John Doe
                  </Text>
                  <Text style={[styles.commentText, { color: colors.textSecondary }]}>
                    Great job! Keep it up! 💪
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.commentInput}>
              <TextInput
                style={[
                  styles.commentTextInput,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Add a comment..."
                placeholderTextColor={colors.textSecondary}
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity
                style={[styles.sendButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setNewComment('');
                  Alert.alert('Success', 'Comment posted!');
                }}
              >
                <Send size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Challenge Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={challengeModalVisible}
        onRequestClose={() => setChallengeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Create Challenge
              </Text>
              <TouchableOpacity onPress={() => setChallengeModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.createChallengeForm}>
              <TextInput
                style={[
                  styles.challengeInput,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Challenge title"
                placeholderTextColor={colors.textSecondary}
              />
              <TextInput
                style={[
                  styles.challengeInput,
                  styles.challengeTextArea,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Challenge description"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => setChallengeModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setChallengeModalVisible(false);
                  Alert.alert('Success', 'Challenge created successfully!');
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
  },
  feedContainer: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 20,
  },
  postCard: {
    padding: 16,
    borderRadius: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  postStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    lineHeight: 20,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  challengesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  createChallengeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  createChallengeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  challengeCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  challengeDays: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  joinedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  joinedText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  challengeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    lineHeight: 20,
  },
  challengeProgress: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  participantsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  joinButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  leaderboardContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  leaderboardCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  leaderboardAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  leaderboardName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  leaderboardPoints: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
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
  commentsContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  commentTextInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createChallengeForm: {
    marginBottom: 20,
  },
  challengeInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  challengeTextArea: {
    height: 100,
    textAlignVertical: 'top',
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