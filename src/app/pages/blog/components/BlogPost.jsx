import React from 'react';
import './BlogPost.scss';
import { Link } from 'react-router-dom';

const BlogPost = ({ post, featured = false }) => {
  return (
    <article className={`blog-post ${featured ? 'featured' : ''}`}>
      <div className="blog-post-image">
        <img src={post.imageUrl} alt={post.title} className="img-fluid" />
        <div className="category-badge">
          <span>{post.tags && post.tags[0]}</span>
        </div>
      </div>
      <div className="blog-post-content">
        <div className="blog-post-meta">
          <span className="date">
            <i className="bi bi-calendar3"></i> {post.date}
          </span>
          <span className="author">
            <i className="bi bi-person"></i> {post.author}
          </span>
        </div>
        <h3 className="blog-post-title">{post.title}</h3>
        <p className="blog-post-excerpt">{post.excerpt}</p>
        <div className="blog-post-tags">
          {post.tags && post.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <Link to={`/blogs/${post.id}`} className="read-more">
          Read More <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </article>
  );
};

export default BlogPost;
