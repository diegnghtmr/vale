:root {
  /* Fondos */
  --bg-primary: #faf5f4;           /* Fondo principal - crema muy claro */
  --bg-secondary: #efe9e7;         /* Fondos de tarjetas - beige claro */
  --bg-tertiary: #ffffff;          /* Fondos de elementos elevados */
  
  /* Textos */
  --text-primary: #1c1c1b;         /* Texto principal - negro carbón */
  --text-secondary: #877070;       /* Texto secundario - gris cálido */
  --text-tertiary: #95938e;        /* Texto terciario - gris neutral */
  --text-disabled: #c3c1bf;        /* Texto deshabilitado */
  
  /* Acentos y marcas */
  --accent-primary: #c5775b;       /* Color principal - naranja cobre */
  --accent-secondary: #cb9a88;     /* Color secundario - coral */
  --accent-tertiary: #eac5a7;      /* Color terciario - beige cálido */
  
  /* Bordes y divisores */
  --border-primary: #c9c2bb;       /* Bordes principales */
  --border-secondary: #e5e0dd;     /* Bordes sutiles */
  
  /* Estados */
  --success: #698aa2;              /* Verde azulado */
  --warning: #c5775b;              /* Naranja (mismo que accent) */
  --error: #c9574d;                /* Rojo cálido */
}

:root[data-theme="dark"] {
  /* Fondos */
  --bg-primary: #0f0f0f;           /* Fondo principal - negro profundo */
  --bg-secondary: #1c1c1b;         /* Fondos de tarjetas - gris muy oscuro */
  --bg-tertiary: #161616;          /* Fondos de elementos elevados */
  
  /* Textos */
  --text-primary: #faf5f4;         /* Texto principal - blanco cremoso */
  --text-secondary: #9a9997;       /* Texto secundario - gris claro */
  --text-tertiary: #c3c1bf;        /* Texto terciario - gris medio */
  --text-disabled: #878070;        /* Texto deshabilitado */
  
  /* Acentos y marcas */
  --accent-primary: #d1968c;       /* Color principal - naranja claro */
  --accent-secondary: #e7beac;     /* Color secundario - coral claro */
  --accent-tertiary: #8c726c;      /* Color terciario - marrón cálido */
  
  /* Bordes y divisores */
  --border-primary: #2a2a2a;       /* Bordes principales */
  --border-secondary: #1a1a1a;     /* Bordes sutiles */
  
  /* Estados */
  --success: #9db3b7;              /* Verde azulado claro */
  --warning: #d1968c;              /* Naranja claro */
  --error: #e8a298;                /* Rojo cálido claro */
}

/* Fuente principal */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', monospace;
}

:root {
  /* Tamaños de fuente */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  --text-7xl: 4.5rem;      /* 72px */
  
  /* Pesos de fuente */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  
  /* Alturas de línea */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}

/* Títulos */
.title-hero {
  font-family: var(--font-primary);
  font-size: var(--text-6xl);
  font-weight: var(--font-extrabold);
  line-height: var(--leading-tight);
  letter-spacing: -0.025em;
}

.title-section {
  font-family: var(--font-primary);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

.title-subsection {
  font-family: var(--font-primary);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

/* Texto del cuerpo */
.text-body-lg {
  font-family: var(--font-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
}

.text-body {
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}

.text-body-sm {
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}

/* Texto de interfaz */
.text-label {
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
}

.text-caption {
  font-family: var(--font-primary);
  font-size: var(--text-xs);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}

:root {
  /* Espaciado base (múltiplos de 4px) */
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */
  
  /* Espaciado semántico */
  --space-xs: var(--space-2);
  --space-sm: var(--space-4);
  --space-md: var(--space-6);
  --space-lg: var(--space-8);
  --space-xl: var(--space-12);
  --space-2xl: var(--space-16);
  --space-3xl: var(--space-20);
  --space-4xl: var(--space-24);
  --space-5xl: var(--space-32);
}

:root {
  /* Anchos máximos */
  --max-width-sm: 640px;
  --max-width-md: 768px;
  --max-width-lg: 1024px;
  --max-width-xl: 1280px;
  --max-width-2xl: 1536px;
  --max-width-content: 1200px;
  
  /* Alturas */
  --header-height: 80px;
  --sidebar-width: 280px;
  --sidebar-width-collapsed: 64px;
}

/* Contenedor principal */
.container {
  width: 100%;
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding-left: var(--space-6);
  padding-right: var(--space-6);
}

@media (max-width: 768px) {
  .container {
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }
}


/* Botón base */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-primary);
  font-weight: var(--font-medium);
  text-decoration: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  gap: var(--space-2);
}

/* Tamaños */
.btn-sm {
  font-size: var(--text-sm);
  padding: var(--space-2) var(--space-4);
  height: 36px;
}

.btn-md {
  font-size: var(--text-base);
  padding: var(--space-3) var(--space-6);
  height: 44px;
}

.btn-lg {
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-8);
  height: 52px;
}

/* Variantes */
.btn-primary {
  background-color: var(--text-primary);
  color: var(--bg-primary);
}

.btn-primary:hover {
  background-color: var(--text-secondary);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.btn-secondary:hover {
  background-color: var(--bg-secondary);
  border-color: var(--text-secondary);
}

.btn-accent {
  background-color: var(--accent-primary);
  color: var(--bg-primary);
}

.btn-accent:hover {
  background-color: var(--accent-secondary);
  transform: translateY(-1px);
}


.card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-secondary);
  border-radius: 12px;
  padding: var(--space-6);
  transition: all 0.2s ease-in-out;
}

.card:hover {
  border-color: var(--border-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.card-elevated {
  background-color: var(--bg-tertiary);
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-secondary);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.card-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: var(--space-2) 0 0 0;
}


.form-group {
  margin-bottom: var(--space-5);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.form-input {
  width: 100%;
  font-family: var(--font-primary);
  font-size: var(--text-base);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(197, 119, 91, 0.1);
}

.form-input::placeholder {
  color: var(--text-tertiary);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right var(--space-3) center;
  background-repeat: no-repeat;
  background-size: 16px 12px;
  padding-right: var(--space-10);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: var(--border-secondary);
  border-radius: 8px;
  overflow: hidden;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: var(--border-secondary);
  margin-bottom: 1px;
}

.calendar-day-name {
  background-color: var(--bg-secondary);
  padding: var(--space-3) var(--space-2);
  text-align: center;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.calendar-day {
  background-color: var(--bg-primary);
  padding: var(--space-3);
  min-height: 120px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.calendar-day:hover {
  background-color: var(--bg-secondary);
}

.calendar-day.selected {
  background-color: var(--accent-primary);
  color: var(--bg-primary);
}

.calendar-day.other-month {
  background-color: var(--bg-secondary);
  color: var(--text-tertiary);
}

.calendar-day-number {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-2);
}

.calendar-event {
  background-color: var(--accent-primary);
  color: var(--bg-primary);
  font-size: var(--text-xs);
  padding: var(--space-1) var(--space-2);
  border-radius: 4px;
  margin-bottom: var(--space-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.calendar-event.secondary {
  background-color: var(--accent-secondary);
}

.calendar-event.tertiary {
  background-color: var(--text-secondary);
}

.subjects-sidebar {
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-secondary);
  padding: var(--space-6);
  height: 100vh;
  overflow-y: auto;
}

.subject-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: 8px;
  margin-bottom: var(--space-2);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.subject-item:hover {
  background-color: var(--bg-primary);
}

.subject-item.selected {
  background-color: var(--accent-primary);
  color: var(--bg-primary);
}

.subject-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.subject-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  flex: 1;
}

.subject-credits {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  background-color: var(--bg-primary);
  padding: var(--space-1) var(--space-2);
  border-radius: 4px;
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: var(--bg-primary);
  border-radius: 16px;
  padding: var(--space-8);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.modal-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: var(--text-xl);
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-close:hover {
  color: var(--text-primary);
}

/* Variables de breakpoints */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Adaptaciones móviles */
@media (max-width: 768px) {
  .title-hero {
    font-size: var(--text-4xl);
  }
  
  .title-section {
    font-size: var(--text-3xl);
  }
  
  .calendar-grid {
    gap: 0.5px;
  }
  
  .calendar-day {
    min-height: 80px;
    padding: var(--space-2);
  }
  
  .subjects-sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 280px;
    z-index: 100;
    transition: left 0.3s ease-in-out;
  }
  
  .subjects-sidebar.open {
    left: 0;
  }
}

@media (max-width: 480px) {
  .modal {
    padding: var(--space-6);
    margin: var(--space-4);
  }
  
  .btn-lg {
    height: 48px;
    font-size: var(--text-base);
  }
}

:root {
  /* Duraciones */
  --duration-fast: 0.15s;
  --duration-normal: 0.2s;
  --duration-slow: 0.3s;
  --duration-slower: 0.5s;
  
  /* Easings */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Animaciones de entrada */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Clases de animación */
.animate-fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

.animate-slide-in-left {
  animation: slideInLeft var(--duration-normal) var(--ease-out);
}

.animate-scale-in {
  animation: scaleIn var(--duration-slow) var(--ease-bounce);
}