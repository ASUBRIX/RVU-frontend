import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa'

export const footerLinks = [
  {
    title: 'Quick Links',
    items: [
      { name: 'Home', link: '/' },
      { name: 'About', link: '/about-us' },
      { name: 'Our Team', link: '/our-team' },
      { name: 'Courses', link: '/courses' },
      { name: 'Free Test', link: '/free-test' },
      { name: 'Gallery', link: '/gallery' },
      { name: 'Blogs', link: '/blogs' },
    ],
  },
  {
    title: 'Quick Links',
    items: [
      { name: 'Support', link: '/contact-us' },
      { name: 'FAQ', link: '/faq' },
      { name: 'Terms and Conditions', link: '/terms' },
      { name: 'Privacy Policy', link: '/privacy' },
    ],
  },
  {
    title: 'Courses',
    items: [
      { name: 'Test Series', link: '/pages/course/grid-2' },
      { name: 'TNPSC', link: '/pages/course/grid-2' },
      { name: 'UPSC CSE', link: '/pages/course/grid-2' },
      { name: 'Bank Exam', link: '/pages/course/grid-2' },
      { name: 'Railways Exam', link: '/pages/course/grid-2' },
    ],
  },
];

export const socialMediaLinks = [
  { icon: FaFacebookF, variant: 'text-facebook' },
  { icon: FaInstagram, variant: 'text-instagram' },
  { icon: FaTwitter, variant: 'text-twitter' },
  { icon: FaLinkedinIn, variant: 'text-linkedin' },
];
