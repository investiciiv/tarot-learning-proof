export function EvidenceLegend() {
  return (
    <section className="evidence-legend" aria-labelledby="evidence-title">
      <div>
        <p className="eyebrow">Как читать источники</p>
        <h2 id="evidence-title">Четыре разных типа утверждений</h2>
      </div>
      <div className="evidence-grid">
        <article><span className="evidence-tag history">HISTORY</span><p>Tarot возник как карточная игра в Италии XV века. Исторические тезисы проверяются отдельно от Waite.</p></article>
        <article><span className="evidence-tag occult">OCCULT TRADITION</span><p>Астрологические и стихийные соответствия — язык поздних оккультных школ.</p></article>
        <article><span className="evidence-tag practice">PRACTICE</span><p>Учебные формулы помогают применять карту к вопросу и позиции.</p></article>
        <article><span className="evidence-tag belief">UNVERIFIED / BELIEF</span><p>Метафизические утверждения не выдаются за научно установленный факт.</p></article>
      </div>
    </section>
  );
}
