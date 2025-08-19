import { logo, facebook, instagram, twitter, callIcon, message } from '../assets/images';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import InputField from './common/InputField';
import axios from '../lib/axios';
import { toast } from 'react-toastify';
import Button from "./../components/common/Button";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const[errors, setErrors] = useState({})
  const[processing, setProcessing] = useState(false)

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setProcessing(true)
    try{
      const formData = new FormData(e.target)
      const dataToSend =Object.fromEntries(formData)
      const res = await axios.post('api/v1/subscribers', dataToSend);
      if(res.data.status === 'success'){
        toast.success('Details submitted successfully');
        e.target.reset()
      }
    }catch(err){
      console.log(err);
      if (err.response) {
        if (err.response.data.message) {
          toast.error(err.response.data.message);
        }
        if (err.response.data.errors) {
          setErrors(err.response.data.errors);
        }
      } else {
        toast.error(err.response?.data?.message || 'Failed to submit details');
      }
      
    }finally{
      setProcessing(false)
    }
  }

  return (
    <div className='relative'>
      <footer className="lg:px-8 lg:py-6 p-4 bg-[#FCF4ED]">
        <div className="flex justify-between">
          <Link to='/'>
            <img src={logo} alt="logo" className='w-48' />
          </Link>
          <div className="flex items-center w-29 justify-between">
            <Link href="/">
              <img src={facebook} width={25} height={25} />
            </Link>
            <Link href="/">
              <img src={instagram} width={25} height={25} />
            </Link>
            <Link href="/">
              <img src={twitter} width={25} height={25} />
            </Link>
          </div>
        </div>

        {/* New Footer Links Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {/* Need Help Section */}
          <div className="footer-section">
            <h3 className="text-lg font-bold text-[#111827] mb-4">Need Help</h3>
            <ul className="space-y-2">
              <li><Link to="/chat" className="text-[#6B7280] hover:text-primary-dark">Chat with Us</Link></li>
              <li><Link to="/help-center" className="text-[#6B7280] hover:text-primary-dark">Help Center</Link></li>
              <li><Link to="/contact" className="text-[#6B7280] hover:text-primary-dark">Contact Us</Link></li>
            </ul>
          </div>

          {/* About Hezmart Section */}
          <div className="footer-section">
            <h3 className="text-lg font-bold text-[#111827] mb-4">About Hezmart</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-[#6B7280] hover:text-primary-dark">About Us</Link></li>
              <li><Link to="/privacy-policy" className="text-[#6B7280] hover:text-primary-dark">Privacy Notice</Link></li>
              <li><Link to="/" className="text-[#6B7280] hover:text-primary-dark">Terms and Conditions</Link></li>
              <li><Link to="/" className="text-[#6B7280] hover:text-primary-dark">Cookie Notice</Link></li>
            </ul>
          </div>

          {/* Useful Links Section */}
          <div className="footer-section">
            <h3 className="text-lg font-bold text-[#111827] mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-[#6B7280] hover:text-primary-dark">Dispute Resolution Policy</Link></li>
              <li><Link to="/returns-refunds-policy"  className="text-[#6B7280] hover:text-primary-dark">Return Policy</Link></li>
              <li><Link to="/" className="text-[#6B7280] hover:text-primary-dark">Pickup Stations</Link></li>
              <li><Link to="/" className="text-[#6B7280] hover:text-primary-dark">How to return a product</Link></li>
            </ul>
          </div>

           {/* Make Money Links Section */}
          <div className="footer-section">
            <h3 className="text-lg font-bold text-[#111827] mb-4">Make Money With Hezmart</h3>
            <ul className="space-y-2">
              <li><Link to="/sell-on-hezmart" className="text-[#6B7280] hover:text-primary-dark">Sell on Hezmart</Link></li>
              
            </ul>
          </div>
        </div>

        <hr className='mt-16 mb-2 border-[#e0d8d0]' />
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div>
            <p className="text-[#111827] text-sm">Do You Need Help ?</p>
            <div className="flex gap-x-4 mt-8">
              <img src={callIcon} alt="call-icon" width={25} height={25} />
              <div className="flex flex-col">
                <small className="text-[#111827] text-sm">
                  Monday-Friday: 08am-9pm
                </small>
                <Link className='font-semibold text-[#111827]' to='tel:+2349160002490'>
                  +234 9160002490
                </Link>
                
              </div>
            </div>
            <div className="flex gap-x-4 mt-8">
              <img src={message} alt="call-icon" width={28} height={28} />
              <div className="flex flex-col">
                <small className="text-[#111827]">
                  Need help with your order?
                </small>
                <Link to='mailto:hezmartng@gmail.com' className="font-semibold text-[#111827]">
                  hezmartng@gmail.com
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mt-5">
              <h5 className="text-lg font-bold text-[#111827]">
                Join our newsletter
              </h5>
              <p className="text-[10px] text-[#6B7280] mt-2">
                Register now to get latest updates on promotions &
                coupons.Don&apos;t worry, we not spam!
              </p>
            </div>
            <form
              className="w-full  max-w-80 mt-5 mb-2"
              onSubmit={handleSubmit}
            >
              <InputField
                name="name"
                label="Name"
                placeholder='Please enter your name'
                classNames='bg-white mb-3'
                error={errors.name}
              />

              <InputField
                name="email"
                label="Email"
                placeholder='Please enter your email'
                classNames='bg-white mb-3'
                error={errors.email}
              />
              <div className="flex justify-end">
                <Button 
                  type="submit"
                  variant="primary"
                  isLoading={processing}
                  disabled={processing}
                  loadingText="Processing..."
                >
                  Subscribe
                </Button>
              </div>
             
            </form>
            <small className="text-[#6B7280] text-xs">
              By subscribing you agree to our&nbsp;
              <Link
                href="/"
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-primary-dark"
              >
                Terms & Conditions and Privacy
              </Link>
            </small>
          </div>
        </div>
      </footer>
      <div className="py-1 flex justify-center bg-primary-light">
        <h3 className="text-white">&copy; {new Date().getFullYear()} Hezmart</h3>
      </div>

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 bg-primary-light text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-colors duration-300 focus:outline-none"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default Footer;