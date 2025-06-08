# vale - Versatile Academic Logistics Environment

![Contributors](https://contrib.rocks/image?repo=diegnghtmr/vale)

## Overview

**vale** is an open source schedule planner. It helps students manage their courses, visualize weekly schedules and export events to standard calendar formats. The interface is designed to be friendly and responsive while still offering powerful features for customization.

## Key Features

- 🎨 **Theme Switching** – Toggle between light and dark mode with smooth transitions.
- 🌐 **Internationalization** – Supports English and Spanish via `i18next`.
- 🗓 **Interactive Calendar** – Powered by `@fullcalendar/react` for a drag‑and‑drop experience.
- 📦 **Local Storage Sync** – Persist your data offline with a mock API layer.
- 📥 **CSV/JSON Import** – Quickly load course data from predefined templates.
- 📤 **ICS & CSV Export** – Generate calendar files compatible with Google Calendar or Outlook.
- 🔔 **Toast Notifications** – User feedback powered by `react-hot-toast`.
- 📊 **Dashboard** – Track completed courses and credit progress at a glance.

## Installation

```bash
npm install
```

## Development

Run the development server with hot reloading:

```bash
npm run dev
```

Lint and format the codebase:

```bash
npm run lint
npm run format
```

Run tests with Jest:

```bash
npm test
```

## Build & Deployment

Generate a production build:

```bash
npm run build
```

The project is configured for deployment on Vercel (see `vercel.json`). You can also preview a production build locally:

```bash
npm run preview
```

## Project Structure

```text
/               – Root configuration and entry
├─ src/         – React components, hooks and services
│  ├─ components/   – UI building blocks (Calendar, CourseForm…)
│  ├─ context/      – React context providers
│  ├─ hooks/        – Custom hooks (`useCourses`, `useWindowSize`, ...)
│  ├─ locales/      – Translation files (en, es)
│  ├─ services/     – API abstraction and utilities
│  └─ utils/        – Helper functions and unit tests
├─ public/      – Static assets
└─ docs/        – Templates and sample academic periods
```

## Contributing

Contributions are welcome! 🎉 Fork the repository and open a pull request. We follow conventional GitHub workflow with branches and pull requests. The contributors list is automatically generated using [contrib.rocks](https://contrib.rocks).

```markdown
![Contributors](https://contrib.rocks/image?repo=diegnghtmr/vale)
```

Feel free to add yourself by committing to the repository—your GitHub avatar will appear above on the next build!

## Acknowledgements

This project leverages several open source libraries:

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [FullCalendar](https://fullcalendar.io/)
- [react-hot-toast](https://react-hot-toast.com/)
- [i18next](https://www.i18next.com/)
- [GSAP](https://greensock.com/gsap/)

We appreciate every contributor and tester who helped shape **vale**. Your feedback makes this tool better for students everywhere. 🙏

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.


## Usage Tips

1. Start by adding courses manually via the **Course Details** form or upload a structured file.
2. Use the filters to focus on a particular semester, time slot or credit range.
3. Toggle courses into the calendar to visualize potential conflicts. Conflicts are detected automatically with friendly messages.
4. Export your schedule using the **Export** button (`.ics` or `.csv`).
5. Track your progress in the dashboard – completed courses are separated from available ones and reflected in the statistics.

Sample templates for CSV/JSON imports are located under [`docs/templates`](docs/templates). Academic period datasets are stored in [`docs/academic-periods`](docs/academic-periods).

## Extending

The app currently uses a mock API backed by `localStorage`. To integrate a real backend, implement the `ApiClient` interface in `src/services/api.ts` and replace the `MockApiClient` instance. You can also customize themes by editing the files inside `src/data/themes` and add more languages by providing new translation files under `src/locales`.

## Community

Join the conversation by opening issues or discussions on GitHub. We welcome bug reports, feature requests and general feedback. Let's build a flexible academic planner together! 🚀
