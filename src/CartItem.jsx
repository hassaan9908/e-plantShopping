import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from './CartSlice';
import './CartItem.css';

function CartItem({ onContinueShopping }) {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const [showOrderComplete, setShowOrderComplete] = useState(false);

    const handleRemoveItem = (item) => {
        dispatch(removeItem(item));
    };

    const handleUpdateQuantity = (item, newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateQuantity({ name: item.name, quantity: newQuantity }));
        } else {
            handleRemoveItem(item);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.cost.replace('$', ''));
            return total + (price * item.quantity);
        }, 0);
    };

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            setShowOrderComplete(true);
            // Clear the cart after successful checkout
            cartItems.forEach(item => {
                dispatch(removeItem(item));
            });
        }
    };

    if (showOrderComplete) {
        return (
            <div className="order-complete-container">
                <h2>Order Complete! 🎉</h2>
                <p>Thank you for your purchase!</p>
                <p>Your order has been successfully placed.</p>
                <button 
                    className="continue-shopping-btn"
                    onClick={() => {
                        setShowOrderComplete(false);
                        onContinueShopping();
                    }}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    {cartItems.map((item, index) => (
                        <div key={index} className="cart-item">
                            <img src={item.image} alt={item.name} />
                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p className="cart-item-price">{item.cost}</p>
                                <div className="cart-item-quantity">
                                    <button 
                                        className="quantity-btn"
                                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button 
                                        className="quantity-btn"
                                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button 
                                className="remove-btn"
                                onClick={() => handleRemoveItem(item)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <div className="cart-total">
                        Total: ${calculateTotal().toFixed(2)}
                    </div>
                    <div className="cart-buttons">
                        <button 
                            className="continue-shopping-btn"
                            onClick={onContinueShopping}
                        >
                            Continue Shopping
                        </button>
                        <button 
                            className="checkout-btn"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartItem;


