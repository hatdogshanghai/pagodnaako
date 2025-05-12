import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FeedbackForm from '../components/feedback/FeedbackForm';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../services/firebase';
import '../styles/pages/Testimonials.css';

const Testimonials = () => {
  const { currentUser } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const testimonialsRef = ref(database, 'feedbacks');
      const snapshot = await get(testimonialsRef);

      if (snapshot.exists()) {
        const feedbacksData = snapshot.val();
        const feedbacksArray = Object.keys(feedbacksData).map(key => ({
          id: key,
          ...feedbacksData[key]
        }));

        // Sort by date (newest first)
        feedbacksArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        setTestimonials(feedbacksArray);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <>
      <Header />

      <main className="testimonials-page">
        <div className="container">
          <h1 className="page-title">Customer Testimonials</h1>

          <div className="testimonials-intro">
            <p>
              At Yogee, we value the feedback of our customers. Here's what they have to say about their experiences with us.
            </p>
          </div>

          {loading ? (
            <div className="loading">Loading testimonials...</div>
          ) : testimonials.length === 0 ? (
            <div className="no-testimonials">
              <i className='bx bx-message-square-detail'></i>
              <p>No testimonials yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <div className="testimonial-card" key={testimonial.id}>
                  <div className="testimonial-header">
                    <div className="user-info">
                      {testimonial.profileImage ? (
                        <img
                          src={testimonial.profileImage}
                          alt={testimonial.username}
                          className="user-image"
                        />
                      ) : (
                        <div className="user-placeholder">
                          <i className='bx bx-user'></i>
                        </div>
                      )}
                      <h3>{testimonial.username}</h3>
                    </div>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`bx ${i < testimonial.rating ? 'bxs-star' : 'bx-star'}`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <p className="testimonial-text">{testimonial.text}</p>
                  <div className="testimonial-date">
                    {new Date(testimonial.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentUser ? (
            <FeedbackForm onFeedbackSubmitted={fetchTestimonials} />
          ) : (
            <div className="testimonials-cta">
              <h2>Share Your Experience</h2>
              <p>
                We'd love to hear about your experience with Yogee.
                Please log in to leave a review and help us improve our service.
              </p>
              <a href="/login" className="cta-btn">Log In to Submit Feedback</a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Testimonials;
