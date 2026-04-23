import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import { apiFetch } from "../lib/api";
import { addCartItem } from "../lib/cart";

function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await apiFetch(`/api/products/${slug}`);
      setProduct(data);
    };
    load().catch(() => setProduct(null));
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;
    addCartItem(product, quantity);
    setStatus("Added to cart successfully.");
  };

  if (!product) {
    return (
      <section className="container section">
        <p className="muted">Loading product details…</p>
      </section>
    );
  }

  return (
    <>
      <Seo title={`${product.name} | Apna Medical Hall`} description={product.description} path={`/products/${product.slug}`} />
      <section className="container section product-detail-page">
        <div className="product-detail-grid">
          <div className="product-preview-card">
            {product.imageUrl ? (
              <img className="product-preview-image" src={product.imageUrl} alt={product.name} />
            ) : (
              <div className="product-preview-fallback">Medicine preview</div>
            )}
            <div className="pill-row">
              <span className={`pill ${product.prescriptionRequired ? "pill-warning" : "pill-success"}`}>
                {product.prescriptionRequired ? "Prescription required" : "OTC medicine"}
              </span>
              <span className="pill">{product.category}</span>
            </div>
          </div>

          <div className="product-detail-copy">
            <span className="eyebrow">Pharmacy product details</span>
            <h1>{product.name}</h1>
            <p className="section-copy">{product.description}</p>
            <div className="price-row">
              <div>
                <p className="price-large">₹ {product.price}</p>
                <p className="muted">Inclusive of taxes</p>
              </div>
              <span className="pill pill-success">{product.stock > 0 ? `In stock` : "Out of stock"}</span>
            </div>

            <div className="action-row">
              <label className="quantity-control">
                Quantity
                <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5].map((val) => <option key={val} value={val}>{val}</option>)}
                </select>
              </label>
              <button type="button" className="button button-primary" onClick={handleAdd} disabled={product.stock < 1}>
                Add to cart
              </button>
            </div>
            {status ? <p className="status-message">{status}</p> : null}
            <div className="trust-grid">
              <div className="trust-card">
                <strong>Genuine brands</strong>
                <p>All medicines are sourced from verified suppliers.</p>
              </div>
              <div className="trust-card">
                <strong>Fast fulfillment</strong>
                <p>Orders prepared quickly for same-day dispatch.</p>
              </div>
              <div className="trust-card">
                <strong>Secure checkout</strong>
                <p>Privacy-focused order experience.</p>
              </div>
            </div>
            <div className="details-grid">
              <div>
                <h2>Uses</h2>
                <p>{product.description}</p>
              </div>
              <div>
                <h2>Dosage</h2>
                <p>{product.prescriptionRequired ? "Use as prescribed by your doctor." : "Take as directed and do not exceed the recommended dose."}</p>
              </div>
            </div>
            <button type="button" className="button button-secondary" onClick={() => navigate(-1)}>
              Back to products
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductPage;
