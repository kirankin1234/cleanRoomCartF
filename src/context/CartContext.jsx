import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Load cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.name === item.name);
      if (existingItemIndex !== -1) {
        // Update the quantity of the existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      }

      const existingItem = prevItems.find((i) => i.key === item.key);

      if (existingItem) {
        alert("This item is already in your cart!"); // Show alert if item exists
        return prevItems; // Do not add the duplicate item
      }
  
      // Assign a unique key when adding a new item
      return [...prevItems, { ...item, key: Date.now().toString() }];

      // fetch("http://localhost:5001/api/interested-users/add", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ user, product: item }),
      // }).catch((error) => console.error("Error saving interested user:", error));
      // return [...prevItems, newItem];
    });
  };
  

  return (
    <CartContext.Provider value={{ cartItems, addToCart, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
