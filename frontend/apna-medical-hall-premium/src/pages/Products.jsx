import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Seo from "../components/Seo";
import { apiFetch } from "../lib/api";

const categories = ["All", "General Care", "Wellness", "Vitamins", "Skin Care"];

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      const query = new URLSearchParams({
        search,
        category,
        page: String(page),
        limit: "8"
      });
      const data = await apiFetch(`/api/products?${query.toString()}`);
      setProducts(data.items || []);
      setPages(data.pagination?.totalPages || 1);
    };
    load().catch(() => setProducts([]));
  }, [search, category, page]);

  return (
    <>
      <Seo title="Products | Apna Medical Hall" description="Browse medicines and pharmacy essentials." path="/products" />
      <section className="container section">
        <div className="section-title">
          <h2>Medicine catalog</h2>
          <span className="muted">Find trusted products, exact pricing, and prescription guidance.</span>
        </div>

        <div className="filters">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicine or symptom" />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="product-grid">
          {products.length ? products.map((product) => <ProductCard key={product.slug} product={product} />) : (
            <div className="empty-state-card">
              <h3>No products found</h3>
              <p className="muted">Try another keyword or category.</p>
            </div>
          )}
        </div>

        <div className="pager">
          <button type="button" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>Previous</button>
          <span>{page} / {pages}</span>
          <button type="button" disabled={page >= pages} onClick={() => setPage((prev) => prev + 1)}>Next</button>
        </div>
      </section>
    </>
  );
}

export default Products;
