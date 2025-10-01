// Load data from a static JSON file (to be generated from bills.db)
async function fetchData() {
  const response = await fetch('bills_data.json');
  return response.json();
}

function renderMath(element, latex) {
  katex.render(latex, element, {throwOnError: false});
}

function getUniqueWeeks(data) {
  return [...new Set(data.map(row => row.week))].sort((a, b) => a - b);
}

function getGamesForWeek(data, week) {
  return data.filter(row => row.week == week);
}


async function main() {
  const data = await fetchData();
  // Only show weeks 1-21, even if some are missing
  const allWeeks = Array.from({length: 21}, (_, i) => i + 1);
  const weekSelect = document.getElementById('week');


  // Populate week dropdown (show all weeks, disable if missing)
  weekSelect.innerHTML = '';
  allWeeks.forEach(week => {
    const option = document.createElement('option');
    option.value = week;
    option.textContent = `Week ${week}`;
    if (!getGamesForWeek(data, week).length) {
      option.disabled = true;
      option.textContent += ' (no games)';
    }
    weekSelect.appendChild(option);
  });

  function getGamePlays(data, game_id) {
    return data.filter(row => row.game_id === game_id);
  }

  function drawGameChart(plays) {
    const ctx = document.getElementById('gameChart').getContext('2d');
    if (window.gameChartInstance) window.gameChartInstance.destroy();
    if (!plays.length) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      return;
    }
    // Remove all tick labels from the x-axis
    const labels = plays.map(() => '');
    window.gameChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Bills Win Probability (Game Progression)',
          data: plays.map(p => Number(p.home_wp)),
          borderColor: '#3777ff',
          backgroundColor: 'rgba(55,119,255,0.1)',
          fill: true,
          tension: 0.2,
          pointRadius: 2,
          pointHoverRadius: 6
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Win Probability: ${context.parsed.y.toFixed(3)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            title: { display: true, text: 'Win Probability' }
          },
          x: {
            title: { display: true, text: 'Game Progression (Quarter Start Times)' },
            ticks: {
              display: false
            }
          }
        }
      }
    });
  }

  // Initial render
  weekSelect.value = allWeeks[0];
  let games = getGamesForWeek(data, allWeeks[0]);
  if (games.length) {
    drawGameChart(getGamePlays(data, games[0].game_id));
  } else {
    drawGameChart([]);
  }
  drawSeasonChart(data, allWeeks);

  weekSelect.addEventListener('change', () => {
    games = getGamesForWeek(data, weekSelect.value);
    if (games.length) {
      drawGameChart(getGamePlays(data, games[0].game_id));
    } else {
      drawGameChart([]);
    }
  });
}

function drawSeasonChart(data, weeks) {
  // Aggregate by week: average Bills win probability per week
  const weekProbs = weeks.map(week => {
    const games = getGamesForWeek(data, week);
    // Average win probability for Bills in each week
    const avg = games.length ? games.reduce((sum, g) => sum + Number(g.home_wp), 0) / games.length : 0;
    return avg;
  });
  const ctx = document.getElementById('seasonChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: weeks.map(w => `Week ${w}`),
      datasets: [{
        label: 'Average Bills Win Probability',
        data: weekProbs,
        borderColor: '#ff5733',
        backgroundColor: 'rgba(255,87,51,0.1)',
        fill: true,
        tension: 0.2,
        pointRadius: 5,
        pointHoverRadius: 8
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Win Probability: ${context.parsed.y.toFixed(3)}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          title: { display: true, text: 'Win Probability' }
        }
      }
    }
  });
}

main();
main();
