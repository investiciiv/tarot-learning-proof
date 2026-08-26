import type { TarotCard } from "../domain/types";

export function CardArtwork({ card, eager = false }: { card: TarotCard; eager?: boolean }) {
  return (
    <div className="card-artwork">
      <img
        src={`${import.meta.env.BASE_URL}${card.image}`}
        alt={`${card.name} — историческая иллюстрация Pamela Colman Smith`}
        loading={eager ? "eager" : "lazy"}
      />
      <span className="plate-mark">S01 · PDF {card.pdfPage}</span>
    </div>
  );
}
