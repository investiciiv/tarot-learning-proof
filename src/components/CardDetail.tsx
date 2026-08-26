import type { TarotCard } from "../domain/types";
import { CardArtwork } from "./CardArtwork";

export function CardDetail({ card, onClose }: { card: TarotCard; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="card-detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-detail-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="close-button" type="button" onClick={onClose} aria-label="Закрыть карту">×</button>
        <div className="detail-art"><CardArtwork card={card} eager /></div>
        <div className="detail-copy">
          <p className="eyebrow">{card.arcana === "major" ? "Старший Аркан" : card.nameEn.split(" of ")[1]}</p>
          <h2 id="card-detail-title"><span>{card.numeral}</span> {card.name}</h2>
          <p className="english-name">{card.nameEn}</p>
          <div className="meaning-grid">
            <article>
              <span className="meaning-label">Ядро</span>
              <p>{card.core}</p>
            </article>
            <article className="shadow-meaning">
              <span className="meaning-label">Тень</span>
              <p>{card.shadow}</p>
            </article>
          </div>
          <div className="symbol-block">
            <h3>Символы для узнавания</h3>
            <ul>{card.symbols.map((symbol) => <li key={symbol}>{symbol}</li>)}</ul>
          </div>
          {card.correspondence && (
            <div className="evidence-note">
              <span className="evidence-tag occult">OCCULT TRADITION</span>
              <p>Соответствие Golden Dawn: {card.correspondence}. Это оккультная система, не факт об изначальном происхождении Tarot.</p>
            </div>
          )}
          <div className="source-line">
            <span className="evidence-tag practice">PRACTICE</span>
            <span className="evidence-tag primary">S01 PRIMARY VISUAL</span>
            <p>{card.source.citation}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
