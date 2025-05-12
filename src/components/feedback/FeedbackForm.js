import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { database } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/FeedbackForm.css';

const FeedbackForm = ({ onFeedbackSubmitted }) => {
  const { currentUser, userDetails } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Handle star rating hover
  const handleMouseOver = (index) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  // Handle star rating click
  const handleRatingClick = (index) => {
    setRating(index);
  };

  // Handle feedback submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (rating === 0) {
      setMessage({ text: 'Please select a rating', type: 'error' });
      return;
    }

    if (!feedbackText.trim()) {
      setMessage({ text: 'Please enter your feedback', type: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage({ text: 'Submitting your feedback...', type: 'info' });

      // Create feedback object
      const feedbackData = {
        userId: currentUser.uid,
        username: userDetails?.username || currentUser.displayName || 'Anonymous',
        profileImage: userDetails?.profileImage || null,
        rating: rating,
        text: feedbackText.trim(),
        date: new Date().toISOString()
      };

      // Save to Firebase
      const feedbacksRef = ref(database, 'feedbacks');
      await push(feedbacksRef, feedbackData);

      // Clear form
      setRating(0);
      setFeedbackText('');
      setMessage({ text: 'Thank you for your feedback!', type: 'success' });

      // Notify parent component
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage({ text: 'Error submitting feedback. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-form-container">
      <h3>Share Your Experience</h3>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'success' && <i className='bx bx-check-circle'></i>}
          {message.type === 'error' && <i className='bx bx-error-circle'></i>}
          {message.type === 'info' && <i className='bx bx-info-circle'></i>}
          <span>{message.text}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="rating-container">
          <p>Rate your experience:</p>
          <div className="star-rating">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <i
                  key={index}
                  className={`bx ${
                    (hoverRating || rating) >= starValue ? 'bxs-star' : 'bx-star'
                  }`}
                  onMouseOver={() => handleMouseOver(starValue)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleRatingClick(starValue)}
                ></i>
              );
            })}
          </div>
        </div>
        
        <div className="feedback-text-container">
          <label htmlFor="feedback-text">Your feedback:</label>
          <textarea
            id="feedback-text"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={4}
            maxLength={500}
          ></textarea>
          <div className="char-count">
            {feedbackText.length}/500
          </div>
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
