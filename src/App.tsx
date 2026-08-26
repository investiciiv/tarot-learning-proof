"use client";

import { useEffect, useRef, useState } from "react";
import { cardsById } from "./content/cards";
import { glossary } from "./content/glossary";
import { quizzes } from "./content/quizzes";
import { progressSummary } from "./domain/mastery";
import type { TarotCard, UserProgress } from "./domain/types";
import { createLocalProgressStore, EMPTY_PROGRESS } from "./persistence/progress";
import { CardArtwork } from "./components/CardArtwork";
import { CardDetail } from "./components/CardDetail";
import { EvidenceLegend } from "./components/EvidenceLegend";
import { PracticeLoop } from "./components/PracticeLoop";
import { TarotMap } from "./components/TarotMap";

type Screen = "journey" | "map" | "practice" | "glossary";

const navItems: { id: Screen; label: string; icon: string }[] = [
  { id: "journey", label: "Сегодня", icon: "✦" },
  { id: "map", label: "78 карт", icon: "◫" },
  { id: "practice", label: "Практика", icon: "◎" },
  { id: "glossary", label: "Словарь", icon: "A" },
];

export default function App() {
  const storeRef = useRef<ReturnType<typeof createLocalProgressStore> | null>(null);
  const [progress, setProgress] = useState<UserProgress>(() => structuredClone(EMPTY_PROGRESS));
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const [screen, setScreen] = useState<Screen>("journey");
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

  useEffect(() => {
    const store = createLocalProgressStore(window.localStorage);
    storeRef.current = store;
    setProgress(store.load());
    setHasLoadedProgress(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedProgress) return;
    storeRef.current?.save(progress);
  }, [hasLoadedProgress, progress]);

  const summary = progressSummary(progress);
  const nextQuiz = quizzes[progress.attempts.length % quizzes.length];
  const todayCard = cardsById[nextQuiz.cardId];
  const todayMastery = progress.cards[todayCard.id]?.mastery ?? 0;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">✦</span><div><strong>ARCANA</strong><small>Tarot learning</small></div></div>
        <nav aria-label="Основная навигация">
          {navItems.map((item) => <button key={item.id} type="button" className={screen === item.id ? "active" : ""} onClick={() => setScreen(item.id)}><span>{item.icon}</span>{item.label}</button>)}
        </nav>
        <div className="sidebar-progress">
          <span>Ваш ритм</span>
          <strong>{summary.studied} из 78</strong>
          <div className="progress-track"><i style={{ width: `${Math.max((summary.studied / 78) * 100, 2)}%` }} /></div>
          <small>Освоено карт: {summary.mastered}</small>
        </div>
        <p className="sidebar-source">Rider–Waite–Smith<br />S01 · Waite / Smith, 1922</p>
      </aside>

      <main>
        {screen === "journey" && (
          <div className="journey-page">
            <header className="journey-heading">
              <div><p className="eyebrow">Сегодняшний учебный шаг</p><h1>Одна карта.<br />Одна ясная связь.</h1></div>
              <div className="session-stats"><span><strong>{summary.attempts}</strong> попыток</span><span><strong>{summary.accuracy}%</strong> точность</span></div>
            </header>

            <div className="journey-rail" aria-label="Этапы учебного шага">
              <span className="done">1 <small>Открыть</small></span><i />
              <span className="current">2 <small>Изучить</small></span><i />
              <span>3 <small>Проверить</small></span><i />
              <span>4 <small>Закрепить</small></span>
            </div>

            <section className="daily-card">
              <div className="daily-art"><CardArtwork card={todayCard} eager /></div>
              <div className="daily-copy">
                <div className="daily-meta"><span>{todayCard.arcana === "major" ? "Старший Аркан" : "Minor Arcana"}</span><span>Освоение {todayMastery}%</span></div>
                <p className="card-number">{todayCard.numeral}</p>
                <h2>{todayCard.name}</h2>
                <p className="english-name">{todayCard.nameEn}</p>
                <p className="core-quote">{todayCard.core}</p>
                <div className="compact-meanings">
                  <article><span>Ядро</span><p>{todayCard.core}</p></article>
                  <article><span>Тень</span><p>{todayCard.shadow}</p></article>
                </div>
                <div className="daily-actions">
                  <button className="primary-button" type="button" onClick={() => setScreen("practice")}>Перейти к практике <span>→</span></button>
                  <button className="text-button" type="button" onClick={() => setSelectedCard(todayCard)}>Все символы и источник</button>
                </div>
              </div>
            </section>

            <section className="next-step-card">
              <span>После ответа</span><div><h3>Прогресс сохранится на этом устройстве</h3><p>Попытка, правильный ответ и mastery останутся после перезапуска браузера.</p></div><strong>local-first</strong>
            </section>
          </div>
        )}

        {screen === "map" && <TarotMap progress={progress} onOpenCard={setSelectedCard} />}

        {screen === "practice" && (
          <div className="practice-page">
            <header className="page-heading compact"><div><p className="eyebrow">Recognition loop</p><h1>Узнать → выбрать → понять</h1></div><p>Три правдоподобных ответа. Объяснение появляется сразу — без угадывания «энергии».</p></header>
            <PracticeLoop progress={progress} onChange={setProgress} />
            <div className="practice-summary"><span>Всего попыток <strong>{summary.attempts}</strong></span><span>Верных <strong>{summary.correct}</strong></span><span>Точность <strong>{summary.accuracy}%</strong></span></div>
          </div>
        )}

        {screen === "glossary" && (
          <div className="glossary-page">
            <header className="page-heading"><div><p className="eyebrow">Язык без тумана</p><h1>Словарь и границы знания</h1></div><p>Короткие определения и видимые labels не дают смешать историю, практику и оккультную традицию.</p></header>
            <EvidenceLegend />
            <section className="glossary-list" aria-label="Словарь терминов">
              {glossary.map(([term, definition], index) => <article key={term}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{term}</h2><p>{definition}</p></div></article>)}
            </section>
          </div>
        )}
      </main>

      <nav className="mobile-nav" aria-label="Мобильная навигация">
        {navItems.map((item) => <button key={item.id} type="button" className={screen === item.id ? "active" : ""} onClick={() => setScreen(item.id)}><span>{item.icon}</span><small>{item.label}</small></button>)}
      </nav>

      {selectedCard && <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  );
}
