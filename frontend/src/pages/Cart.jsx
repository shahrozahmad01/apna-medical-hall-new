import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import { getCart, removeCartItem, updateCartItem, getCartTotal } from "../lib/cart";

function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const handleQuantity = (slug, quantity) => {
    const updated = updateCartItem(slug, quantity);
    setItems(updated);
  };

  const handleRemove = (slug) => {
    const updated = removeCartItem(slug);
    setItems(updated);
  };

  if (!items.length) {
    return (
      <section className="container section">
        <Seo title="Cart | Apna Medical Hall" description="View your cart and continue to checkout." path="/cart" />
        <div className="empty-state-card">
          <h2>Your cart is empty</h2>
          <p className="muted">Add pharmacy products from the catalog to start your order.</p>
          <Link className="button button-primary" to="/products">Browse products</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo title="Cart | Apna Medical Hall" description="View your cart and continue to checkout." path="/cart" />
      <section className="container section cart-page">
        <div className="cart-grid">
          <div className="cart-panel">
            <div className="cart-header">
              <span className="eyebrow">Your order</span>
              <h1>Shopping cart</h1>
            </div>
            {items.map((item) => (
              <div className="cart-item" key={item.slug}>
                <img className="cart-image" src={item.imageUrl || "https://via.placeholder.com/90"} alt={item.name} />
                <div className="cart-item-copy">
                  <h3>{item.name}</h3>
                  <p className="muted">{item.category}</p>
                  <div className="cart-actions">
                    <select value={item.quantity} onChange={(e) => handleQuantity(item.slug, Number(e.target.value))}>
                      {[1, 2, 3, 4, 5].map((qty) => <option key={qty} value={qty}>{qty}</option>)}
                    </select>
                    <button type="button" className="link-button" onClick={() => handleRemove(item.slug)}>
                      Remove
                    </button>
                  </div>
                </div>
                <div className="cart-price">₹ {(item.price * item.quantity).toFixed(0)}</div>
              </div>
            ))}
          </div>
          <aside className="checkout-panel">
            <div className="summary-card">
              <span className="eyebrow">Order summary</span>
              <h2>{items.length} items</h2>
              <p className="summary-line">
                <span>Subtotal</span>
                <strong>₹ {getCartTotal().toFixed(0)}</strong>
              </p>
              <p className="muted">Shipping and taxes calculated at checkout.</p>
              <button type="button" className="button button-primary" onClick={() => navigate("/checkout")}>Proceed to checkout</button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Cart;
