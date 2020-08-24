export default function debounce(f: Function, time: number = 300) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      timeout = null;

      f(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, time);
  };
}
