# ✨ vale – Versatile Academic Logistics Environment ✨

Welcome to **vale**! An open-source schedule planner designed with students in mind. We get it, juggling courses can be tough. That's why we built **vale** to help you effortlessly manage your classes, visualize your week at a glance, and export your schedule to your favorite calendar app.

Our interface is clean, friendly, and responsive, packed with powerful features to make your academic life a little easier.

![Contributors](https://contrib.rocks/image?repo=diegnghtmr/vale)

## Why VALE?

* **Visual first** – drag & drop classes on a live calendar  
* **Always with you** – works completely offline thanks to local storage  
* **Zero-friction import / export** – CSV ⇄ JSON ⇄ ICS  
* **Dark-mode delight** – one click and your eyes relax  
* **Multilingual** – 🇬🇧 English & 🇨🇴 Spanish (plug-and-play for more)

## 🌟 Key Features

* 🎨 **Express Yourself with Themes**: Switch between a sleek light mode and a cool dark mode with smooth, satisfying transitions.
* 🌐 **Speak Your Language**: Fully supports English and Spanish right out of the box. ¡Hola!
* 🗓 **Interactive Drag & Drop Calendar**: Powered by FullCalendar, arranging your schedule is as simple as dragging and dropping.
* 📦 **Works Offline**: Your data is safely stored in your browser's local storage, so you can access your schedule even without an internet connection.
* 📥 **Easy Data Import**: Got a list of courses in a CSV or JSON file? Import them in seconds using our handy templates.
* 📤 **Export to Your Favorite Calendar**: Generate `.ics` files compatible with Google Calendar, Apple Calendar, or Outlook, or export your data as a `.csv` file.
* 🔔 **Stay in the Loop**: Get friendly toast notifications that provide instant feedback on your actions.
* 📊 **Track Your Progress**: A simple dashboard helps you keep an eye on your completed courses and credit progress.

## 🛠️ Quick Start

```bash
npm install
```

### Development

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

### Build & Deployment

Generate a production build:

```bash
npm run build
```

The project is configured for deployment on Vercel (see `vercel.json`). You can also preview a production build locally:

```bash
npm run preview
```

## 🗂️ Project Structure

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

## 🤝 Contributing

Contributions are welcome! 🎉 Fork the repository and open a pull request. We follow conventional GitHub workflow with branches and pull requests. The contributors list is automatically generated using [contrib.rocks](https://contrib.rocks).

```markdown
![Contributors](https://contrib.rocks/image?repo=diegnghtmr/vale)
```

Feel free to add yourself by committing to the repository—your GitHub avatar will appear above on the next build!

## 🙏 Acknowledgements

This project leverages several open source libraries:

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [FullCalendar](https://fullcalendar.io/)
- [react-hot-toast](https://react-hot-toast.com/)
- [i18next](https://www.i18next.com/)
- [GSAP](https://greensock.com/gsap/)

We appreciate every contributor and tester who helped shape **vale**. Your feedback makes this tool better for students everywhere! 💜

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.


## 💡 Usage Tips

1. Start by adding courses manually via the **Course Details** form or upload a structured file.
2. Use the filters to focus on a particular semester, time slot or credit range.
3. Toggle courses into the calendar to visualize potential conflicts. Conflicts are detected automatically with friendly messages.
4. Export your schedule using the **Export** button (`.ics` or `.csv`).
5. Track your progress in the dashboard – completed courses are separated from available ones and reflected in the statistics.

Sample templates for CSV/JSON imports are located under [`docs/templates`](docs/templates). Academic period datasets are stored in [`docs/academic-periods`](docs/academic-periods).

## 🔌 Extending

The app currently uses a mock API backed by `localStorage`. To integrate a real backend, implement the `ApiClient` interface in `src/services/api.ts` and replace the `MockApiClient` instance. You can also customize themes by editing the files inside `src/data/themes` and add more languages by providing new translation files under `src/locales`.

## 🌍 Community

Join the conversation by opening issues or discussions on GitHub. We welcome bug reports, feature requests and general feedback. Let's build a flexible academic planner together! 🚀
