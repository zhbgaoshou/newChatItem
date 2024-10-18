// theme.js
export const setTheme = (isDarkMode: boolean) => {
  document.documentElement.setAttribute(
    "data-theme",
    isDarkMode ? "black" : ""
  );
};
