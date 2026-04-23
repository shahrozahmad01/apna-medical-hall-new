import { Helmet } from "react-helmet-async";

function Seo({ title, description, path = "/" }) {
  const siteUrl = import.meta.env.VITE_SITE_URL || "http://localhost:4173";
  const canonical = `${siteUrl}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
    </Helmet>
  );
}

export default Seo;
