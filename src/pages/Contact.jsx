import { motion, AnimatePresence } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaWhatsapp, FaCheckCircle, FaExclamationCircle, FaTiktok } from 'react-icons/fa';
import { useState, useRef } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyInterest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const messageRef = useRef(null);
  const formContainerRef = useRef(null);

  const scrollToMessage = () => {
    const yOffset = -20;
    const y = formContainerRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Format the message for WhatsApp
      const whatsappMessage = `New Contact Form Submission:%0A%0A
        Name: ${formData.name}%0A
        Email: ${formData.email}%0A
        Phone: ${formData.phone}%0A
        Inquiry Type: ${formData.propertyInterest}%0A
        Message: ${formData.message}`;

      // Open WhatsApp with pre-filled message
      window.open(`https://wa.me/2349160002490?text=${whatsappMessage}`, '_blank');
      
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        propertyInterest: ''
      });
      
      setTimeout(scrollToMessage, 100);
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError('Failed to open WhatsApp. Please try again later.');
      setTimeout(scrollToMessage, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-dark to-primary-light py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold sm:text-5xl mb-2"
          >
            Connect With Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto"
          >
           Get Expert Assistance for Seamless Shopping
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-lg max-w-3xl mx-auto"
          >
           If you have inquiries or need assistance, do not hesitate to chat with us, or give us a call.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            ref={formContainerRef}
          >
            <div className="p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              
              {/* Response Messages */}
              <div ref={messageRef} className="mb-6">
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-green-50 text-green-700 rounded-lg flex items-start"
                    >
                      <FaCheckCircle className="text-green-500 text-xl mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">Message Ready to Send!</h4>
                        <p className="text-sm mt-1">Your message will open in WhatsApp for sending.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start"
                  >
                    <FaExclamationCircle className="text-red-500 text-xl mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold">Submission Error</h4>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    placeholder='Enter Full Name'
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-light focus:outline-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      placeholder='Enter Email'
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-light focus:outline-none"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      placeholder='Enter Phone Number'
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-light focus:outline-none"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="propertyInterest" className="block text-sm font-medium text-gray-700 mb-1">
                   Type of Inquiry
                  </label>
                  <select
                    id="propertyInterest"
                    name="propertyInterest"
                    value={formData.propertyInterest}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-light focus:outline-none"
                    disabled={isSubmitting}
                  >
                    <option value="">Select an option</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Order">Order</option>
                    <option value="Return/Cancel Order">Return/Cancel Order</option>
                    <option value="Website and Account">Website and Account</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder='Enter your message'
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-light focus:outline-none"
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  type="submit"
                  className="cursor-pointer w-full bg-primary-light hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Preparing...
                    </>
                  ) : (
                    'Send via WhatsApp'
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-8 sm:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  {/* Headquarters */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Headquarters</h3>
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 bg-primary-light/10 p-3 rounded-lg">
                        <FaMapMarkerAlt className="h-6 w-6 text-primary-light" />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-600">189 Ugwuaji Road, Maryland, Enugu</p>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 bg-primary-light/10 p-3 rounded-lg">
                        <FaWhatsapp className="h-6 w-6 text-primary-light" />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-600">
                          <a href="https://wa.me/2349160002490" className="hover:text-primary-light transition-colors">
                            +234 916-000-2490 (WhatsApp)
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 bg-primary-light/10 p-3 rounded-lg">
                        <FaPhone className="h-6 w-6 text-primary-light" />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-600">
                          <a href="tel:09160002490" className="hover:text-primary-light transition-colors">
                            +234 091-600-02490 (Phone/Text)
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 bg-primary-light/10 p-3 rounded-lg">
                        <FaEnvelope className="h-6 w-6 text-primary-light" />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-600">
                          <a href="mailto:hezmartng@gmail.com" className="hover:text-primary-light transition-colors">
                           hezmartng@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Branch Office */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Branch Office</h3>
                    <div className="flex items-start mb-4">
                      <div className="flex-shrink-0 bg-primary-light/10 p-3 rounded-lg">
                        <FaMapMarkerAlt className="h-6 w-6 text-primary-light" />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-600">No 189 Ugwuaji Road, Maryland Plaza, Enugu State</p>
                      </div>
                    </div>

                    <div className="flex items-start mb-4">
                      <div className="flex-shrink-0 bg-primary-light/10 p-3 rounded-lg">
                        <FaWhatsapp className="h-6 w-6 text-primary-light" />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-600">
                          <a href="https://wa.me/2349160002490" className="hover:text-primary-light transition-colors">
                            +234 916-000-2490 (WhatsApp)
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-primary-light/10 p-3 rounded-lg">
                        <FaEnvelope className="h-6 w-6 text-primary-light" />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-600">
                          <a href="mailto:hezmartng@gmail.com" className="hover:text-primary-light transition-colors">
                            hezmartng@gmail.com
                          </a>
                        </p>
                       
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="https://web.facebook.com/profile.php?id=61566347349473" target='_blank' className="text-gray-400 hover:text-primary-light transition-colors">
                      <FaFacebook className="h-6 w-6" />
                    </a>
                 
                    <a href="https://www.instagram.com/hezmart_ng/?igsh=bzYwY2c1YmxhcDlo#" target='_blank' className="text-gray-400 hover:text-primary-light transition-colors">
                      <FaInstagram className="h-6 w-6" />
                    </a>
                    <a href="https://www.tiktok.com/@hezmart.com?_t=ZS-8z4XfDw4EXy&_r=1" target='_blank' className="text-gray-400 hover:text-primary-light transition-colors">
                      <FaTiktok className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;