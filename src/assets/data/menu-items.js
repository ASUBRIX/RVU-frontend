/**
 * Admin pages SCSS files location:
 * - Dashboard: src/assets/scss/components/admin/dashboard.scss
 * - Courses: src/assets/scss/components/admin/courses.scss
 * - Test Management: src/assets/scss/components/admin/content-management.scss
 * - Banners: src/assets/scss/components/admin/banners.scss
 * - Student Management: src/assets/scss/components/admin/student-management.scss
 * - Faculty Management: src/assets/scss/components/admin/faculty-management.scss
 * - Chat Section: src/assets/scss/components/admin/chat.scss
 * - Enquiries: src/assets/scss/components/admin/enquiries.scss
 * - Reports & Analytics: src/assets/scss/components/admin/reports.scss
 * - Admin Settings: src/assets/scss/components/admin/settings.scss
 */

import { BsBasket, BsBasketFill, BsCardChecklist, BsCartCheck, BsCartCheckFill, BsCreditCard2Front, BsCreditCard2FrontFill, BsFileCheckFill, BsFileEarmarkPlusFill, BsFolderCheck, BsGear, BsGraphUp, BsGridFill, BsHouse, BsLock, BsPencilSquare, BsPeople, BsQuestionDiamond, BsStar, BsStarFill, BsTrash, BsUiChecksGrid, BsUiRadiosGrid, BsWallet2 } from 'react-icons/bs';
import { FaBasketballBall, FaChartBar, FaCog, FaEdit, FaFacebook, FaLinkedinIn, FaRegCommentDots, FaRegFileAlt, FaTrashAlt, FaUserCog, FaMicroblog  } from 'react-icons/fa';
import { FaChartLine, FaUserGraduate, FaUserTie, FaWallet } from 'react-icons/fa6';
import clientUnitLogo1 from '@/assets/images/client/uni-logo-01.svg';
import clientUnitLogo2 from '@/assets/images/client/uni-logo-02.svg';
import clientUnitLogo3 from '@/assets/images/client/uni-logo-03.svg';
import clientUnitLogo4 from '@/assets/images/client/uni-logo-04.svg';
import clientUnitLogo5 from '@/assets/images/client/uni-logo-04.svg';

import { FcGoogle } from 'react-icons/fc';
export const CATEGORY_MENU_ITEMS = [{
  key: 'category',
  label: 'Category',
  icon: BsUiRadiosGrid,
  children: [{
    key: 'development',
    label: 'Development',
    parentKey: 'category',
    children: [{
      key: 'web-development',
      label: 'Web Development',
      parentKey: 'development',
      children: [{
        key: 'css',
        label: 'CSS',
        parentKey: 'web-development'
      }, {
        key: 'javaScript',
        label: 'JavaScript',
        parentKey: 'web-development'
      }, {
        key: 'angular',
        label: 'Angular',
        parentKey: 'web-development'
      }, {
        key: 'php',
        label: 'PHP',
        parentKey: 'web-development'
      }, {
        key: 'html',
        label: 'HTML',
        parentKey: 'web-development'
      }, {
        key: 'react',
        label: 'React',
        parentKey: 'web-development'
      }]
    }, {
      key: 'data-science',
      label: 'Data Science',
      parentKey: 'development'
    }, {
      key: 'mobile-development',
      label: 'Mobile Development',
      parentKey: 'development'
    }, {
      key: 'programming-language',
      label: 'Programming Language',
      parentKey: 'development'
    }, {
      key: 'software-testing',
      label: 'Software Testing',
      parentKey: 'development'
    }, {
      key: 'software-engineering',
      label: 'Software Engineering',
      parentKey: 'development'
    }, {
      key: 'software-development-tools',
      label: 'Software Engineering',
      parentKey: 'development'
    }]
  }, {
    key: 'design',
    label: 'Design',
    parentKey: 'category',
    isMegaMenu: true
  }, {
    key: 'music',
    label: 'Music',
    parentKey: 'category'
  }, {
    key: 'lifestyle',
    label: 'Lifestyle',
    parentKey: 'category'
  }, {
    key: 'it-software',
    label: 'It & Software',
    parentKey: 'category'
  }, {
    key: 'personal-development',
    label: 'Personal Development',
    parentKey: 'category'
  }, {
    key: 'health-fitness',
    label: 'Health & fitness',
    parentKey: 'category'
  }, {
    key: 'teaching',
    label: 'Teaching',
    parentKey: 'category'
  }, {
    key: 'social-science',
    label: 'Social science',
    parentKey: 'category'
  }, {
    key: 'math-logic',
    label: 'Math & Logic',
    parentKey: 'category'
  }]
}];
export const INSTRUCTOR_MENU_ITEMS = [
  {
    key: 'profile',
    label: 'Dashboard',
    icon: BsPencilSquare,
    url: '/student/dashboard',
    parentKey: 'instructor'
  },
  {
    key: 'courses',
    label: 'My Courses',
    icon: BsBasket,
    url: '/student/my-courses',
    parentKey: 'instructor'
  },
  {
    key: 'chat',
    label: 'Chat with Admin',
    icon: FaRegCommentDots,
    url: '/student/chat',
    parentKey: 'instructor'
  },
  {
    key: 'orders',
    label: 'Free Tests',
    icon: BsFolderCheck,
    url: '/student/test-details',
    parentKey: 'instructor'
  },

  {
    key: 'payout',
    label: 'Payment History',
    icon: BsWallet2,
    url: '/student/payment-history',
    parentKey: 'instructor'
  },
];
export const STUDENT_MENU_ITEMS = [{
  key: 'dashboard',
  label: 'Dashboard',
  icon: BsUiChecksGrid,
  url: '/student/dashboard',
  parentKey: 'student'
}, {
  key: 'subscriptions',
  label: 'My Subscriptions',
  icon: BsCardChecklist,
  url: '/student/subscription',
  parentKey: 'student'
}, {
  key: 'courses',
  label: 'My Courses',
  icon: BsBasket,
  url: '/student/course-list',
  parentKey: 'student'
}, {
  key: 'resume',
  label: 'Course Resume',
  icon: FaRegFileAlt,
  url: '/student/course-resume',
  parentKey: 'student'
}, {
  key: 'quiz',
  label: 'Quiz',
  icon: BsQuestionDiamond,
  url: '/student/quiz',
  parentKey: 'student'
}, {
  key: 'paymentInfo',
  label: 'Payment Info',
  icon: BsCreditCard2Front,
  url: '/student/payment-info',
  parentKey: 'student'
}, {
  key: 'wishlist',
  label: 'Wishlist',
  icon: BsCartCheck,
  url: '/student/bookmark',
  parentKey: 'student'
}, {
  key: 'profile',
  label: 'Edit Profile',
  icon: BsPencilSquare,
  url: '/student/edit-profile',
  parentKey: 'student'
}, {
  key: 'setting',
  label: 'Setting',
  icon: BsGear,
  url: '/student/setting',
  parentKey: 'student'
}, {
  key: 'delete',
  label: 'Delete Profile',
  icon: BsTrash,
  url: '/student/delete-account',
  parentKey: 'student'
}
  // {
  //   key: 'level',
  //   label: 'Dropdown level',
  //   icon: BsLock,
  //   url: '/student/dropdown-level',
  //   parentKey: 'student',
  // },
];
export const APP_MENU_ITEMS = [{
  key: 'demos',
  label: 'Demos',
  isTitle: true,
  children: [{
    key: 'default',
    label: 'Home Default',
    url: '/demos/default/home',
    parentKey: 'demos'
  }, {
    key: 'eduction',
    label: 'Home Eduction',
    url: '/demos/education/home',
    parentKey: 'demos'
  }, {
    key: 'academy',
    label: 'Home Academy',
    url: '/academy/home',
    parentKey: 'demos'
  }, {
    key: 'course-home',
    label: 'Home Course',
    url: '/demos/course/home',
    parentKey: 'demos'
  }, {
    key: 'university',
    label: 'Home University',
    url: '/demos/university/home',
    parentKey: 'demos'
  }, {
    key: 'kindergarten',
    label: 'Home Kindergarten',
    url: '/demos/kindergarten/home',
    parentKey: 'demos'
  }, {
    key: 'landing',
    label: 'Home Landing',
    url: '/demos/landing/home',
    parentKey: 'demos'
  }, {
    key: 'tutor',
    label: 'Home Tutor',
    url: '/demos/tutor/home',
    parentKey: 'demos'
  }, {
    key: 'school',
    label: 'Home School',
    url: '/demos/school/home',
    parentKey: 'demos'
  }, {
    key: 'abroad',
    label: 'Home Abroad',
    url: '/demos/abroad/home',
    parentKey: 'demos'
  }, {
    key: 'workshop',
    label: 'Home Workshop',
    url: '/demos/workshop/home',
    parentKey: 'demos'
  }]
}, {
  key: 'pages',
  label: 'Pages',
  isTitle: true,
  children: [{
    key: 'course',
    label: 'Course',
    parentKey: 'pages',
    children: [{
      key: 'categories',
      label: 'Course Categories',
      url: '/pages/course/categories',
      parentKey: 'course',
      divider: true
    }, {
      key: 'gridClassic',
      label: 'Course Grid Classic',
      url: '/pages/course/grid',
      parentKey: 'course'
    }, {
      key: 'minimalClassic',
      label: 'Course Grid Minimal',
      url: '/pages/course/grid-2',
      parentKey: 'course',
      divider: true
    }, {
      key: 'listClassic',
      label: 'Course List Classic',
      url: '/pages/course/list',
      parentKey: 'course'
    }, {
      key: 'listMinimalClassic',
      label: 'Course List Minimal',
      url: '/pages/course/list-2',
      parentKey: 'course',
      divider: true
    }, {
      key: 'detailClassic',
      label: 'Course Detail Classic',
      url: '/pages/course/detail',
      parentKey: 'course'
    }, {
      key: 'minimalDetailClassic',
      label: 'Course Detail Minimal',
      url: '/pages/course/detail-min',
      parentKey: 'course'
    }, {
      key: 'detailAdvance',
      label: 'Course Detail Advance',
      url: '/pages/course/detail-adv',
      parentKey: 'course'
    }, {
      key: 'moduleDetail',
      label: 'Course Detail Module',
      url: '/pages/course/detail-module',
      parentKey: 'course'
    }, {
      key: 'gridClassic',
      label: 'Course Full Screen Video',
      url: '/pages/course/video-player',
      parentKey: 'course'
    }]
  }, {
    key: 'about',
    label: 'About',
    parentKey: 'pages',
    children: [{
      key: 'aboutUs',
      label: 'About Us',
      url: '/pages/about/about-us',
      parentKey: 'about'
    }, {
      key: 'contactUs',
      label: 'Contact Us',
      url: '/pages/about/contact-us',
      parentKey: 'about'
    }, {
      key: 'blogGrid',
      label: 'Blog Grid',
      url: '/pages/about/blog-grid',
      parentKey: 'about'
    }, {
      key: 'blogMasonry',
      label: 'Blog Masonry',
      url: '/pages/about/blog-masonry',
      parentKey: 'about'
    }, {
      key: 'blogDetail',
      label: 'Blog Detail',
      url: '/pages/about/blog-grid/1003',
      parentKey: 'about'
    }, {
      key: 'pricing',
      label: 'Pricing',
      url: '/pages/about/pricing',
      parentKey: 'about'
    }]
  }, {
    key: 'instructorList',
    label: 'Instructor List',
    url: '/pages/instructors',
    parentKey: 'pages'
  }, {
    key: 'instructorSingle',
    label: 'Instructor Single',
    url: '/pages/instructors/401',
    parentKey: 'pages'
  }, {
    key: 'instructorBecome',
    label: 'Become an Instructor',
    url: '/pages/become-instructor',
    parentKey: 'pages'
  }, {
    key: 'abroadSingle',
    label: 'Abroad Single',
    url: '/pages/abroad-single',
    parentKey: 'pages'
  }, {
    key: 'workshopDetail',
    label: 'Workshop Detail',
    url: '/pages/workshop-detail',
    parentKey: 'pages'
  }, {
    key: 'eventDetail',
    label: 'Event Detail',
    url: '/pages/event-detail',
    parentKey: 'pages'
  }, {
    key: 'shop',
    label: 'Shop',
    parentKey: 'pages',
    children: [{
      key: 'shopGrid',
      label: 'Shop grid',
      url: '/shop',
      parentKey: 'shop'
    }, {
      key: 'productDetail',
      label: 'Product detail',
      url: '/shop/product-detail/301',
      parentKey: 'shop'
    }, {
      key: 'cart',
      label: 'Cart',
      url: '/shop/cart',
      parentKey: 'shop'
    }, {
      key: 'checkout',
      label: 'Checkout',
      url: '/shop/checkout',
      parentKey: 'shop'
    }, {
      key: 'emptyCart',
      label: 'Empty Cart',
      url: '/shop/empty-cart',
      parentKey: 'shop'
    }, {
      key: 'wishlist',
      label: 'Wishlist',
      url: '/shop/wishlist',
      parentKey: 'shop'
    }]
  }, {
    key: 'help',
    label: 'Help',
    parentKey: 'pages',
    children: [{
      key: 'helpCenter',
      label: 'Help Center',
      url: '/help/center',
      parentKey: 'help'
    }, {
      key: 'helpSingle',
      label: 'Help Center Single',
      url: '/help/center-detail',
      parentKey: 'help'
    }, {
      key: 'faqs',
      label: 'FAQs',
      url: '/faq',
      parentKey: 'help'
    }]
  }, {
    key: 'authentication',
    label: 'Authentication',
    parentKey: 'pages',
    children: [{
      key: 'signIn',
      label: 'Sign In',
      url: '/auth/sign-in',
      parentKey: 'authentication'
    }, {
      key: 'signup',
      label: 'Sign Up',
      url: '/auth/sign-up',
      parentKey: 'authentication'
    }, {
      key: 'forgotPassword',
      label: 'Forgot Password',
      url: '/auth/forgot-password',
      parentKey: 'authentication'
    }]
  }, {
    key: 'form',
    label: 'Form',
    parentKey: 'pages',
    children: [{
      key: 'demoRequest',
      label: 'Request a demo',
      url: '/pages/form/request-demo',
      parentKey: 'form'
    }, {
      key: 'book',
      label: 'Book a Class',
      url: '/pages/form/book-class',
      parentKey: 'form'
    }, {
      key: 'freeAccess',
      label: 'Free Access',
      url: '/pages/form/request-access',
      parentKey: 'form'
    }, {
      key: 'admissionForm',
      label: 'Admission Form',
      url: '/pages/form/admission-form',
      parentKey: 'form'
    }]
  }, {
    key: 'speciality',
    label: 'Specialty',
    parentKey: 'pages',
    children: [{
      key: '404Error',
      label: 'Error 404',
      url: '/error-404',
      parentKey: 'speciality'
    }, {
      key: 'comingSoon',
      label: 'Coming Soon',
      url: '/coming-soon',
      parentKey: 'speciality'
    }]
  }]
}, {
  key: 'accounts',
  label: 'Accounts',
  isTitle: true,
  children: [{
    key: 'instructor',
    label: 'Instructor',
    icon: FaUserTie,
    parentKey: 'accounts',
    children: [{
      key: 'dashboard',
      label: 'Dashboard',
      icon: BsGridFill,
      url: '/instructor/dashboard',
      parentKey: 'instructor'
    }, {
      key: 'courses',
      label: 'Courses',
      icon: BsBasketFill,
      url: '/instructor/manage-course',
      parentKey: 'instructor'
    }, {
      key: 'createCourse',
      label: 'Create Course',
      icon: BsFileEarmarkPlusFill,
      url: '/instructor/create-course',
      parentKey: 'instructor'
    }, {
      key: 'addCourse',
      label: 'Course Added',
      icon: BsFileCheckFill,
      url: '/instructor/course-added',
      parentKey: 'instructor'
    }, {
      key: 'quiz',
      label: 'Quiz',
      icon: BsQuestionDiamond,
      url: '/instructor/quiz',
      parentKey: 'instructor'
    }, {
      key: 'earnings',
      label: 'Earnings',
      icon: FaChartLine,
      url: '/instructor/earning',
      parentKey: 'instructor'
    }, {
      key: 'students',
      label: 'Students',
      icon: FaUserGraduate,
      url: '/instructor/student-list',
      parentKey: 'instructor'
    }, {
      key: 'orders',
      label: 'Orders',
      icon: BsCartCheckFill,
      url: '/instructor/order',
      parentKey: 'instructor'
    }, {
      key: 'reviews',
      label: 'Reviews',
      icon: BsStarFill,
      url: '/instructor/review',
      parentKey: 'instructor'
    }, {
      key: 'payout',
      label: 'Payout',
      icon: FaWallet,
      url: '/instructor/payout',
      parentKey: 'instructor'
    }]
  }, {
    key: 'student',
    label: 'Student',
    icon: FaUserGraduate,
    parentKey: 'accounts',
    children: [{
      key: 'dashboard',
      label: 'Dashboard',
      icon: BsGridFill,
      url: '/student/dashboard',
      parentKey: 'student'
    }, {
      key: 'subscriptions',
      label: 'My Subscriptions',
      icon: BsCardChecklist,
      url: '/student/subscription',
      parentKey: 'student'
    }, {
      key: 'courses',
      label: 'Courses',
      icon: BsBasketFill,
      url: '/student/course-list',
      parentKey: 'student'
    }, {
      key: 'resume',
      label: 'Course Resume',
      icon: FaRegFileAlt,
      url: '/student/course-resume',
      parentKey: 'student'
    }, {
      key: 'quiz',
      label: 'Quiz',
      icon: BsQuestionDiamond,
      url: '/student/quiz',
      parentKey: 'student'
    }, {
      key: 'paymentInfo',
      label: 'Payment Info',
      icon: BsCreditCard2FrontFill,
      url: '/student/payment-info',
      parentKey: 'student'
    }, {
      key: 'wishlist',
      label: 'Wishlist',
      icon: BsCartCheckFill,
      url: '/student/bookmark',
      parentKey: 'student'
    }]
  }, {
    key: 'admin',
    label: 'Admin',
    icon: FaUserCog,
    url: '/admin/dashboard',
    parentKey: 'accounts',
    divider: true
  }, {
    key: 'editProfile',
    label: 'Edit Profile',
    icon: FaEdit,
    url: '/instructor/edit-profile',
    parentKey: 'accounts'
  }, {
    key: 'setting',
    label: 'Settings',
    icon: FaCog,
    url: '/instructor/setting',
    parentKey: 'accounts'
  }, {
    key: 'deleteProfile',
    label: 'Delete Profile',
    icon: FaTrashAlt,
    url: '/instructor/delete-account',
    parentKey: 'accounts',
    divider: true
  }, {
    key: 'dropdown',
    label: 'Dropdown levels',
    parentKey: 'accounts',
    children: [{
      key: 'dropdownEnd',
      label: 'Dropdown (end)',
      parentKey: 'dropdown',
      children: [{
        key: 'item-1',
        label: 'Dropdown item',
        parentKey: 'dropdownEnd'
      }, {
        key: 'item-2',
        label: 'Dropdown item',
        parentKey: 'dropdownEnd'
      }]
    }, {
      key: 'dropdownItem',
      label: 'Dropdown item',
      parentKey: 'dropdown'
    }, {
      key: 'dropdownStart',
      label: 'Dropdown (start)',
      parentKey: 'dropdown',
      children: [{
        key: 'item-1',
        label: 'Dropdown item',
        parentKey: 'dropdownStart'
      }, {
        key: 'item-2',
        label: 'Dropdown item',
        parentKey: 'dropdownStart'
      }]
    }, {
      key: 'dropdownItem1',
      label: 'Dropdown item',
      parentKey: 'dropdown'
    }]
  }]
}];
export const MEGA_MENU_ITEMS = {
  getStarted: [{
    label: 'Market research'
  }, {
    label: 'Advertising'
  }, {
    label: 'Consumer behavior'
  }, {
    label: 'Digital marketing'
  }, {
    label: 'Marketing ethics'
  }, {
    label: 'Social media marketing'
  }, {
    label: 'Public relations'
  }, {
    label: 'Advertising'
  }, {
    label: 'Decision science'
  }, {
    label: 'SEO'
  }, {
    label: 'Business marketing'
  }],
  degree: [{
    image: clientUnitLogo1,
    label: 'Contact management',
    description: 'Speedily say has suitable disposal add boy. On forth doubt miles of child.'
  }, {
    image: clientUnitLogo2,
    label: 'Sales pipeline',
    description: 'Speedily say has suitable disposal add boy. On forth doubt miles of child.'
  }, {
    image: clientUnitLogo3,
    label: 'Security & Permission',
    description: 'Speedily say has suitable disposal add boy. On forth doubt miles of child.'
  }, {
    image: clientUnitLogo1,
    label: 'Andeerson Campus',
    description: 'Bachelor of computer science'
  }, {
    image: clientUnitLogo4,
    label: 'University of South California',
    description: 'Masters of business development.'
  }],
  certificate: [{
    label: 'Google SEO certificate',
    description: 'No prerequisites',
    icon: FcGoogle,
    iconClass: 'text-google-icon'
  }, {
    label: 'Business Development Executive(BDE)',
    description: 'No prerequisites',
    icon: FaLinkedinIn,
    iconClass: 'text-linkedin'
  }, {
    label: 'Facebook social media marketing',
    description: 'Expert advice',
    icon: FaFacebook,
    iconClass: 'text-facebook'
  }, {
    label: 'Creative graphics design',
    description: 'No prerequisites',
    icon: FaBasketballBall,
    iconClass: 'text-dribbble'
  }]
};
export const ADMIN_MENU_ITEMS = [{
  key: 'admin',
  label: 'Dashboard',
  icon: BsHouse,
  url: '/admin/dashboard'
}, {
  key: 'courses',
  label: 'Courses',
  icon: BsBasket,
  url: '/admin/all-courses'
}, {
  key: 'contents',
  label: 'Test Management',
  icon: FaRegFileAlt,
  url: '/admin/test-management'
}, {
  key: 'student-management',
  label: 'Student Management',
  icon: FaUserGraduate,
  url: '/admin/student-management'
}, {
  key: 'faculty-management',
  label: 'Faculties Management',
  icon: FaUserTie,
  url: '/admin/faculty-management'
}, {
  key: 'blog-management',
  label: 'Blog Management',
  icon: FaMicroblog,
  url: '/admin/blog-management'
},
  {
  key: 'announcement-management',
  label: 'Announcements',
  icon: FaMicroblog,
  url: '/admin/announcements'
},{
  key:'current-affairs',
  label:"Current Affairs",
  icon:FaMicroblog,
  url:"/admin/current-affairs"
},
{
  key: 'chat',
  label: 'Chat Section',
  icon: FaRegCommentDots,
  url: '/admin/chat'
}, {
  key: 'enquiries',
  label: 'Enquiries',
  icon: BsQuestionDiamond,
  url: '/admin/enquiries'
}, {
  key: 'reports',
  label: 'Reports & Analytics',
  icon: FaChartBar,
  children: [{
    key: 'course-reports',
    label: 'Course Reports',
    url: '/admin/reports/courses',
    parentKey: 'reports'
  }, {
    key: 'payment-reports',
    label: 'Payment Reports',
    url: '/admin/reports/payments',
    parentKey: 'reports'
  },
]
}];
