import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import { useCart } from '../components/contexts/CartContext';
import { toast } from 'react-toastify';
import axios from '../lib/axios';
import CartItemsList from '../components/cart/CartItemsList';
import CartSummary from '../components/cart/CartSummary';
import CartEmptyState from '../components/cart/CartEmptyState';
import CustomerAddressSection from '../components/cart/CustomerAddressSection';
import DeliveryOptionSection from '../components/cart/DeliveryOptionSection';
import PaymentMethodSection from '../components/cart/PaymentMethodSection';

const Checkout = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart();
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [selectedPickupStation, setSelectedPickupStation] = useState('');
  const [selectedStateFee, setSelectedStateFee] = useState('');
  const [shippingSettings, setShippingSettings] = useState({});
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cryptoWallets, setCryptoWallets] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState(null);

  // Fetch user data
  const getUser = async () => {
    try {
      const res = await axios.get('api/v1/users/me');
      if (res.data.status === 'success') {
        setCurrentUser(res.data.user);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch user data');
    }
  };

  // Fetch shipping settings
  const getShippingSettings = async () => {
    try {
      const res = await axios.get('api/v1/shipping-settings/active');
      if (res.data.status === 'success') {
        setShippingSettings(res.data.data.settings);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch shipping settings');
    }
  };

  // Initial data loading
  useEffect(() => {
    const fetchData = async () => {
      await fetchCart();
      await getShippingSettings();
      await getUser();
    };

    fetchData();
  }, []);

  // Set selected address when currentUser changes
  useEffect(() => {
    if (currentUser && 
        currentUser.firstName && 
        currentUser.lastName && 
        currentUser.primaryPhone && 
        currentUser.state && 
        currentUser.email && 
        currentUser.primaryAddress) {
      setSelectedAddress({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        primaryPhone: currentUser.primaryPhone,
        state: currentUser.state,
        email: currentUser.email,
        primaryAddress: currentUser.primaryAddress,
      });
    }
  }, [currentUser]);

  const handleStateSelected = ({ state, fee }) => {
    setDeliveryFee(fee);
  };

  const handlePickupStationSelected = ({ stationId, fee }) => {
    setSelectedPickupStation(stationId);
    setDeliveryFee(fee);
  };

  const handleCheckout = async (selectedShipping) => {
    if (!currentUser) {
      toast.error('Please login to proceed to checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    const isValidAddress = selectedAddress && 
      selectedAddress.firstName && 
      selectedAddress.lastName && 
      selectedAddress.primaryPhone && 
      selectedAddress.state && 
      selectedAddress.primaryAddress &&
      selectedAddress.email;

    if (!isValidAddress) {
      toast.error('Please provide complete delivery address information');
      return;
    }

    if (!deliveryOption) {
      toast.error('Please select a delivery option');
      return;
    }

    if (deliveryOption === 'pickup' && !selectedPickupStation) {
      toast.error('Please select a pickup station');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (paymentMethod === 'crypto' && !selectedWallet) {
      toast.error('Please select a crypto wallet');
      return;
    }

    const allAvailable = cart.items?.every(item => item.available) ?? false;
    if (!allAvailable) {
      toast.error('Some items in your cart are no longer available');
      fetchCart();
      return;
    }

    setCheckoutLoading(true);

    try {
      const payload = {
        shippingOptionId: selectedShipping,
        deliveryAddress: selectedAddress,
        deliveryOption,
        paymentMethod,
        ...(deliveryOption === 'door' && { selectedStateId: selectedStateFee.id }),
        ...(deliveryOption === 'pickup' && { pickupStationId: selectedPickupStation }),
        ...(paymentMethod === 'crypto' && { 
          cryptoPayment: true,
          cryptoWalletId: selectedWallet.id
        })
      };
      const endpoint = paymentMethod === 'crypto' ? 'crypto-checkout' : 'checkout-session';
      const response = await axios.post(`api/v1/orders/${endpoint}`, payload);

      if (paymentMethod === 'prepay' && response.data.status === 'success') {
        window.location.href = response.data.data.checkoutUrl;
      } else if (paymentMethod === 'crypto' && response.data.status === 'success') {
        navigate('/orders');
        toast.success('Please make payment to the provided crypto wallet address');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate checkout');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (cart.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
      </div>
    );
  }

  if (cart.error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="text-red-500">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{cart.error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return <CartEmptyState />;
  }

  const { items = [], summary = {}, shippingOptions = [] } = cart;
  const allItemsAvailable = items.every(item => item.available);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/cart" className="flex text-sm items-center text-primary-light hover:text-primary-dark">
          <FiChevronLeft className="mr-1" /> Modify Cart
        </Link>
        <h1 className="text-sm lg:text-2xl font-bold text-gray-900 ml-6">Checkout</h1>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className='lg:col-span-8 space-y-6'>
          <CustomerAddressSection 
            currentUser={currentUser} 
            selectedAddress={selectedAddress} 
            setSelectedAddress={setSelectedAddress}
          />

          <DeliveryOptionSection
            deliveryOption={deliveryOption}
            setDeliveryOption={setDeliveryOption}
            deliveryFee={deliveryFee}
            setDeliveryFee={setDeliveryFee}
            selectedPickupStation={selectedPickupStation}
            setSelectedPickupStation={setSelectedPickupStation}
            setSelectedStateFee={setSelectedStateFee}
            shippingSettings={shippingSettings}
            onStateSelected={handleStateSelected}
            onPickupStationSelected={handlePickupStationSelected}
          />
          
          <PaymentMethodSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cryptoWallets={cryptoWallets}
            setSelectedWallet={setSelectedWallet}
            selectedWallet={selectedWallet}
          />

          <CartItemsList 
            items={items} 
            onQuantityChange={updateQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
          />
        </div>
      
        <div className='lg:col-span-4 mt-6 lg:mt-0'>
          <CartSummary
            summary={summary}
            shippingOptions={shippingOptions}
            selectedAddress={selectedAddress}
            currentUser={currentUser}
            onCheckout={handleCheckout}
            checkoutLoading={checkoutLoading}
            allItemsAvailable={allItemsAvailable}
            deliveryOption={deliveryOption}
            deliveryFee={deliveryFee}
            paymentMethod={paymentMethod}
            selectedWallet={selectedWallet}
            selectedPickupStation={selectedPickupStation}
            selectedStateFee={selectedStateFee}
            shippingSettings={shippingSettings}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;