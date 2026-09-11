# 🍅 Ritmo — Pomodoro fokus taymeri

**Ritmo** — diqqatni ushlab turish uchun mo'ljallangan Pomodoro veb-ilovasi. Ilova ochilishi bilan to'g'ridan-to'g'ri taymer siferblati qarshi oladi: uch rejim (fokus, qisqa tanaffus, uzun tanaffus), moslashuvchan davomiyliklar, kunlik statistika va `localStorage` orqali to'liq saqlanadigan ma'lumotlar.

Har bir rejim interfeysning o'z rang ohangiga ega: fokus — pomidor qizili, qisqa tanaffus — yalpiz yashili, uzun tanaffus — shom ko'ki.

---

## ✨ Imkoniyatlar

| Imkoniyat | Tavsif |
|---|---|
| **Uch rejim** | Fokus, qisqa tanaffus va uzun tanaffus — siferblat atrofida sirpanuvchi tablar orqali almashiladi |
| **Boshqaruv** | Boshlash, pauza, davom ettirish, qayta tiklash (reset) va keyingi sessiyaga o'tish (skip) |
| **Moslashuvchan davomiyliklar** | Har uch rejim uchun daqiqalar, fokus uchun tayyor presetlar (15 / 25 / 50 / 90 daq) |
| **Ritm sozlamalari** | Necha sprintdan keyin uzun tanaffus, kunlik maqsad, tanaffus/fokusni avto-boshlash |
| **Kunlik statistika** | Yakunlangan sprintlar, fokus daqiqalari, maqsad progressi, soatlik faollik lentasi |
| **7 kunlik grafik** | Oxirgi haftadagi har bir kun uchun fokus daqiqalari ustunlarda |
| **Sessiya jurnali** | Bugungi har bir sprint vaqti bilan ro'yxatda |
| **Seriya (streak)** | Ketma-ket necha kun fokus qilingani — sarlavhadagi chiptada |
| **Ovoz** | Sessiya yakunida WebAudio orqali uch notali jiringlash (o'chirib bo'ladi) |
| **Sifatlashuv** | Klaviatura yorliqlari, tab sarlavhasida jonli orqaga sanash, oxirgi 5 soniyalik shoshilinch holat |
| **Ma'lumotlar saqlash** | Sozlamalar, statistika, jurnal va sikl holati `localStorage`da — sahifa yangilansa ham yo'qolmaydi |

### ⌨️ Klaviatura yorliqlari

| Tugma | Amal |
|---|---|
| `Space` | Boshlash / pauza |
| `R` | Taymerni qayta tiklash |
| `S` | Keyingi sessiyaga o'tish |
| `1` – `3` | Fokus / qisqa / uzun rejim |

---

## 🚀 Ishga tushirish

```bash
# bog'liqliklarni o'rnatish
npm install

# dev-server (http://localhost:5173)
npm run dev

# production build
npm run build

# TypeScript tekshiruvi
npm run typecheck
```

**Texnologiyalar:** React 18 · TypeScript · Vite 6 · Tailwind CSS v4

---

## 📁 Fayllar joylashuvi

```
ritmo/
├── index.html                      # HTML qobiq — shriftlar (Bricolage Grotesque,
│                                   #   Instrument Sans, Spline Sans Mono), sarlavha
├── package.json                    # Bog'liqliklar va npm skriptlari
├── tsconfig.json                   # TypeScript konfiguratsiyasi
├── vite.config.js                  # Vite konfiguratsiyasi
└── src/
    ├── main.tsx                    # Kirish nuqtasi — React ilovasini DOMga ulaydi
    ├── App.tsx                     # Asosiy kompozitsiya: sarlavha, taymer ustuni,
    │                               #   statistika ustuni, sozlamalar paneli, yorliqlar
    ├── index.css                   # Dizayn tizimi: tema tokenlari, rejim ranglari,
    │                               #   grain/vignette qatlamlari, animatsiyalar
    │
    ├── lib/                        # Sof mantiq — hech qanday React yo'q
    │   ├── pomodoro.ts             # Turlar (Mode, Phase, Settings, DayStats),
    │   │                           #   localStorage kalitlari, sana/format
    │   │                           #   yordamchilari, standart sozlamalar
    │   └── sound.ts                # WebAudio jiringlash (chime) va qisqa signal
    │
    ├── hooks/                      # Holat va vaqt mantig'i
    │   ├── usePomodoro.ts          # Taymer dvigateli: driftsiz vaqt hisobi,
    │   │                           #   sessiya yozib borish, sikl (long break)
    │   │                           #   mantig'i, localStorage bilan sinxronlash
    │   └── useCountUp.ts           # Raqamlarni yumshoq o'sirib ko'rsatish hooki
    │
    └── components/                 # UI bloklari
        ├── icons.tsx               # Qo'lda chizilgan SVG ikonkalar to'plami
        ├── Reveal.tsx              # Scroll paytida paydo bo'lish (IntersectionObserver)
        ├── ModeTabs.tsx            # Fokus / qisqa / uzun rejim tablari
        ├── TimerRing.tsx           # Siferblat: 60 bo'limli belgilar, progress yoyi,
        │                           #   vaqt ko'rsatkichi, holat matnlari
        ├── Controls.tsx            # Boshlash / pauza, reset, skip tugmalari
        ├── StatsBoard.tsx          # Kunlik statistika: maqsad, soatlik lenta,
        │                           #   7 kunlik grafik
        ├── HistoryLog.tsx          # Bugungi sessiyalar jurnali
        └── SettingsDrawer.tsx      # Sirpanuvchi sozlamalar paneli: davomiyliklar,
                                    #   ritm, xatti-harakat, ma'lumotlarni tozalash
```

---

## 💾 localStorage kalitlari

Barcha ma'lumotlar brauzerda uchta kalit ostida saqlanadi (versiyalangan):

| Kalit | Tarkibi |
|---|---|
| `ritmo.settings.v1` | Davomiyliklar, sikl uzunligi, kunlik maqsad, avto-boshlash va ovoz sozlamalari |
| `ritmo.stats.v1` | Kunlar kesimida statistika: `{ "2026-02-14": { sessions, seconds, log[] } }` |
| `ritmo.cycle.v1` | Uzun tanaffusgacha bo'lgan sikl holati (nechta sprint yakunlangan) |

Statistika mahalliy sana bo'yicha kalitlanadi — yarim tunda avtomatik yangi kun boshlanadi, seriya va tarix saqlanib qoladi.

---

## 🎨 Dizayn

- **Shriftlar:** Bricolage Grotesque (sarlavhalar) · Instrument Sans (matn) · Spline Sans Mono (raqamlar va vaqt)
- **Rejim ranglari:** har bir rejim butun interfeysning urg'u rangini o'zgartiradi
- **Jonli qatlamlar:** film grain (donadorlik), iliq vinyetka, sekin aylanuvchi mexanik halqalar, ishlayotgan paytda "nafas oluvchi" nur
- **Mikro-animatsiyalar:** tugmalar ko'tarilishi, progress yoyi, raqamlarning sanab borishi, scroll-reveal

---

MIT litsenziyasi.
