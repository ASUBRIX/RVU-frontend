import React from 'react'
import BlogPost from './components/BlogPost'
import './components/blog.scss'
import Footer from '@/components/Footer'
import TopNavigationBar from '@/components/TopNavigationBar'
import HeroImage from './components/HeroImage'

const Blog = () => {
  // Sample blog data
  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with React',
      date: 'March 25, 2025',
      author: 'Jane Doe',
      excerpt:
        'React is a popular JavaScript library for building user interfaces. In this post, we will explore the basics of React and how to get started with your first app.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
      imageUrl: 'https://www.adverity.com/hubfs/6%20Key%20Digital%20Marketing%20Metrics%20for%202025%20blog%20hero.png',
      tags: ['React', 'JavaScript', 'Web Development'],
    },
    {
      id: 2,
      title: 'Styling in React with SCSS',
      date: 'March 20, 2025',
      author: 'John Smith',
      excerpt:
        'SCSS is a powerful CSS preprocessor that can help you write more maintainable styles for your React applications. Learn how to integrate SCSS with React.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
      imageUrl: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?cs=srgb&dl=pexels-pixabay-261662.jpg&fm=jpg',
      tags: ['SCSS', 'CSS', 'Styling', 'React'],
    },
    {
      id: 3,
      title: 'State Management in React Applications',
      date: 'March 15, 2025',
      author: 'Sarah Johnson',
      excerpt:
        'Managing state in React applications can be challenging. In this post, we will look at different approaches to state management and when to use each one.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
      imageUrl: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?cs=srgb&dl=pexels-pixabay-261662.jpg&fm=jpg',
      tags: ['React', 'State Management', 'Redux', 'Context API'],
    },
    {
      id: 4,
      title: 'Building Accessible React Components',
      date: 'March 10, 2025',
      author: 'Alex Williams',
      excerpt:
        'Accessibility is crucial for modern web applications. Discover how to create React components that are accessible to all users, including those with disabilities.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
      imageUrl: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?cs=srgb&dl=pexels-pixabay-261662.jpg&fm=jpg',
      tags: ['React', 'Accessibility', 'a11y', 'Web Development'],
    },
    {
      id: 5,
      title: 'React Performance Optimization Techniques',
      date: 'March 5, 2025',
      author: 'Jamie Lee',
      excerpt:
        'Optimizing React application performance is essential for providing a smooth user experience. Learn about memoization, code splitting, and other optimization techniques.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
      imageUrl: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?cs=srgb&dl=pexels-pixabay-261662.jpg&fm=jpg',
      tags: ['React', 'Performance', 'Optimization', 'JavaScript'],
    },
  ]

  return (
    <>
      <TopNavigationBar />
      <HeroImage />
      <div className="blog-page container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center mb-5">
            <h2 className="display-4 fw-bold mb-3">Latest Articles</h2>
            <p className="lead text-secondary">Stay up to date with the latest web development trends and tutorials</p>
          </div>
        </div>

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

        <nav aria-label="Blog pagination">
          <ul className="pagination justify-content-center">
            <li className="page-item active">
              <a className="page-link" href="#">1</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">2</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">3</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">Next →</a>
            </li>
          </ul>
        </nav>
      </div>
      <Footer className="custom-footer" />
    </>
  )
}

export default Blog