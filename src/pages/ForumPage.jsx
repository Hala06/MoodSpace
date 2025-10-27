import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { MessageSquare, Plus, Heart, MessageCircle, Flag, Send, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loadForumPosts, createForumPost, likeForumPost, replyToForumPost, reportForumPost, getUserLikedPosts } from '../utils/forumStorage';
import { formatTimeAgo } from '../utils/dateHelpers';
import toast from 'react-hot-toast';
import AnimatedBlobs from '../components/AnimatedBlobs';
import SparklesComponent from '../components/Sparkles';
import './forum.css';

const ForumCard = ({ post, onLike, onReply, onReport, isLiked }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  const handleReply = () => {
    if (!replyContent.trim()) {
      toast.error('Please write a reply');
      return;
    }
    onReply(post.id, replyContent);
    setReplyContent('');
    setShowReplyBox(false);
    setShowReplies(true);
  };

  return (
    <Motion.div
      className="forum-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, scale: 1.01 }}
    >
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">{post.mood}</div>
          <div className="author-info">
            <span className="author-name">Anonymous User</span>
            <span className="post-time">{formatTimeAgo(new Date(post.createdAt))}</span>
          </div>
        </div>
        <button className="report-btn" onClick={() => onReport(post.id)} title="Report">
          <Flag size={16} />
        </button>
      </div>

      <div className="post-content">
        <p>{String(post.content || '')}</p>
      </div>

      {post.tag && (
        <div className="post-tag">
          <span className="tag-badge">{String(post.tag)}</span>
        </div>
      )}

      <div className="post-actions">
        <button 
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => onLike(post.id)}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
        </button>

        <button 
          className="action-btn"
          onClick={() => setShowReplyBox(!showReplyBox)}
        >
          <MessageCircle size={18} />
          <span>Reply</span>
        </button>

        {post.replies && post.replies.length > 0 && (
          <button 
            className="action-btn view-replies-btn"
            onClick={() => setShowReplies(!showReplies)}
          >
            <MessageSquare size={18} />
            <span>{showReplies ? 'Hide' : 'View'} {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}</span>
          </button>
        )}
      </div>

      {showReplyBox && (
        <Motion.div 
          className="reply-box"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply... (posted anonymously)"
            rows={3}
            className="reply-input"
          />
          <div className="reply-actions">
            <button className="btn btn-secondary" onClick={() => setShowReplyBox(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleReply}>
              <Send size={16} />
              Post Reply
            </button>
          </div>
        </Motion.div>
      )}

      {showReplies && post.replies && post.replies.length > 0 && (
        <Motion.div 
          className="replies-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {post.replies.map((reply, index) => (
            <div key={index} className="reply-item">
              <div className="reply-header">
                <div className="reply-avatar">{String(reply.mood || '😊')}</div>
                <div className="reply-info">
                  <span className="reply-author">Anonymous User</span>
                  <span className="reply-time">{formatTimeAgo(new Date(reply.createdAt))}</span>
                </div>
              </div>
              <p className="reply-content">{String(reply.content || '')}</p>
            </div>
          ))}
        </Motion.div>
      )}
    </Motion.div>
  );
};

const CreatePostModal = ({ onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('😊');
  const [tag, setTag] = useState('');

  const moods = ['😊', '😔', '😰', '😡', '😌'];
  const tags = ['Support', 'Victory', 'Struggle', 'Question', 'Advice', 'Gratitude'];

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error('Please write something first');
      return;
    }
    onSubmit({ content, mood, tag });
    setContent('');
    setMood('😊');
    setTag('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <Motion.div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="modal-header">
          <h2>Create Anonymous Post</h2>
          <p>Share your thoughts safely and anonymously</p>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <label className="section-label">How are you feeling?</label>
            <div className="mood-selector">
              {moods.map((m) => (
                <button
                  key={m}
                  className={`mood-option ${mood === m ? 'selected' : ''}`}
                  onClick={() => setMood(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <label className="section-label">Topic (Optional)</label>
            <div className="tag-selector">
              {tags.map((t) => (
                <button
                  key={t}
                  className={`tag-option ${tag === t ? 'selected' : ''}`}
                  onClick={() => setTag(tag === t ? '' : t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <label className="section-label">Your Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share what's on your mind... Your identity is protected."
              className="forum-editor"
              rows={6}
            />
            <p className="char-count">{content.length} characters</p>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            <Send size={16} />
            Post Anonymously
          </button>
        </div>
      </Motion.div>
    </div>
  );
};

const ForumPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterTag, setFilterTag] = useState('All');

  useEffect(() => {
    loadPosts();
    loadLikedPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadPosts = () => {
    const loaded = loadForumPosts();
    setPosts(loaded);
  };

  const loadLikedPosts = () => {
    const liked = getUserLikedPosts(user?.id || 'default');
    setLikedPosts(liked);
  };

  const handleCreatePost = (postData) => {
    try {
      createForumPost(postData, user?.id || 'default');
      loadPosts();
      setShowCreateModal(false);
      toast.success('Post shared anonymously! 💬');
    } catch {
      toast.error('Failed to create post');
    }
  };

  const handleLike = (postId) => {
    try {
      likeForumPost(postId, user?.id || 'default');
      loadPosts();
      loadLikedPosts();
      toast.success('Liked! ❤️');
    } catch {
      toast.error('Failed to like post');
    }
  };

  const handleReply = (postId, content) => {
    try {
      replyToForumPost(postId, content, user?.id || 'default');
      loadPosts();
      toast.success('Reply posted! 💬');
    } catch {
      toast.error('Failed to post reply');
    }
  };

  const handleReport = (postId) => {
    if (window.confirm('Report this post for violating community guidelines?')) {
      try {
        reportForumPost(postId, user?.id || 'default');
        toast.success('Post reported. Thank you for keeping our community safe.');
      } catch {
        toast.error('Failed to report post');
      }
    }
  };

  const tags = ['All', 'Support', 'Victory', 'Struggle', 'Question', 'Advice', 'Gratitude'];
  
  const filteredPosts = filterTag === 'All' 
    ? posts 
    : posts.filter(post => post.tag === filterTag);

  const totalPosts = posts.length;
  const totalInteractions = posts.reduce((sum, post) => sum + post.likes + (post.replies?.length || 0), 0);

  return (
    <Motion.div
      className="forum-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ambient Effects */}
      <AnimatedBlobs />
      <SparklesComponent density={30} />
      
      <div className="forum-header">
        <div className="header-content">
          <h1>
            <MessageSquare />
            Community Forum
          </h1>
          <p>A safe and supportive space to connect anonymously</p>
        </div>
        <button className="create-post-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          Share Your Thoughts
        </button>
      </div>

      <div className="forum-stats">
        <div className="stat-card">
          <Users size={24} />
          <div>
            <span className="stat-number">{totalPosts}</span>
            <span className="stat-label">Community Posts</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp size={24} />
          <div>
            <span className="stat-number">{totalInteractions}</span>
            <span className="stat-label">Total Interactions</span>
          </div>
        </div>
      </div>

      <div className="forum-filters">
        {tags.map((tag) => (
          <button
            key={tag}
            className={`filter-tag ${filterTag === tag ? 'active' : ''}`}
            onClick={() => setFilterTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="forum-content">
        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h2>No posts yet</h2>
            <p>Be the first to share your thoughts with the community</p>
            <button className="create-post-btn" onClick={() => setShowCreateModal(true)}>
              <Plus size={20} />
              Create First Post
            </button>
          </div>
        ) : (
          <div className="posts-list">
            {filteredPosts.map((post) => (
              <ForumCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onReply={handleReply}
                onReport={handleReport}
                isLiked={likedPosts.includes(post.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </Motion.div>
  );
};

export default ForumPage;
