<img align="right" width="140" src="public/vite.svg" alt="MoodSpace logo placeholder" />

# MoodSpace · Mental Health Check-In & Support

>MoodSpace is a front-end prototype for an anonymous daily mood ritual. Track emotions with emoji check-ins, receive AI-inspired journaling prompts, gain insights from a beautiful analytics dashboard, and connect with a supportive peer lounge (backend coming soon).

## ✨ Highlights

- **Immersive homepage** with a Three.js aura, product storytelling, and community highlights.
- **Daily mood check-in** featuring emoji ratings, energy slider, smart journaling prompts, and local history.
- **Analytics dashboard** powered by Recharts with mood trends, energy spectrum, distributions, and narrative insights.
- **Responsive design** with a polished dark theme, animated interactions, and mobile navigation.
- **Client-side persistence** using `localStorage`, plus a demo dataset so the dashboard feels alive on first load.

## 🧱 Tech Stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/) for the application shell
- [React Router](https://reactrouter.com/) for page routing
- [Three.js](https://threejs.org/) for the animated hero aura
- [Recharts](https://recharts.org/en-US/) for data visualisations
- [lucide-react](https://lucide.dev/) for icons
- [date-fns](https://date-fns.org/) for date formatting utilities

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` to explore the experience. The dev server supports hot module replacement for rapid iteration.

### Available scripts

| Command           | Description                                      |
| -----------------| ------------------------------------------------ |
| `npm run dev`     | Start the Vite development server                |
| `npm run build`   | Build an optimized production bundle             |
| `npm run preview` | Preview the production build locally             |
| `npm run lint`    | Run ESLint across the project                    |

## 📝 Data & Storage

- Check-ins are saved to `localStorage` under the key `moodspace_checkins`.
- Saving a mood replaces any existing entry for the same day.
- The analytics dashboard falls back to a **demo dataset** until you log real check-ins—look for the banner indicating preview mode.

## 📁 Key Structure

```
src/
	components/        Shared UI pieces (layout, Three.js aura)
	data/              Mood metadata, prompts, score helpers
	pages/             Route-level views (Home, Check-In, Analytics)
	utils/             Local storage helpers
```

## 🔮 Roadmap Ideas

- Wire up the real backend for journaling prompts and peer forum threads.
- Authentication & anonymous matchmaking for peer replies.
- Export & share insights, plus weekly recap emails.
- Accessibility tuning (keyboard shortcuts, high-contrast theme, screen reader script).

–– Built with care for mindful digital wellbeing.
