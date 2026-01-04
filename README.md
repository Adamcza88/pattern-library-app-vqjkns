# Pattern Pro

Vzdělávací aplikace pro systematické učení candlestick patternů
s **mastery tracking**, **spaced repetition** a **adaptivními kvízy**.

---

## Přehled

Pattern Pro slouží k tréninku rozpoznávání svíčkových patternů
od základních po pokročilé, s důrazem na dlouhodobé zapamatování
a eliminaci typických záměn.

Aplikace je postavena na **Expo + React Native + TypeScript**
a je připravena pro web, iOS i Android.

---

## Klíčové funkce

### Pattern Library

* Režimy: **Browse / Learn Path / Review**
* Mastery panel: celkové %, streak, denní cíl, „Problematic 5“
* Filtry: Learning, Mastered, chyby za 7 dní, confusable pairs
* Karty patternů: SVG glyph, klíčová pravidla, confirmation badge, mastery ring

### Detail patternu

* Meaning: 1 věta + 3 body
* Scenarios: funguje / selhává / časté záměny
* Action protocol: Trigger → Confirmation → Invalidace → Risk
* Real-world context: trend, location, S/R, confirmation
* Confusions: porovnání podobných patternů
* Quick test: MCQ s okamžitým feedbackem

### Quiz & Practice

* Adaptivní obtížnost
* Stupňované hinty
* Sdílený feedback panel
* Spaced repetition (SM-2 logika)
* Režimy practice: Endless, Timed, Mistakes, Weak set

---

## Technický stack

* **Expo**
* **React Native**
* **TypeScript**
* **Expo Router**
* **Reanimated**
* **Expo Blur**
* **SVG**

---

## Datová logika

* Schema-driven content bloky
  (unknown keys se nerenderují)
* Mastery stav: Learning / Mastered
* Spaced repetition:

  * ease
  * intervalDays
  * dueAt
* „Problematic 5“ = nízká mastery + chyby + SR due

---

## Struktura projektu

```
app/
 ├─ (tabs)/
 │   ├─ (home)/        # Pattern Library
 │   └─ profile.tsx    # Statistiky uživatele
 ├─ pattern/[id].tsx   # Detail patternu
 ├─ quiz.tsx           # Quiz
 └─ practice.tsx       # Free Practice

components/
data/
types/
utils/
styles/
```

---

## Spuštění projektu

```bash
npm install
npm run dev
```

Doporučeno:

* **Expo Go** pro testování na mobilu
* iOS build přes **Expo Launch**

---

## Stav projektu

* MVP funkčně hotové
* Použita mock data
* Připraveno na backend integraci

---

## TODO (Backend)

* `/api/patterns`
* `/api/mastery`
* `/api/quiz/questions`
* `/api/quiz/answer`

---

## Cíl aplikace

Minimalizovat:

* falešné rozpoznání patternů
* záměny podobných struktur

Maximalizovat:

* dlouhodobou retenci
* konzistentní rozhodování v trhu

---

Built with **Natively.dev**
