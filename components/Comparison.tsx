import { ArrowUpRight, Check } from "lucide-react";
import { comparisonProducts } from "@/lib/products";

const metricLabels = ["Display", "Chip", "Camera", "Design"];

export default function Comparison() {
  return (
    <section className="comparison-section section-pad" id="compare">
      <div className="comparison-heading">
        <div>
          <span className="section-index">05 / COMPARE</span>
          <h2>Difference, without the noise.</h2>
        </div>
        <div className="comparison-heading-copy">
          <p>
            A comparison should reveal the trade-offs immediately — not make you scan
            seventy rows of marketing language.
          </p>
          <button className="difference-toggle">
            <Check size={14} />
            Show only differences
          </button>
        </div>
      </div>

      <div className="comparison-shell">
        <div className="comparison-label-column" aria-hidden="true">
          <div className="compare-label-spacer">CATEGORY</div>
          {metricLabels.map((label) => <span key={label}>{label}</span>)}
        </div>

        <div className="comparison-products">
          {comparisonProducts.map((product, index) => (
            <article className={index === 0 ? "compare-product active" : "compare-product"} key={product.name}>
              <div className="compare-product-head">
                <div>
                  <small>{product.subtitle}</small>
                  <h3>{product.name}</h3>
                </div>
                <button aria-label={"Open " + product.name}>
                  <ArrowUpRight size={17} />
                </button>
              </div>

              <div className={"compare-device-art compare-device-art-" + (index + 1)} aria-hidden="true">
                <div className="compare-device-body">
                  <i /><i /><i />
                </div>
              </div>

              <div className="compare-metrics">
                {product.highlights.map((item, metricIndex) => (
                  <div key={item}>
                    <span className="mobile-metric-label">{metricLabels[metricIndex]}</span>
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="comparison-footer">
        <span>Pick up to 3 products</span>
        <button>Open full comparison <ArrowUpRight size={16} /></button>
      </div>
    </section>
  );
}
