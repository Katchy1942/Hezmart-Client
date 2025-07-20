import {createBrowserRouter, createRoutesFromElements, RouterProvider ,Route} from 'react-router-dom';


//Pages
import Home from './pages/Home';
import SellOnHezmart from './pages/SellOnHezmart';

//Layouts
import BaseLayout from './layouts/BaseLayout';
// import GuestLayout from './layouts/GuestLayout';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';

//Auth Pages
import VendorRegister from './pages/auth/VendorRegister';
import CustomerRegister from './pages/auth/CustomerRegister'
import ConfirmEmail from './pages/auth/ConfirmEmail';
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword';
import AuthCallback from './pages/auth/AuthCallBack';

//Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ShopManager from './pages/admin/ShopManager';
import AdminManageProducts from './pages/admin/AdminManageProducts';
import ManageCategories from './pages/admin/ManageCategories';
import AdminOrdersManager from './pages/admin/AdminOrdersManager';
import AdminOrderDetails from './pages/admin/OrderDetails'
import AdminManageCoupons from './pages/admin/AdminManageCoupons'
import CreateCoupon from './pages/admin/CreateCoupon';
import EditCoupon from './pages/admin/EditCoupon';
import CustomersManager from './pages/admin/CustomersManager';
import AdminSettings from './pages/admin/AdminSettings';
import Subscribers from './pages/admin/Subscribers';

//Vendor pages
import PendingVerification from './pages/vendor/PendingVerification';
import VendorDashboard from './pages/vendor/VendorDashbaord'
import VendorManageProducts from './pages/vendor/VendorManageProducts'
import AddProduct from './pages/vendor/AddProduct';
import EditProduct from './pages/vendor/EditProduct';
import VendorProductsPage from './pages/VendorProductsPage';
import VendorOrdersManager from './pages/vendor/VendorOrdersManager';
import VendorOrderDetails from './pages/vendor/VendorOrderDetails';
import VendorSettings from './pages/vendor/VendorSettings';

//Customer Pages;
import OrderPage from './pages/customer/OrderPage';
import OrderDetails from './pages/customer/OrderDetails';
import Profile from './pages/customer/Profile'
import WishlistPage from './pages/customer/WishListPage';

//Product Pages;
import ProductDetails from './pages/product/ProductDetails';
import CategoryProducts from './pages/CategoryProducts';

//Others
import NotFound from './pages/NotFound';
import Error from './components/Error';
import { requireAuth } from './utils/protect';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Shops from './pages/Shops';
import ReturnsRefundsPolicy from './pages/ReturnsRefundsPolicy';



function App() {


  const router = createBrowserRouter(createRoutesFromElements(
    
    <>

      <Route path='/' element={<BaseLayout />} errorElement={<Error />}>
        <Route index element={<Home />}></Route>
        {/* Auth routes */}
        <Route path='sell-on-hezmart' element={<SellOnHezmart />}></Route>
        <Route path='vendor-register' element={<VendorRegister />}></Route>
        <Route path='customer-register' element={<CustomerRegister />}></Route>
        <Route path='confirm-email' element={<ConfirmEmail />}></Route>
        <Route path='login' element={<Login />}></Route>
        <Route path='forgot-password' element={<ForgotPassword />}></Route>
        <Route path='resetPassword' element={<ResetPassword />}></Route>
       
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route path='shops' element={<Shops />}></Route>
        <Route path='returns-refunds-policy' element={<ReturnsRefundsPolicy />} />

        {/* Customer Routes */}
        <Route path='orders' element={<OrderPage />}></Route>
        <Route path='wishlist' element={<WishlistPage />}></Route>
        <Route path='orders/:id' element={<OrderDetails />}></Route>
        <Route path='profile' element={<Profile />}></Route>

        {/* Product Routes */}
        <Route path='/product/:id' element={<ProductDetails />}></Route>
        <Route path='/category/:categoryId/:subcategoryId?' element={<CategoryProducts />} />
        <Route path="/vendor/:vendorId" element={<VendorProductsPage />} />
        <Route path='cart' element={<Cart />}></Route>
        <Route path='checkout' element={<Checkout />} loader={async({ request }) => await requireAuth(request, 'customer')}></Route>
       
      </Route>

      <Route path='/manage' element={<AuthenticatedLayout />} errorElement={<Error />}>
        {/* Admin Routes */}
        <Route path='admin' loader={async({ request }) => await requireAuth(request, 'admin')}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='vendors' element={<ShopManager />} />
          <Route path='customers' element={<CustomersManager />}></Route>
          <Route path='products' element={<AdminManageProducts />} />
          <Route path='categories' element={<ManageCategories />}></Route>
          <Route path='orders' element={<AdminOrdersManager />}></Route>
          <Route path='orders/:orderId' element={<AdminOrderDetails />}></Route>
          <Route path='coupons' element={<AdminManageCoupons />}></Route>
          <Route path='create-coupon' element={<CreateCoupon />}></Route>
          <Route path='edit-coupon/:id' element={<EditCoupon />}></Route>
          <Route path='settings' element={<AdminSettings />}></Route>
          <Route path='subscribers' element={<Subscribers />}/>
        </Route>

        {/* Vendor Routes */}
        <Route path='vendor' loader={({ request }) => requireAuth(request, 'vendor')}>
          <Route path='dashboard' element={<VendorDashboard />} />
          <Route path='products' element={<VendorManageProducts />} />
          <Route path='add-product' element={<AddProduct />} ></Route>
          <Route path='edit-product/:id' element={<EditProduct />}></Route>
          <Route path='orders' element={<VendorOrdersManager />}></Route>
          <Route path='orders/:orderId' element={<VendorOrderDetails />}></Route>
          <Route path='settings' element={<VendorSettings />}></Route>

        </Route>
       

      </Route>

      <Route path='pending_verification' element={<PendingVerification />}></Route>
      <Route path="*" element={<NotFound />} />

    </>
  ))

  return (
    <RouterProvider router={router} />
  )
}

export default App
