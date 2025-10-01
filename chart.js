// Simple chart rendering using Chart.js
// This file is loaded by index.html

// Load Chart.js from CDN
if (!window.Chart) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  document.head.appendChild(script);
}
