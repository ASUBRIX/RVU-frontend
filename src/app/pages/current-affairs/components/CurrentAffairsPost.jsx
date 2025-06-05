import React from 'react';
import './currentAffairs.scss';
import { Link } from 'react-router-dom';

const CurrentAffairPost = ({ affair, featured = false }) => (
  <article className={`current-affair-post${featured ? ' featured' : ''}`}>
    {/* Optionally, add an image section here if you want to show an image */}
    {/* <div className="blog-post-image">
      <img src={affair.imageUrl} alt={affair.title} />
    </div> */}
    <div className="current-affair-post-content">
      <div className="current-affair-post-meta">
        <span className="date">
          <i className="bi bi-calendar3"></i> {affair.date}
        </span>
        <span className="category">
          <i className="bi bi-bookmark"></i> {affair.category}
        </span>
      </div>
      <h3 className="current-affair-post-title">{affair.title}</h3>
      <div className="current-affair-post-excerpt" dangerouslySetInnerHTML={{
        __html: affair.content.length > 200
          ? affair.content.slice(0, 200) + '...'
          : affair.content
      }} />
      <Link to={`/current-affairs/${affair.id}`} className="read-more">
        Read More <i className="bi bi-arrow-right"></i>
      </Link>
    </div>
  </article>
);

export default CurrentAffairPost;
