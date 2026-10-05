import { comparisonProducts } from "@/lib/products";

export default function Comparison() {
  return (
    <section className="comparison section-shell" id="compare">
      <div className="section-kicker">COMPARE DEVICES</div>
      <div className="section-heading-row">
        <div>
          <h2>See the differences that matter.</h2>
          <p>
            The final engine will normalize specifications across brands so customers can compare
            equivalent fields instead of reading incompatible marketing tables.
          </p>
        </div>
        <button className="dark-button">Show only differences</button>
      </div>

      <div className="comparison-grid">
        {comparisonProducts.map((product, index) => (
          <article className={index === 0 ? "compare-card selected" : "compare-card"} key={product.name}>
            <span className="compare-badge">{product.subtitle}</span>
            <h3>{product.name}</h3>
            <div className="compare-placeholder" aria-hidden="true">
              <div className="mini-phone" />
            </div>
            <dl>
              {product.highlights.map((item, i) => (
                <div key={item}>
                  <dt>{["Display", "Chip", "Camera", "Design"][i]}</dt>
                  <dd>{item}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
