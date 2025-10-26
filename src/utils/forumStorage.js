// Forum Storage Utilities

const FORUM_POSTS_KEY = 'moodspace_forum_posts';
const FORUM_LIKES_KEY_PREFIX = 'moodspace_forum_likes_';

// Generate sample forum posts
const generateSamplePosts = () => {
  const samples = [
    {
      id: 'post-1',
      author: 'Anonymous User',
      content: "Struggling with finals anxiety. Anyone else feeling overwhelmed? Would love to hear your coping strategies.",
      likes: 45,
      likedBy: [],
      replies: [
        {
          id: 'reply-1-1',
          author: 'Anonymous User',
          content: "I totally relate! What helps me is breaking study sessions into 25-minute chunks with 5-minute breaks. Also, remember to breathe!",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'reply-1-2',
          author: 'Anonymous User',
          content: "You're not alone. I find that talking to campus counseling really helped me. They're free and confidential!",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      ],
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      triggerWarning: false
    },
    {
      id: 'post-2',
      author: 'Anonymous User',
      content: "Just wanted to say thank you to this community. You all helped me through a really rough week. Sometimes just knowing others understand makes all the difference. 💙",
      likes: 89,
      likedBy: [],
      replies: [
        {
          id: 'reply-2-1',
          author: 'Anonymous User',
          content: "We're here for you! So glad you're feeling better.",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
      ],
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      triggerWarning: false
    },
    {
      id: 'post-3',
      author: 'Anonymous User',
      content: "Does anyone else find it hard to ask for help? I know I should reach out but something always stops me.",
      likes: 32,
      likedBy: [],
      replies: [
        {
          id: 'reply-3-1',
          author: 'Anonymous User',
          content: "Yes! I struggle with this too. What helped me was starting small - texting a friend instead of calling, or emailing a professor instead of going to office hours at first.",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'reply-3-2',
          author: 'Anonymous User',
          content: "Remember: asking for help is a sign of strength, not weakness. Everyone needs support sometimes.",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ],
      timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
      triggerWarning: false
    },
    {
      id: 'post-4',
      author: 'Anonymous User',
      content: "Celebrating small wins today! Finally got out of bed before noon and took a shower. It might not seem like much, but it feels like a victory for me.",
      likes: 67,
      likedBy: [],
      replies: [
        {
          id: 'reply-4-1',
          author: 'Anonymous User',
          content: "Those ARE big wins! Be proud of yourself! 🎉",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'reply-4-2',
          author: 'Anonymous User',
          content: "Every step forward counts. You're doing amazing!",
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        }
      ],
      timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      triggerWarning: false
    }
  ];
  return samples;
};

export const loadForumPosts = () => {
  try {
    const stored = localStorage.getItem(FORUM_POSTS_KEY);
    
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Return sample posts for first-time users
    const samples = generateSamplePosts();
    localStorage.setItem(FORUM_POSTS_KEY, JSON.stringify(samples));
    return samples;
  } catch (error) {
    console.error('Error loading forum posts:', error);
    return [];
  }
};

export const createForumPost = (content, userId = 'default', triggerWarning = false) => {
  try {
    const posts = loadForumPosts();
    const newPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: 'Anonymous User', // Always anonymous
      content: content,
      likes: 0,
      likedBy: [],
      replies: [],
      timestamp: new Date().toISOString(),
      triggerWarning: triggerWarning,
      // Store userId privately for moderation (not exposed in frontend)
      _moderationUserId: userId
    };
    
    const updated = [newPost, ...posts];
    localStorage.setItem(FORUM_POSTS_KEY, JSON.stringify(updated));
    
    // Return anonymized version (without moderation fields)
    const { _moderationUserId, ...anonymizedPost } = newPost;
    return anonymizedPost;
  } catch (error) {
    console.error('Error creating forum post:', error);
    throw error;
  }
};

export const likeForumPost = (postId, userId = 'default') => {
  try {
    const posts = loadForumPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    
    const post = posts[postIndex];
    const likedBy = post.likedBy || [];
    const userLiked = likedBy.includes(userId);
    
    if (userLiked) {
      // Unlike
      post.likes = Math.max(0, post.likes - 1);
      post.likedBy = likedBy.filter(id => id !== userId);
    } else {
      // Like
      post.likes += 1;
      post.likedBy = [...likedBy, userId];
    }
    
    posts[postIndex] = post;
    localStorage.setItem(FORUM_POSTS_KEY, JSON.stringify(posts));
    
    return {
      liked: !userLiked,
      likes: post.likes
    };
  } catch (error) {
    console.error('Error liking forum post:', error);
    throw error;
  }
};

export const replyToForumPost = (postId, content, userId = 'default') => {
  try {
    const posts = loadForumPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    
    const newReply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: 'Anonymous User', // Always anonymous
      content: content,
      timestamp: new Date().toISOString(),
      // Store userId privately for moderation
      _moderationUserId: userId
    };
    
    posts[postIndex].replies = [...posts[postIndex].replies, newReply];
    localStorage.setItem(FORUM_POSTS_KEY, JSON.stringify(posts));
    
    // Return anonymized version
    const { _moderationUserId, ...anonymizedReply } = newReply;
    return anonymizedReply;
  } catch (error) {
    console.error('Error replying to forum post:', error);
    throw error;
  }
};

export const reportForumPost = (postId, reason, userId = 'default') => {
  // In a real app, this would send to moderation queue
  console.log('Post reported:', { postId, reason, userId });
  return true;
};

export const getUserLikedPosts = (userId = 'default') => {
  try {
    const posts = loadForumPosts();
    return posts
      .filter(post => (post.likedBy || []).includes(userId))
      .map(post => post.id);
  } catch (error) {
    console.error('Error getting user liked posts:', error);
    return [];
  }
};
