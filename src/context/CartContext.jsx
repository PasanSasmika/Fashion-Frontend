export const getCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const addToCart = (item) => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.productId === item.productId && cartItem.size === item.size
  );
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
};