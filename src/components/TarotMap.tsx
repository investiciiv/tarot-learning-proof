import { useMemo, useState } from "react";
import { cards, courtLessons, numberLessons, suitLessons } from "../content/cards";
import type { Suit, TarotCard, UserProgress } from "../domain/types";
import { CardArtwork } from "./CardArtwork";

type Filter = "all" | "major" | Suit;

export function TarotMap({ progress, onOpenCard }: { progress: UserProgress; onOpenCard: (card: TarotCard) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visibleCards = useMemo(
    () => cards.filter((card) => filter === "all" || card.arcana === filter || card.suit === filter),
    [filter],
  );

  return (
    <div className="map-page">
      <header className="page-heading">
        <div><p className="eyebrow">Карта системы</p><h1>78 карт — одна структура</h1></div>
        <p>22 Старших Аркана + 4 масти × 14 карт. Сначала видим каркас, затем детали.</p>
      </header>

      <section className="structure-strip" aria-label="Структура колоды">
        <article><strong>22</strong><span>Major Arcana</span></article>
        <article><strong>56</strong><span>Minor Arcana</span></article>
        <article><strong>4</strong><span>масти</span></article>
        <article><strong>16</strong><span>Court Cards</span></article>
      </section>

      <div className="filter-row" role="group" aria-label="Фильтр карт">
        {([
          ["all", "Все 78"], ["major", "Major 22"], ["wands", "Жезлы"], ["cups", "Кубки"], ["swords", "Мечи"], ["pentacles", "Пентакли"],
        ] as const).map(([id, label]) => (
          <button key={id} type="button" className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{label}</button>
        ))}
      </div>

      <section className="card-grid" aria-live="polite">
        {visibleCards.map((card) => {
          const mastery = progress.cards[card.id]?.mastery ?? 0;
          return (
            <button className="map-card" type="button" key={card.id} onClick={() => onOpenCard(card)}>
              <CardArtwork card={card} />
              <span className="map-card-copy"><strong>{card.numeral} · {card.name}</strong><small>{mastery ? `${mastery}% освоения` : "Не изучено"}</small></span>
            </button>
          );
        })}
      </section>

      <section className="logic-section">
        <div className="section-intro"><p className="eyebrow">Minor Arcana</p><h2>Масть × число = первый ключ</h2></div>
        <div className="suit-grid">
          {suitLessons.map((suit) => <article key={suit.id} className={`suit-card ${suit.id}`}><span>{suit.element}</span><h3>{suit.name}</h3><strong>{suit.formula}</strong><p>{suit.focus}</p></article>)}
        </div>
        <div className="number-grid">
          {numberLessons.map(([number, meaning]) => <article key={number}><strong>{number}</strong><span>{meaning}</span></article>)}
        </div>
      </section>

      <section className="court-section">
        <div className="section-intro"><p className="eyebrow">Court Cards</p><h2>Роль × масть</h2></div>
        <div className="court-grid">
          {courtLessons.map(([role, formula, action]) => <article key={role}><span>{role}</span><strong>{formula}</strong><p>{action}</p></article>)}
        </div>
      </section>
    </div>
  );
}
