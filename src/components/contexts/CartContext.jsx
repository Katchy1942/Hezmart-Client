import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../../lib/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({
        items: [],
        shippingOptions: [],
        summary: { 
            totalItems: 0, 
            subtotal: 0,
            discount: 0,
            deliveryFee: 0,
            tax: 0,
            total: 0 
        },
        loading: false,
        error: null
    });

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        setCartCount(cart.summary.totalItems);
    }, [cart.summary.totalItems]);

    const fetchCart = async () => {
        try {
            setCart(prev => ({ ...prev, loading: true }));
            const response = await axios.get('api/v1/cart');
            const { items, summary, shippingOptions } = response.data.data;
            
            setCart({
                items: items || [],
                shippingOptions: shippingOptions || [],
                summary: summary || { 
                totalItems: 0, 
                subtotal: 0,
                discount: 0,
                deliveryFee: 0,
                tax: 0,
                total: 0 
                },
                loading: false,
                error: null
            });
        } catch (error) {
            setCart(prev => ({
                ...prev,
                loading: false,
                error: error.response?.data?.message || 'Failed to fetch cart'
            }));
        };
    };

    const addToCart = async (product, quantity, options) => {
        try {
            setCart(prev => ({ ...prev, loading: true }));
            const response = await axios.post('api/v1/cart', {
                productId: product.id,
                quantity,
                options
            });

            await fetchCart();
            
            return { success: true, data: response.data };
        } catch (error) {
            setCart(prev => ({
                ...prev,
                loading: false,
                error: error.response?.data?.message || 'Failed to add item to cart'
            }));
            
            return { success: false, error: error.response?.data };
        };
    };

    const removeFromCart = async (productId) => {
        try {
        setCart(prev => ({ ...prev, loading: true }));
        const response = await axios.delete(`api/v1/cart/item/${productId}`);
    
        setCart(prev => ({
            ...prev,
            items: prev.items.filter(item => item.productId !== productId),
            summary: response.data.data.summary,
            loading: false,
            error: null
        }));
    
        return { success: true };
        } catch (error) {
        setCart(prev => ({
            ...prev,
            loading: false,
            error: error.response?.data?.message || 'Failed to remove item'
        }));
        return { success: false, error: error.response?.data };
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
        if (newQuantity < 1) {
            return { success: false, error: { message: 'Quantity must be at least 1' } };
        }
    
        setCart(prev => ({ ...prev, loading: true }));
        const response = await axios.patch(`api/v1/cart/item/${productId}`, {
            quantity: newQuantity
        });
    
        setCart(prev => ({
            ...prev,
            items: prev.items.map(item => 
            item.productId === productId 
                ? { ...item, quantity: newQuantity } 
                : item
            ),
            summary: response.data.data.summary,
            loading: false,
            error: null
        }));
    
        return { success: true, data: response.data };
        }   catch (error) {
                setCart(prev => ({
                    ...prev,
                    loading: false,
                    error: error.response?.data?.message || 'Failed to update quantity'
                }));
            return { success: false, error: error.response?.data };
        }
    };

    const clearCart = async () => {
        try {
        setCart(prev => ({ ...prev, loading: true }));
        await axios.delete('api/v1/cart/clear');

        await fetchCart();
        
        return { success: true };
        } catch (error) {
        setCart(prev => ({
            ...prev,
            loading: false,
            error: error.response?.data?.message || 'Failed to clear cart'
        }));
        return { success: false, error: error.response?.data };
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            cartCount,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};