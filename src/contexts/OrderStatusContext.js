import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../services/firebase';
import { useAuth } from './AuthContext';

// Create context
const OrderStatusContext = createContext();

// Custom hook to use the context
export const useOrderStatus = () => {
  return useContext(OrderStatusContext);
};

// Provider component
export const OrderStatusProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    toPay: 0,
    toShip: 0,
    toReceive: 0,
    toRate: 0
  });

  // Function to calculate counts for each category
  const calculateCounts = (ordersArray) => {
    const newCounts = {
      toPay: 0,
      toShip: 0,
      toReceive: 0,
      toRate: 0
    };

    ordersArray.forEach(order => {
      if (order.paymentMethod !== 'cash' && order.status === 'Pending') {
        newCounts.toPay++;
      } else if (['Accepted', 'Preparing'].includes(order.status)) {
        newCounts.toShip++;
      } else if (['Shipped', 'Out for Delivery'].includes(order.status)) {
        newCounts.toReceive++;
      } else if (order.status === 'Delivered' && !order.rated) {
        newCounts.toRate++;
      }
    });

    return newCounts;
  };

  // Set up real-time listener for orders
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const ordersRef = ref(database, `users/${currentUser.uid}/orders`);
    
    // Set up real-time listener
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const ordersArray = Object.keys(ordersData).map(key => ({
          id: key,
          ...ordersData[key]
        }));

        // Sort orders by date (newest first)
        ordersArray.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Update orders state
        setOrders(ordersArray);
        
        // Calculate and update counts
        const newCounts = calculateCounts(ordersArray);
        setCounts(newCounts);
      } else {
        setOrders([]);
        setCounts({
          toPay: 0,
          toShip: 0,
          toReceive: 0,
          toRate: 0
        });
      }
      
      setLoading(false);
    });

    // Clean up listener on unmount
    return () => {
      off(ordersRef);
    };
  }, [currentUser]);

  // Filter orders by category
  const getFilteredOrders = (category) => {
    switch(category) {
      case 'to-pay':
        return orders.filter(order => 
          order.paymentMethod !== 'cash' && order.status === 'Pending'
        );
      case 'to-ship':
        return orders.filter(order => 
          ['Accepted', 'Preparing'].includes(order.status)
        );
      case 'to-receive':
        return orders.filter(order => 
          ['Shipped', 'Out for Delivery'].includes(order.status)
        );
      case 'to-rate':
        return orders.filter(order => 
          order.status === 'Delivered' && !order.rated
        );
      default:
        return orders;
    }
  };

  // Context value
  const value = {
    orders,
    loading,
    counts,
    getFilteredOrders
  };

  return (
    <OrderStatusContext.Provider value={value}>
      {children}
    </OrderStatusContext.Provider>
  );
};

export default OrderStatusContext;
