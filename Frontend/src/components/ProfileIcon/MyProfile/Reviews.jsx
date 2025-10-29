import { useState } from 'react';
import { FaStar, FaUser } from 'react-icons/fa';
import './Reviews.css'; // Create this CSS file for styling
import {Link} from 'react-router-dom'

const Reviews = () => {
  const [reviews, setReviews] = useState([
    { id: 1, name: "Sarah Johnson", rating: 5, comment: "Excellent service! The team went above and beyond to help me.", date: "2023-10-15" },
    { id: 2, name: "Michael Chen", rating: 4, comment: "Great product quality, but delivery was a bit slow.", date: "2023-09-28" },
    { id: 3, name: "Emma Williams", rating: 5, comment: "Absolutely love it! Will definitely purchase again.", date: "2023-11-02" }
  ]);

  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    comment: "",
    hover: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.name && newReview.comment && newReview.rating > 0) {
      const review = {
        id: reviews.length + 1,
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0]
      };
      setReviews([review, ...reviews]);
      setNewReview({ name: "", rating: 0, comment: "", hover: 0 });
    }
  };

  return (
    <div className="reviews-page">
      <button className='bg-blue-50 p-2 m-2 ' ><Link to='/myProfile'><span className='text-2xl no-underline!'>back</span></Link></button>
      <div className="reviews-hero">
        <h1>Customer Reviews</h1>
        <p>Your feedback helps us improve our services and products.</p>
      </div>

      <div className="reviews-container">
        <div className="leave-review">
          <h2>Share Your Experience</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newReview.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Your Rating</label>
              <div className="star-rating">
                {[...Array(5)].map((star, i) => {
                  const ratingValue = i + 1;
                  return (
                    <label key={i}>
                      <input
                        type="radio"
                        name="rating"
                        value={ratingValue}
                        onClick={() => setNewReview({ ...newReview, rating: ratingValue })}
                      />
                      <FaStar
                        className="star"
                        color={ratingValue <= (newReview.hover || newReview.rating) ? "#ffc107" : "#e4e5e9"}
                        size={25}
                        onMouseEnter={() => setNewReview({ ...newReview, hover: ratingValue })}
                        onMouseLeave={() => setNewReview({ ...newReview, hover: 0 })}
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="comment">Your Review</label>
              <textarea
                id="comment"
                name="comment"
                value={newReview.comment}
                onChange={handleInputChange}
                required
                rows="4"
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">Submit Review</button>
          </form>
        </div>

        <div className="reviews-list">
          <h2>What Our Customers Say</h2>
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="user-avatar">
                    <FaUser />
                  </div>
                  <div className="user-info">
                    <h3>{review.name}</h3>
                    <div className="review-rating">
                      {[...Array(5)].map((star, i) => (
                        <FaStar
                          key={i}
                          color={i < review.rating ? "#ffc107" : "#e4e5e9"}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="review-date">{review.date}</span>
                </div>
                <div className="review-content">
                  <p>{review.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;