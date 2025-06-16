
import { logo, facebook,instagram, twitter, callIcon, message } from '../assets/images';
import { Link } from 'react-router-dom';


const  Footer = ()=> {
  

  return (
    <div className=''>
      <footer className="lg:px-20 lg:py-6 p-4  bg-[#FCF4ED]">
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
        <hr className='mt-16 mb-2 border-[#e0d8d0]'/>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div>
            <p className="text-[#111827] text-sm">Do You Need Help ?</p>
            <div className="flex gap-x-4 mt-8">
              <img src={callIcon} alt="call-icon" width={25} height={25} />
              <div className="flex flex-col">
                <small className="text-[#111827] text-sm">
                  Monday-Friday: 08am-9pm
                </small>
                <h6 className="text-lg font-semibold text-[#111827]">
                  +234 901345502
                </h6>
              </div>
            </div>
            <div className="flex gap-x-4 mt-8">
              <img src={message} alt="call-icon" width={28} height={28} />
              <div className="flex flex-col">
                <small className="text-[#111827]">
                  Need help with your order?
                </small>
                <h6 className="text-lg font-semibold text-[#111827]">
                  Herztmart@gmail.com
                </h6>
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
              
              className="w-full flex max-w-80 mt-5 mb-2"
            >
              <input
                register={"...email"}
                type="email"
                placeholder="Your Email"
                className="py-2 px-5 bg-white w-2/3"
              />
              <button className="text-white w-1/3 rounded-r-sm bg-gradient-to-r from-primary-light to-primary-dark py-2">
                <Link href="/">Subscribe</Link>
              </button>
             
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
          <Link to='' className="text-[#737373]  mt-5 mb-25">Privacy Policy</Link>
        </div>
      </footer>
      <div className="py-1 flex justify-center bg-primary-light">
        <h3 className=" text-white">&copy; {new Date().getFullYear()} Hezmart</h3>
      </div>
    </div>
  );
}

export default Footer
