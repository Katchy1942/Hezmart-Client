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


//Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import ShopManager from './pages/admin/ShopManager';
import AdminManageProducts from './pages/admin/AdminManageProducts';
import ManageCategories from './pages/admin/ManageCategories';
import AdminOrdersManager from './pages/admin/AdminOrdersManager';
import AdminOrderDetails from './pages/admin/OrderDetails'


//Vendor pages
import PendingVerification from './pages/vendor/PendingVerification';
import VendorDashboard from './pages/vendor/Dashboard'
import VendorManageProducts from './pages/vendor/VendorManageProducts'
import AddProduct from './pages/vendor/AddProduct';
import EditProduct from './pages/vendor/EditProduct';

//Customer Pages;
import OrderPage from './pages/customer/OrderPage';

//Product Pages;
import ProductDetails from './pages/product/ProductDetails';
import CategoryProducts from './pages/CategoryProducts';


//Others
import NotFound from './pages/NotFound';
import Error from './components/Error';
import { requireAuth } from './utils/protect';
import Cart from './pages/Cart';
import Shops from './pages/Shops';
import VendorProductsPage from './pages/VendorProductsPage';








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

        <Route path='shops' element={<Shops />}></Route>

        {/* Customer Routes */}
        <Route path='orders' element={<OrderPage />}></Route>

        {/* Product Routes */}
        <Route path='/product/:id' element={<ProductDetails />}></Route>
        <Route path='/category/:categoryId/subcategory/:subcategoryId' element={<CategoryProducts />}></Route>
        <Route path="/vendor/:vendorId" element={<VendorProductsPage />} />

        <Route path='cart' element={<Cart />}></Route>
       
      </Route>

      <Route path='/manage' element={<AuthenticatedLayout />} errorElement={<Error />}>
        {/* Admin Routes */}
        <Route path='admin' loader={async({ request }) => await requireAuth(request, 'admin')}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='vendors' element={<ShopManager />} />
          <Route path='products' element={<AdminManageProducts />} />
          <Route path='categories' element={<ManageCategories />}></Route>
          <Route path='orders' element={<AdminOrdersManager />}></Route>
          <Route path='orders/:orderId' element={<AdminOrderDetails />}></Route>
        </Route>

        {/* Vendor Routes */}
        <Route path='vendor' loader={({ request }) => requireAuth(request, 'vendor')}>
          <Route path='dashboard' element={<VendorDashboard />} />
          <Route path='products' element={<VendorManageProducts />} />
          <Route path='add-product' element={<AddProduct />} ></Route>
          <Route path='edit-product/:id' element={<EditProduct />}></Route>

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
