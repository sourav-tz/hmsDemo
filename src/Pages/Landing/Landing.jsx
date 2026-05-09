import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.scss';
import banner from './../../Assets/banner.svg';
import male from './../../Assets/male.png';
import female from './../../Assets/female.png';
import loginIcon from './../../Assets/login.png';
import mainLogo from './../../Assets/h.png';
import abhimanyuBhawanImage from './../../Assets/h1.png';
import Footer from '../../components/Footer/Footer';
import UniversalChatbot from "../../components/Chatbot/UniversalChatbot";
import boysHostelPDF from './../../Assets/boys_hostel.pdf';
import girlsHostelPDF from './../../Assets/girls_hostel.pdf';
import hostelRulesPDF from './../../Assets/hostel_rules.pdf';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaEnvelope, FaQuestionCircle, FaBook, FaHome, FaArrowRight, FaTelegramPlane } from 'react-icons/fa';

// Custom animation styles
import './animations.css';

const customStyles = `
  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }

  .animate-marquee {
    animation: marquee 15s linear infinite;
  }

  @keyframes telegramAgentPulse {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.7); opacity: 0; }
  }
`;

const telegramAgentUrl = import.meta.env.VITE_TELEGRAM_AGENT_URL || 'https://t.me/agentHmsBot';

// HostelDetails Component - Displays details of a selected hostel in a popup (modal)
const HostelDetails = ({ hostel, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // Match this with the animation duration
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50 p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-lg shadow-2xl relative w-full max-w-xs sm:max-w-md md:max-w-2xl overflow-hidden ${isClosing ? 'animate__scaleOut' : 'animate__scaleIn'}`}>
        {/* Header with hostel name */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 px-4 sm:px-6">
          <h2 className="text-lg sm:text-xl font-bold">{hostel.name}</h2>
          <p className="text-xs sm:text-sm text-blue-100">Hostel #{hostel.id}</p>
        </div>

        {/* Close button */}
        <button
          className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors duration-200"
          onClick={handleClose}
        >
        </button>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            {/* Left column - Image */}
            <div className="md:w-1/3">
              {hostel.details && hostel.details.Image ? (
                <img
                  src={hostel.details.Image}
                  alt={hostel.name}
                  className="w-full rounded-lg shadow-md mb-4 object-cover"
                  style={{ maxHeight: '250px' }}
                />
              ) : (
                <div className="w-full h-36 sm:h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <FaHome className="text-gray-400 text-3xl sm:text-5xl" />
                </div>
              )}
            </div>

            {/* Right column - Details */}
            <div className="md:w-2/3">
              {hostel.details && Object.keys(hostel.details).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {Object.entries(hostel.details)
                    // Skip the Image field so its path doesn't show
                    .filter(([key]) => key !== 'Image')
                    .map(([key, value]) => (
                      <div className="border-b border-gray-100 pb-2" key={key}>
                        <p className="text-xs sm:text-sm text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-sm sm:text-base font-medium text-gray-800">
                          {Array.isArray(value) ? value.join(', ') : value}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      
                    </div>
                    <div className="ml-3">
                      <p className="text-xs sm:text-sm text-yellow-700">
                        Details for {hostel.name} are not available yet.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-2 sm:py-3 flex justify-end border-t border-gray-100">
          <button
            onClick={handleClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded text-sm transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Landing Component
const Landing = () => {
  // State Variables
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isNavSticky, setIsNavSticky] = useState(false);

  // Refs
  const topRef = useRef(null);
  const navRef = useRef(null);

  // Data Arrays
  const boys_hostels = [
    { id: 1, name: 'Abhimanyu Bhawan', details: { Capacity: 228, 'Total Rooms': '76 (all triple seated)', 'Building Type': 'Triple-storey', 'Lan Connection': '3 per room', 'Dining Hall': '1', 'Common Room': 1, 'Green Lawns': 'Well surrounded', Image: abhimanyuBhawanImage} },
    { id: 2, name: 'Bhishma Bhawan', details: { Capacity: 210, 'Total Rooms': '70 (all triple seated)', 'Building Type': 'Double-storey', 'Lan Connection': '3 per room', 'Dining Hall': '1', 'Common Room': 1, 'Green Lawns': 'Spacious' } },
    { id: 3, name: 'Chakradhar Bhawan', details: { Capacity: 240, 'Total Rooms': '80 (all triple seated)', 'Building Type': 'Triple-storey', 'Lan Connection': '3 per room', 'Dining Hall': '1', 'Common Room': 1, 'Green Lawns': 'Well maintained' } },
    { id: 4, name: 'Dronacharya Bhawan', details: { Capacity: 195, 'Total Rooms': '65 (all triple seated)', 'Building Type': 'Double-storey', 'Lan Connection': '3 per room', 'Dining Hall': '1', 'Common Room': 1, 'Green Lawns': 'Beautiful' } },
    { id: 5, name: 'Eklavya Bhawan', details: { Capacity: 225, 'Total Rooms': '75 (all triple seated)', 'Building Type': 'Triple-storey', 'Lan Connection': '3 per room', 'Dining Hall': '1', 'Common Room': 1, 'Green Lawns': 'Lush green' } },
    { id: 6, name: 'Fanibhushan Bhawan', details: { Capacity: 180, 'Total Rooms': '60 (all triple seated)', 'Building Type': 'Double-storey', 'Lan Connection': '3 per room', 'Dining Hall': '1', 'Common Room': 1, 'Green Lawns': 'Well kept' } },
    { id: 7, name: 'Girivar Bhawan', details: { Capacity: 210, 'Total Rooms': '70 (all triple seated)', 'Building Type': 'Triple-storey', 'Lan Connection': '3 per room', 'Dining Hall': '1', 'Common Room': 1, 'Green Lawns': 'Spacious' } },
    { id: 8, name: 'Harihar Bhawan', details: { Capacity: 195, 'Total Rooms': '65 (all triple seated)', 'Building Type': 'Double-storey', 'Lan Connection': '3 per room', 'Dining Hall': '1', 'Common Room': 1, 'Green Lawns': 'Beautiful' } },
    { id: 9, name: 'Indivar Bhawan', details: { Capacity: 240, 'Total Rooms': '80 (all triple seated)', 'Building Type': 'Triple-storey', 'Lan Connection': '3 per room', 'Dining Hall': '1', 'Common Room': 1, 'Green Lawns': 'Well maintained' } },
    { id: 10, name: 'Visvesvaraya Bhawan', details: { Capacity: 225, 'Total Rooms': '75 (all triple seated)', 'Building Type': 'Triple-storey', 'Lan Connection': '3 per room', 'Dining Hall': '1', 'Common Room': 1, 'Green Lawns': 'Lush green' } },
    { id: 11, name: 'Vivekananda Bhawan', details: { Capacity: 210, 'Total Rooms': '70 (all triple seated)', 'Building Type': 'Double-storey', 'Lan Connection': '3 per room', 'Dining Hall': '1', 'Common Room': 1, 'Green Lawns': 'Spacious' } },
  ];

  const girls_hostels = [
    { id: 12, name: 'Bhagirathi Bhawan', details: { Capacity: 180, 'Total Rooms': '60 (all triple seated)', 'Building Type': 'Triple-storey', 'Lan Connection': '3 per room', 'Dining Hall': '1', 'Common Room': 1, 'Green Lawns': 'Beautiful garden' } },
    { id: 13, name: 'Cauvery Bhawan', details: { Capacity: 150, 'Total Rooms': '50 (all triple seated)', 'Building Type': 'Double-storey', 'Lan Connection': '3 per room', 'Dining Hall': '1', 'Common Room': 1, 'Green Lawns': 'Well maintained' } },
    { id: 14, name: 'Kalpana Chawla Hostel', details: { Capacity: 210, 'Total Rooms': '70 (all triple seated)', 'Building Type': 'Triple-storey', 'Lan Connection': '3 per room', 'Dining Hall': '1', 'Common Room': 1, 'Green Lawns': 'Spacious' } },
  ];

  // FAQ data
  const faqData = [
    {
      question: "What are the hostel timings?",
      answer: "The hostel gates close at 10:00 PM for all students. Students are expected to be inside the hostel premises by this time unless they have special permission."
    },
    {
      question: "How is the food in the hostel mess?",
      answer: "The hostel mess provides nutritious and balanced meals three times a day. The menu is decided by the mess committee which includes student representatives to ensure quality and variety."
    },
    {
      question: "Are there laundry facilities available?",
      answer: "Yes, all hostels are equipped with laundry facilities. Students can either use the washing machines provided or avail the services of the designated laundry personnel."
    },
    {
      question: "What should I do if I have a maintenance issue in my room?",
      answer: "For any maintenance issues, students should report to the hostel warden or fill out the maintenance request form available at the hostel office. Issues are typically addressed within 24-48 hours."
    },
    {
      question: "Can I have guests stay overnight?",
      answer: "Overnight guests are generally not allowed. However, in special circumstances, permission may be granted by the hostel warden. A guest register must be signed and appropriate fees paid."
    }
  ];

  // Helper Functions
  const openModal = (hostel) => {
    setSelectedHostel(hostel);
  };

  const closeModal = () => {
    // The animation is handled in the HostelDetails component
    setSelectedHostel(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBoysHostels = boys_hostels.filter(hostel =>
    hostel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGirlsHostels = girls_hostels.filter(hostel =>
    hostel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Effect to handle scroll events for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add custom styles to the document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);



  // Banner Section Component
  const BannerSection = () => {
    return (
      <section className="relative min-h-[65vh] bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 flex items-center justify-start overflow-hidden px-4 sm:px-8 py-12 sm:py-4">
        <div className="container mx-auto">
          <div className="text-white z-10 max-w-xl relative">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 animate__fadeInDown">Welcome To</h1>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 animate__fadeInUp">
              <span className="text-yellow-300">NIT</span> KURUKSHETRA
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-8 animate__fadeIn">
              Experience comfortable and secure accommodation at our campus hostels.
              <span className="block mt-2 italic">Your home away from home.</span>
            </p>
            <Link to="/role">
              <button className="bg-white text-blue-700 hover:bg-blue-50 transition-all duration-300 font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg flex items-center animate__fadeInUp">
                Get Started <FaArrowRight className="ml-2" />
              </button>
            </Link>

            {/* Decorative elements */}
            <div className="absolute -bottom-10 -left-10 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-blue-400 opacity-20"></div>
            <div className="absolute -top-10 -right-10 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-yellow-300 opacity-20"></div>
          </div>
        </div>

        <img
          src={banner}
          alt="NIT Kurukshetra Banner"
          className="absolute bottom-0 right-0 h-auto max-h-[60%] sm:max-h-[80%] md:max-h-[100%] w-auto max-w-[60%] sm:max-w-[50%] md:max-w-[45%] object-contain z-2 hidden sm:block"
          style={{
            transform: 'scale(0.95)',
            filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.1))',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
      </section>
    );
  };

  const TelegramAgentButton = () => {
    return (
      <a
        href={telegramAgentUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Open Telegram agent"
        title="Open Telegram agent"
        className="fixed bottom-[96px] right-6 z-[9998] flex h-[52px] w-[52px] items-center justify-center rounded-full border-0 text-white transition duration-200 hover:scale-110 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        style={{
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          boxShadow: '0 4px 20px rgba(79,70,229,0.45)'
        }}
      >
        <span
          className="absolute -inset-[3px] rounded-full border-[2.5px] border-[rgba(99,102,241,0.55)]"
          style={{ animation: 'telegramAgentPulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }}
        />
        <span
          className="absolute -inset-[3px] rounded-full border-[2.5px] border-[rgba(99,102,241,0.55)]"
          style={{ animation: 'telegramAgentPulse 2s cubic-bezier(0.4,0,0.6,1) infinite', animationDelay: '0.75s' }}
        />
        <FaTelegramPlane className="relative z-10 text-[22px]" />
      </a>
    );
  };

  // Search Component
  const SearchSection = () => {
    return (
      <div className="bg-white py-6 px-4 shadow-md rounded-lg mx-auto -mt-8 relative z-20 max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for hostels..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/role">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
                Login
              </button>
            </Link>
            <a href="#contact">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
                Contact Us
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  };

  // FAQ Accordion Component
  const FAQSection = () => {
    return (
      <section className="py-16 px-6 bg-gray-50" id="faq">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300"
              >
                <button
                  className="flex justify-between items-center w-full p-5 text-left"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-semibold text-lg flex items-center">
                    <FaQuestionCircle className="text-blue-500 mr-3" />
                    {faq.question}
                  </span>
                  <span className={`transform transition-transform duration-300 ${activeAccordion === index ? 'rotate-180' : ''}`}>
                   
                  </span>
                </button>
                <div
                  className={`px-5 overflow-hidden transition-all duration-300 ${
                    activeAccordion === index ? 'max-h-96 pb-5' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };




// Render Section
return (
  <div className="overflow-y-auto">
    <nav className='fixed top-0 left-0 right-0 tracking-widest z-50 shadow-md'>
      {/* Disclaimer Bar - Initially visible */}
      <div className="bg-gradient-to-r from-yellow-200 to-yellow-300 py-2 px-4 text-center overflow-hidden">
        <div className="inline-block whitespace-nowrap animate-marquee">
          <h3 className="text-base sm:text-lg font-semibold text-red-600 inline-flex items-center">
            
            Disclaimer: This is for testing purposes only.
            
          </h3>
        </div>
      </div>

      {/* Header - Will become sticky */}
      <div className='w-full bg-white sticky top-0 z-40 border-b border-gray-200'>
        <header className="container mx-auto py-3 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img
                src={mainLogo}
                alt="Institute Logo"
                className="h-8 mr-3 transition-transform duration-300 group-hover:scale-110"
              />
              <div>
                <div className="text-lg font-bold text-gray-800 transition-colors duration-300 hover:text-blue-600">
                  Hostel Management System
                  <span className="text-blue-600 font-extrabold">(HMS)</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Login Button */}
          <div className="flex items-center">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfCnEw9Wu3IGb5RMTwB6-AiDP-6ivYYrciDD3RNJSFzuk_YZA/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-full shadow-md hover:bg-red-600 hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-out mr-3 h-[45px]"
          >
            Report a Bug
          </a>

            <Link
              to="/role"
              className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 px-4 sm:px-5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <img src={loginIcon} alt="Login Icon" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 filter invert" />
              <span className="text-sm sm:text-base">Login</span>
            </Link>
          </div>
        </header>
      </div>
    </nav>

    {/* Banner Section */}
    <div style={{ marginTop: '120px' }}>
      <BannerSection />
    </div>


      {/* Hostel Notifications Section */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Latest <span className="text-blue-600">Notifications</span></h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto border border-gray-100">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 flex items-center justify-between">
              <h3 className="font-bold text-lg">Important Announcements</h3>
              <span className="bg-white text-red-600 text-xs font-bold px-2 py-1 rounded-full">New</span>
            </div>

            <div className="divide-y divide-gray-100">
              <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full p-2 mr-3">

                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">April 17, 2025</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Advt.No.09/2025 regarding recruitment of Project Staff
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full p-2 mr-3">
                    
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">April 4, 2025</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Advt.No.07/2025 regarding recruitment of Junior Research Fellow
                      (JRF)/Project Associate
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full p-2 mr-3">
                    
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">March 5, 2025</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Notification No.Gen.-I/3795/1139 dated 04.03.2025 regarding withdrawal of Corrigendum to Advt.Nos.80/2024 to 93/2024 issued for the recruitment of Associate Professors
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full p-2 mr-3">
                    
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">January 6, 2025</p>
                    <p className="text-sm text-gray-600 mt-1">
                      List of short-listed candidates for the post of Assistant Professor Grade-II (Level-10) in the Department of Humanities & Social Sciences of the Institute (Ref.: Advt.No.32/2024)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* View all link */}
            <div className="bg-gray-50 py-3 px-6 text-right border-t border-gray-100">
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center transition-colors duration-200">
                View all notifications
               
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rules & Regulations */}
      <section className="bg-white py-10 sm:py-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">Rules & <span className="text-blue-600">Regulations</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

            {/* Hostel Rules & Conducts Card */}
            <div
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              onClick={() => window.open(hostelRulesPDF, '_blank')}
            >
              <div className="p-4 sm:p-6 flex flex-col items-center">
                <div className="bg-white/20 p-2 sm:p-3 rounded-full mb-3 sm:mb-4 group-hover:bg-white/30 transition-colors duration-300">
                  <FaBook className="text-white text-xl sm:text-2xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Hostel Rules & Conducts</h3>
                <p className="text-blue-100 text-sm text-center">
                  Guidelines for all residents to ensure a harmonious living environment
                </p>
                <button className="mt-4 bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg shadow transition-colors duration-300 flex items-center text-sm">
                  View PDF <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* Boys Hostels Card */}
            <div
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              onClick={() => window.open(boysHostelPDF, '_blank')}
            >
              <div className="p-4 sm:p-6 flex flex-col items-center">
                <div className="bg-white/20 p-2 sm:p-3 rounded-full mb-3 sm:mb-4 group-hover:bg-white/30 transition-colors duration-300">
                  <FaHome className="text-white text-xl sm:text-2xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Boys Hostels</h3>
                <p className="text-blue-100 text-sm text-center">
                  Information about boys&apos; hostel facilities, amenities and regulations
                </p>
                <button className="mt-4 bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg shadow transition-colors duration-300 flex items-center text-sm">
                  View PDF <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* Girls Hostels Card */}
            <div
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              onClick={() => window.open(girlsHostelPDF, '_blank')}
            >
              <div className="p-4 sm:p-6 flex flex-col items-center">
                <div className="bg-white/20 p-2 sm:p-3 rounded-full mb-3 sm:mb-4 group-hover:bg-white/30 transition-colors duration-300">
                  <FaHome className="text-white text-xl sm:text-2xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Girls Hostels</h3>
                <p className="text-blue-100 text-sm text-center">
                  Information about girls&apos; hostel facilities, amenities and regulations
                </p>
                <button className="mt-4 bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg shadow transition-colors duration-300 flex items-center text-sm">
                  View PDF <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Boys Hostel List Section */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center mb-10">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <img src={male} alt="Boys Hostel Icon" className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Boys <span className="text-blue-600">Hostels</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {boys_hostels.map((hostel) => (
              <div
                key={hostel.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group"
                onClick={() => openModal(hostel)}
              >
                <div className="bg-blue-600 h-2 w-full group-hover:h-3 transition-all duration-300"></div>
                <div className="p-4 sm:p-5 flex flex-col min-h-[160px]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 min-h-[56px]">{hostel.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">#{hostel.id}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {hostel.details && hostel.details.Capacity ?
                      `Capacity: ${hostel.details.Capacity} students` :
                      "Click for more details"}
                  </p>
                  <div className="flex justify-end mt-auto pt-2">
                    <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium flex items-center py-1.5 px-3 rounded-md group-hover:shadow-md transition-all duration-300 border border-blue-100">
                      View Details
                      
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Girls Hostel List Section */}
      <section className="bg-white py-12 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center mb-10">
            <div className="bg-pink-100 p-2 rounded-full mr-3">
              <img src={female} alt="Girls Hostel Icon" className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Girls <span className="text-pink-500">Hostels</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {girls_hostels.map((hostel) => (
              <div
                key={hostel.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group"
                onClick={() => openModal(hostel)}
              >
                <div className="bg-pink-500 h-2 w-full group-hover:h-3 transition-all duration-300"></div>
                <div className="p-4 sm:p-5 flex flex-col min-h-[160px]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 min-h-[56px]">{hostel.name}</h3>
                    <span className="bg-pink-100 text-pink-800 text-xs font-semibold px-2 py-1 rounded-full">#{hostel.id}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {hostel.details && hostel.details.Capacity ?
                      `Capacity: ${hostel.details.Capacity} students` :
                      "Click for more details"}
                  </p>
                  <div className="flex justify-end mt-auto pt-2">
                    <button className="bg-pink-50 hover:bg-pink-100 text-pink-500 hover:text-pink-700 text-xs sm:text-sm font-medium flex items-center py-1.5 px-3 rounded-md group-hover:shadow-md transition-all duration-300 border border-pink-100">
                      View Details
                      
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Contact Us Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-6" id="contact">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Contact <span className="text-blue-600">Us</span></h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">Get in Touch</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Our Location</h4>
                    <p className="text-gray-600">
                      National Institute of Technology Kurukshetra,<br />
                      Thanesar, Kurukshetra,<br />
                      Haryana 136119, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaPhone className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Phone</h4>
                    <p className="text-gray-600">+91-1744-233208, 233209</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                    <p className="text-gray-600">registrar@nitkkr.ac.in</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="rounded-lg shadow-lg overflow-hidden h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3446.778849499299!2d76.8131884748794!3d29.9597878749587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e38a3252b0c8b%3A0x549c1e81248c022c!2sNational%20Institute%20of%20Technology%2C%20Kurukshetra!5e0!3m2!1sen!2sin!4v1632937037973!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "350px" }}
                allowFullScreen=""
                loading="lazy"
                title="NIT Kurukshetra Map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer></Footer>

      {/* Hostel Details Modal */}
      {selectedHostel && (
        <HostelDetails hostel={selectedHostel} onClose={closeModal} />
      )}
      <TelegramAgentButton />
      <UniversalChatbot />
    </div>

  );
};

export default Landing;
