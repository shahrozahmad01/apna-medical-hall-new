const CART_KEY = "amph-cart";
const CART_EVENT = "amph-cart-updated";

const parseCart = (value) => {
  try {
    return JSON.parse(value || "[]");
  } catch {
    return [];
  }
};

const broadcastCart = (items) => {
  localStorage.setItem("amph-cart-count", items.reduce((sum, item) => sum + Number(item.quantity || 0), 0));
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: items }));
  return items;
};

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  return broadcastCart(items);
};

const getCart = () => parseCart(localStorage.getItem(CART_KEY));

const getCartCount = () => getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);

const getCartTotal = () => getCart().reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

const addCartItem = (product, quantity = 1) => {
  const items = getCart();
  const match = items.find((item) => item.slug === product.slug);
  if (match) {
    match.quantity = Math.min(match.quantity + quantity, 10);
  } else {
    items.push({
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      prescriptionRequired: product.prescriptionRequired,
      quantity
    });
  }
  return saveCart(items);
};

const updateCartItem = (slug, quantity) => {
  const items = getCart().map((item) =>
    item.slug === slug ? { ...item, quantity: Math.max(1, Math.min(quantity, 20)) } : item
  );
  return saveCart(items);
};

const removeCartItem = (slug) => saveCart(getCart().filter((item) => item.slug !== slug));

const clearCart = () => saveCart([]);

export { getCart, getCartCount, getCartTotal, addCartItem, updateCartItem, removeCartItem, clearCart };
