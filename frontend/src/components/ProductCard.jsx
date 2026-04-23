import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-card-link">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-card-placeholder">Medicine</div>
        )}
        <div className="product-card-content">
          <div className="pill pill-success">{product.category}</div>
          <h3>{product.name}</h3>
          <p className="muted">{product.description}</p>
          <p className="price">₹ {product.price}</p>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
