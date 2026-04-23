import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import { apiFetch } from "../lib/api";
import { getCart, clearCart, getCartTotal } from "../lib/cart";

function Checkout() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("COD");
  const [form, setForm] = useState({ fullname: "", email: "", phone: "", address: "", city: "", state: "", postalCode: "" });

  const items = getCart();
  const subtotal = getCartTotal();

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!items.length) {
      setStatus("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({ items, notes: `Checkout via ${method}` })
      });
      clearCart();
      setStatus("Order placed successfully. Thank you for choosing Apna Medical Hall.");
      setTimeout(() => navigate("/"), 1800);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Checkout | Apna Medical Hall" description="Complete your order with delivery details and payment options." path="/checkout" />
      <section className="container section checkout-page">
        <div className="checkout-grid">
          <div className="checkout-form-panel">
            <span className="eyebrow">Checkout</span>
            <h1>Delivery details</h1>
            <p className="section-copy">Fill in your address and choose a payment method to complete the order.</p>
            <form className="form checkout-form" onSubmit={handleSubmit}>
              <input name="fullname" value={form.fullname} onChange={handleChange} placeholder="Full name" required />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone number" required />
              <textarea name="address" value={form.address} onChange={handleChange} placeholder="Delivery address" rows="4" required />
              <div className="field-row">
                <input name="city" value={form.city} onChange={handleChange} placeholder="City" required />
                <input name="state" value={form.state} onChange={handleChange} placeholder="State" required />
              </div>
              <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal code" required />
              <div className="radio-group">
                <label>
                  <input type="radio" name="payment" value="COD" checked={method === "COD"} onChange={() => setMethod("COD")} />
                  Cash on Delivery
                </label>
                <label>
                  <input type="radio" name="payment" value="Online" checked={method === "Online"} onChange={() => setMethod("Online")} />
                  Online payment (placeholder)
                </label>
              </div>
              <button type="submit" className="button button-primary" disabled={loading}>
                {loading ? "Placing order…" : `Pay ₹ ${subtotal.toFixed(0)}`}
              </button>
              {status ? <p className="status-message">{status}</p> : null}
            </form>
          </div>

          <aside className="checkout-summary-panel">
            <div className="summary-card">
              <span className="eyebrow">Order summary</span>
              <h2>₹ {subtotal.toFixed(0)}</h2>
              <p className="muted">{items.length} items in cart</p>
              <ul className="summary-list">
                {items.map((item) => (
                  <li key={item.slug} className="summary-line">
                    <span>{item.name} × {item.quantity}</span>
                    <strong>₹ {(item.price * item.quantity).toFixed(0)}</strong>
                  </li>
                ))}
              </ul>
              <div className="summary-line summary-total">
                <span>Total</span>
                <strong>₹ {subtotal.toFixed(0)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Checkout;
