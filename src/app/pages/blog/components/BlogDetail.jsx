import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlogById } from '@/helpers/userBlogApi';
import Footer from '@/components/Footer';
import TopNavigationBar from '@/components/TopNavigationBar';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogById(id).then((data) => {
      setBlog({
        ...data,
        imageUrl: data.image_url,
      });
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <>
        <TopNavigationBar />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  if (!blog) return <div>Not found.</div>;

  return (
    <>
      <TopNavigationBar />
      <div className="container py-5">
        <h2>{blog.title}</h2>
        <p>By {blog.author} on {blog.date}</p>
        <img src={blog.imageUrl} alt={blog.title} style={{ width: '100%', borderRadius: 10, margin: '20px 0' }} />
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
      <Footer />
    </>
  );
};

export default BlogDetail;
