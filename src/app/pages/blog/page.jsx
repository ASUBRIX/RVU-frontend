import React, { useEffect, useState } from 'react';
import BlogPost from './components/BlogPost';
import './components/blog.scss';
import Footer from '@/components/Footer';
import TopNavigationBar from '@/components/TopNavigationBar';
import HeroImage from './components/HeroImage';
import { fetchAllBlogs } from '@/helpers/userBlogApi';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBlogs()
      .then((data) => {
        const adaptedBlogs = data.map(blog => ({
          ...blog,
          imageUrl: blog.image_url,
        }));
        setBlogPosts(adaptedBlogs);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <TopNavigationBar />
        <HeroImage />
        <div className="blog-page container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <Footer className="custom-footer" />
      </>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <>
        <TopNavigationBar />
        <HeroImage />
        <div className="blog-page container py-5 text-center">
          <p>No blog articles found.</p>
        </div>
        <Footer className="custom-footer" />
      </>
    );
  }

  return (
    <>
      <TopNavigationBar />
      <HeroImage />
      <div className="blog-page container py-5">
        

        <div className="featured-post mb-5">
          <BlogPost post={blogPosts[0]} featured={true} />
        </div>

        <div className="row g-4 mb-5">
          {blogPosts.slice(1).map((post) => (
            <div key={post.id} className="col-lg-4 col-md-6">
              <BlogPost post={post} />
            </div>
          ))}
        </div>
        {/* Pagination can go here */}
      </div>
      <Footer className="custom-footer" />
    </>
  );
};

export default Blog;
