import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const categories = [
  { label: "General Care", icon: "🩺" },
  { label: "Wellness", icon: "🌿" },
  { label: "Vitamins", icon: "💊" },
  { label: "Skin Care", icon: "✨" }
];

function Home() {
  return (
    <>
      <Seo title="Apna Medical Hall | Home" description="Your premium online pharmacy for fast medicine delivery." path="/" />
      <section className="container hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Your Health, Our Priority</span>
            <h1 className="hero-title">Trusted pharmacy care with modern convenience.</h1>
            <p className="hero-text">Upload your prescription, browse verified medicines, and check out with confidence. Apna Medical Hall brings wellness to your doorstep.</p>
            <div className="search-panel">
              <input className="search-field" type="search" placeholder="Search medicine, vitamins, care" />
              <Link className="button button-primary" to="/products">Browse products</Link>
            </div>
            <div className="hero-cta">
              <div className="card">
                <strong>Fast prescription upload</strong>
                <p>Securely upload your doctor’s prescription in seconds.</p>
              </div>
              <div className="card">
                <strong>Verified pharmacy trust</strong>
                <p>Licensed products and reliable order support.</p>
              </div>
            </div>
          </div>
          <div className="card hero-card">
            <span className="eyebrow">Upload Prescription</span>
            <h2>Need medicine on prescription?</h2>
            <p className="section-copy">Upload your prescription and our pharmacy team will review it for safe fulfillment.</p>
            <Link className="button button-primary" to="/upload-prescription">Upload now</Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-title">
          <h2>Shop by category</h2>
          <Link className="link-button" to="/products">See all</Link>
        </div>
        <div className="categories">
          {categories.map((item) => (
            <article key={item.label} className="category-card">
              <div className="category-icon">{item.icon}</div>
              <div className="category-copy">
                <strong>{item.label}</strong>
                <p className="muted">Browse premium essentials</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-title">
          <h2>Popular products</h2>
          <Link className="link-button" to="/products">View all</Link>
        </div>
        <div className="product-grid">
          {[
            { name: "Vitamin C Tablets", slug: "vitamin-c-tablets", price: 350, category: "Vitamins", description: "Immunity support for daily wellness." },
            { name: "Pain Relief Gel", slug: "pain-relief-gel", price: 225, category: "Skin Care", description: "Fast soothing relief for stiff muscles." },
            { name: "Cough Syrup", slug: "cough-syrup", price: 280, category: "General Care", description: "Gentle cough relief for the whole family." }
          ].map((item) => (
            <article key={item.slug} className="product-card">
              <div className="product-card-content">
                <span className="pill pill-success">{item.category}</span>
                <h3>{item.name}</h3>
                <p className="muted">{item.description}</p>
                <p className="price">₹ {item.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <a className="whatsapp-floating" href="https://wa.me/918084469086?text=Hello%2C%20I%20need%20pharmacy%20assistance" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        💬
      </a>
    </>
  );
}

export default Home;
