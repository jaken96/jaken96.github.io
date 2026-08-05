const themes = {
  violet: {
    label: "Violet theme",
    primary: "#6750a4",
    onPrimary: "#ffffff",
    primaryContainer: "#e9ddff",
    onPrimaryContainer: "#22005d",
    secondary: "#625b71",
    secondaryContainer: "#e8def8",
    onSecondaryContainer: "#1e192b",
    tertiary: "#7d5260",
    tertiaryContainer: "#ffd8e4",
    surface: "#fff7ff",
    surfaceContainer: "#f3edf7",
    surfaceHigh: "#ece6f0",
    surfaceHighest: "#e6e0e9",
    onSurface: "#1d1b20",
    onSurfaceVariant: "#49454f",
    outline: "#79747e",
    outlineVariant: "#cac4d0"
  },
  blue: {
    label: "Ocean theme",
    primary: "#00639a",
    onPrimary: "#ffffff",
    primaryContainer: "#cee5ff",
    onPrimaryContainer: "#001d32",
    secondary: "#526070",
    secondaryContainer: "#d5e4f7",
    onSecondaryContainer: "#0f1d2a",
    tertiary: "#68587a",
    tertiaryContainer: "#eedbff",
    surface: "#f8f9ff",
    surfaceContainer: "#edf1f7",
    surfaceHigh: "#e7ebf1",
    surfaceHighest: "#e1e6ec",
    onSurface: "#191c20",
    onSurfaceVariant: "#42474e",
    outline: "#73777f",
    outlineVariant: "#c2c7cf"
  },
  green: {
    label: "Fern theme",
    primary: "#386a20",
    onPrimary: "#ffffff",
    primaryContainer: "#b8f397",
    onPrimaryContainer: "#072100",
    secondary: "#55624c",
    secondaryContainer: "#d9e7cb",
    onSecondaryContainer: "#131f0d",
    tertiary: "#386666",
    tertiaryContainer: "#bbebeb",
    surface: "#f8fbf1",
    surfaceContainer: "#eef2e8",
    surfaceHigh: "#e8ece2",
    surfaceHighest: "#e2e6dc",
    onSurface: "#1a1c18",
    onSurfaceVariant: "#43483f",
    outline: "#74796e",
    outlineVariant: "#c3c8bb"
  },
  orange: {
    label: "Ember theme",
    primary: "#8c4f00",
    onPrimary: "#ffffff",
    primaryContainer: "#ffdcbd",
    onPrimaryContainer: "#2d1600",
    secondary: "#745943",
    secondaryContainer: "#ffdcc3",
    onSecondaryContainer: "#2a1808",
    tertiary: "#5d6237",
    tertiaryContainer: "#e2e8ae",
    surface: "#fff8f4",
    surfaceContainer: "#f6eee8",
    surfaceHigh: "#f0e8e2",
    surfaceHighest: "#eae2dc",
    onSurface: "#211a15",
    onSurfaceVariant: "#50453c",
    outline: "#82756a",
    outlineVariant: "#d4c4b8"
  }
};

const root = document.documentElement;
const status = document.querySelector("#palette-status");
const seedButtons = [...document.querySelectorAll(".seed")];
const themeKeys = Object.keys(themes);

function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;

  const values = {
    "--primary": theme.primary,
    "--on-primary": theme.onPrimary,
    "--primary-container": theme.primaryContainer,
    "--on-primary-container": theme.onPrimaryContainer,
    "--secondary": theme.secondary,
    "--secondary-container": theme.secondaryContainer,
    "--on-secondary-container": theme.onSecondaryContainer,
    "--tertiary": theme.tertiary,
    "--tertiary-container": theme.tertiaryContainer,
    "--surface": theme.surface,
    "--surface-container": theme.surfaceContainer,
    "--surface-container-high": theme.surfaceHigh,
    "--surface-container-highest": theme.surfaceHighest,
    "--on-surface": theme.onSurface,
    "--on-surface-variant": theme.onSurfaceVariant,
    "--outline": theme.outline,
    "--outline-variant": theme.outlineVariant
  };

  Object.entries(values).forEach(([property, value]) => root.style.setProperty(property, value));
  document.querySelector('meta[name="theme-color"]').setAttribute("content", theme.primary);
  status.textContent = theme.label;

  seedButtons.forEach((button) => {
    const selected = button.dataset.theme === themeName;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

seedButtons.forEach((button) => {
  button.addEventListener("click", () => applyTheme(button.dataset.theme));
});

document.querySelector("#surprise-theme").addEventListener("click", () => {
  const selectedIndex = seedButtons.findIndex((button) => button.classList.contains("selected"));
  const choices = themeKeys.filter((_, index) => index !== selectedIndex);
  applyTheme(choices[Math.floor(Math.random() * choices.length)]);
});

const densityButtons = [...document.querySelectorAll(".button-group button")];
const densityFeedback = document.querySelector("#density-feedback");

densityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    densityButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    densityFeedback.textContent = `${button.dataset.density} selected`;
  });
});

const progressBars = [...document.querySelectorAll("#wave-progress span")];
const progress = document.querySelector("#wave-progress");
const progressValue = document.querySelector("#progress-value");
let progressTimers = [];

function playProgress() {
  progressTimers.forEach(window.clearTimeout);
  progressTimers = [];
  progressBars.forEach((bar) => {
    bar.classList.remove("filled");
    bar.style.animationDelay = "0ms";
  });
  progressValue.textContent = "0%";
  progress.setAttribute("aria-valuenow", "0");

  progressBars.forEach((bar, index) => {
    const timer = window.setTimeout(() => {
      bar.classList.add("filled");
      const value = Math.round(((index + 1) / progressBars.length) * 100);
      progressValue.textContent = `${value}%`;
      progress.setAttribute("aria-valuenow", String(value));
    }, 90 * index);
    progressTimers.push(timer);
  });
}

document.querySelector("#replay-progress").addEventListener("click", playProgress);

const backToTop = document.querySelector("#back-to-top");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 700);
}, { passive: true });

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

playProgress();
