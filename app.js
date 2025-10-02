// Load data from a static JSON file (to be generated from bills.db)
async function fetchData() {
  try {
    const response = await fetch('bills_data.json');
    if (!response.ok) throw new Error('Failed to load bills_data.json');
    return response.json();
  } catch (err) {
    showError('Could not load game data. Please check bills_data.json and reload the page.');
    throw err;
  }
}
function showError(msg) {
  let errDiv = document.getElementById('errorMessage');
  if (!errDiv) {
    errDiv = document.createElement('div');
    errDiv.id = 'errorMessage';
    errDiv.style.background = '#ffeaea';
    errDiv.style.color = '#a00';
    errDiv.style.textAlign = 'center';
    errDiv.style.fontWeight = 'bold';
    errDiv.style.padding = '18px';
    errDiv.style.margin = '30px auto';
    errDiv.style.borderRadius = '10px';
    errDiv.style.boxShadow = '0 2px 8px rgba(200,0,0,0.07)';
    errDiv.style.maxWidth = '700px';
    document.body.insertBefore(errDiv, document.body.firstChild);
  }
  errDiv.textContent = msg;
}

function renderMath(element, latex) {
  katex.render(latex, element, {throwOnError: false});
}

function getUniqueWeeks(data) {
  return [...new Set(data.map(row => row.week))].sort((a, b) => a - b);
}

// Return unique games for a given week
function getGamesForWeek(data, week) {
  const games = {};
  data.forEach(row => {
    if (row.week == week && !games[row.game_id]) {
      games[row.game_id] = {
        game_id: row.game_id,
        home_team: row.home_team,
        away_team: row.away_team,
        week: row.week,
        game_date: row.game_date
      };
    }
  });
  return Object.values(games);
}

// NFL team logo mapping (sportslogos.net)
const teamLogos = {
  ARI: 'https://www.sportslogos.net/logos/7/173/full/2997.png',
  ATL: 'https://www.sportslogos.net/logos/7/165/full/2990.png',
  BAL: 'https://www.sportslogos.net/logos/7/153/full/318.png',
  BUF: 'https://www.sportslogos.net/logos/7/154/full/907.png',
  CAR: 'https://www.sportslogos.net/logos/7/156/full/963.png',
  CHI: 'https://www.sportslogos.net/logos/7/169/full/364.png',
  CIN: 'https://www.sportslogos.net/logos/7/158/full/964.png',
  CLE: 'https://www.sportslogos.net/logos/7/155/full/1552.png',
  DAL: 'https://www.sportslogos.net/logos/7/159/full/406.png',
  DEN: 'https://www.sportslogos.net/logos/7/161/full/430.png',
  DET: 'https://www.sportslogos.net/logos/7/170/full/1398.png',
  GB: 'https://www.sportslogos.net/logos/7/171/full/1712.png',
  HOU: 'https://www.sportslogos.net/logos/7/157/full/5705.png',
  IND: 'https://www.sportslogos.net/logos/7/158/full/593.png',
  JAX: 'https://www.sportslogos.net/logos/7/159/full/1599.png',
  KC: 'https://www.sportslogos.net/logos/7/162/full/364.png',
  LV: 'https://www.sportslogos.net/logos/7/163/full/6709.png',
  LAC: 'https://www.sportslogos.net/logos/7/164/full/4267.png',
  LAR: 'https://www.sportslogos.net/logos/7/165/full/5946.png',
  MIA: 'https://www.sportslogos.net/logos/7/166/full/1506.png',
  MIN: 'https://www.sportslogos.net/logos/7/172/full/1726.png',
  NE: 'https://www.sportslogos.net/logos/7/177/full/137.png',
  NO: 'https://www.sportslogos.net/logos/7/175/full/907.png',
  NYG: 'https://www.sportslogos.net/logos/7/168/full/919.png',
  NYJ: 'https://www.sportslogos.net/logos/7/152/full/1526.png',
  PHI: 'https://www.sportslogos.net/logos/7/167/full/1676.png',
  PIT: 'https://www.sportslogos.net/logos/7/161/full/970.png',
  SEA: 'https://www.sportslogos.net/logos/7/174/full/827.png',
  SF: 'https://www.sportslogos.net/logos/7/179/full/1797.png',
  TB: 'https://www.sportslogos.net/logos/7/176/full/1766.png',
  TEN: 'https://www.sportslogos.net/logos/7/160/full/1602.png',
  WAS: 'https://www.sportslogos.net/logos/7/169/full/1689.png'
};

// NFL team full names mapping
const teamNames = {
  ARI: 'Arizona Cardinals',
  ATL: 'Atlanta Falcons',
  BAL: 'Baltimore Ravens',
  BUF: 'Buffalo Bills',
  CAR: 'Carolina Panthers',
  CHI: 'Chicago Bears',
  CIN: 'Cincinnati Bengals',
  CLE: 'Cleveland Browns',
  DAL: 'Dallas Cowboys',
  DEN: 'Denver Broncos',
  DET: 'Detroit Lions',
  GB: 'Green Bay Packers',
  HOU: 'Houston Texans',
  IND: 'Indianapolis Colts',
  JAX: 'Jacksonville Jaguars',
  KC: 'Kansas City Chiefs',
  LV: 'Las Vegas Raiders',
  LAC: 'Los Angeles Chargers',
  LAR: 'Los Angeles Rams',
  MIA: 'Miami Dolphins',
  MIN: 'Minnesota Vikings',
  NE: 'New England Patriots',
  NO: 'New Orleans Saints',
  NYG: 'New York Giants',
  NYJ: 'New York Jets',
  PHI: 'Philadelphia Eagles',
  PIT: 'Pittsburgh Steelers',
  SEA: 'Seattle Seahawks',
  SF: 'San Francisco 49ers',
  TB: 'Tampa Bay Buccaneers',
  TEN: 'Tennessee Titans',
  WAS: 'Washington Commanders'
};

// Team color mapping for gradients
const teamColors = {
  ARI: '#f8c6d8', ATL: '#ffd1dc', BAL: '#d1c6f8', BUF: '#c6d8f8', CAR: '#c6f8f8', CHI: '#d1d1d1', CIN: '#ffe5b4', CLE: '#e6d8b6', DAL: '#c6d8f8', DEN: '#ffe5b4', DET: '#c6f8f8', GB: '#d1e6d1', HOU: '#ffd1dc', IND: '#c6d8f8', JAX: '#c6f8f8', KC: '#ffd1dc', LV: '#f8f8f8', LAC: '#c6f8f8', LAR: '#c6d8f8', MIA: '#c6f8f8', MIN: '#d1c6f8', NE: '#d1d1d1', NO: '#fff8dc', NYG: '#d1d1d1', NYJ: '#d1f8d1', PHI: '#d1f8d1', PIT: '#fff8dc', SEA: '#d1d1d1', SF: '#ffd1dc', TB: '#ffd1dc', TEN: '#d1e6f8', WAS: '#e6d1d1'
};

function setGradientBackground(home, away) {
  const homeColor = teamColors[home] || '#c6d8f8';
  const awayColor = teamColors[away] || '#f8f8f8';
  // Create a smooth ombre effect between pastel team colors
  document.body.style.background = `linear-gradient(90deg, ${homeColor} 0%, ${awayColor} 100%)`;
}

function renderBackgroundIcons() {
  let bg = document.querySelector('.bg-icons');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'bg-icons';
    document.body.appendChild(bg);
  }
  bg.innerHTML = '';
  // Only tiny white outlined stars and sparkles
  const icons = [
    { html: '★', class: 'star' },
    { html: '✨', class: 'icon' }
  ];
  for (let i = 0; i < 32; i++) {
    const icon = icons[Math.floor(Math.random() * icons.length)];
    const el = document.createElement('span');
    el.className = icon.class;
    el.innerHTML = icon.html;
    el.style.top = `${Math.random() * 95}vh`;
    el.style.left = `${Math.random() * 98}vw`;
    el.style.fontSize = `${0.9 + Math.random() * 0.7}em`;
    bg.appendChild(el);
  }
}

function updateGameHeader(game) {
  const header = document.getElementById('gameHeader');
  if (!game) {
    header.innerHTML = '';
    setGradientBackground('BUF', 'BUF');
    renderBackgroundIcons();
    return;
  }
  const homeName = teamNames[game.home_team] || game.home_team;
  const awayName = teamNames[game.away_team] || game.away_team;
  header.innerHTML = `
    <span style="font-size:1.15em;font-weight:bold;vertical-align:middle;">
      ${homeName} vs ${awayName}
    </span>
  `;
  setGradientBackground(game.home_team, game.away_team);
  renderBackgroundIcons();
}


async function main() {
  let data;
  try {
    data = await fetchData();
    if (!Array.isArray(data) || data.length === 0) {
      showError('No data loaded. Please check bills_data.json.');
      return;
    }
  } catch (err) {
    showError('Error loading data: ' + err.message);
    return;
  }
  // Only show weeks 1-21, even if some are missing
  const allWeeks = Array.from({length: 21}, (_, i) => i + 1);
  const weekSelect = document.getElementById('week');
  if (!weekSelect) {
    showError('Week dropdown not found in HTML.');
    return;
  }


  // Calculate excitement for each game
  function calculateExcitement(plays) {
    let excitement = 0;
    for (let i = 1; i < plays.length; i++) {
      excitement += Math.abs(Number(plays[i].home_wp) - Number(plays[i-1].home_wp));
    }
    return excitement;
  }

  // Find the most exciting game across all weeks
  let mostExcitingGame = null;
  let mostExcitement = -1;
  let mostExcitingWeek = null;
  let mostExcitingGameId = null;
  for (let week of allWeeks) {
    const games = getGamesForWeek(data, week);
    for (let game of games) {
      const plays = data.filter(row => row.game_id === game.game_id);
      const excitement = calculateExcitement(plays);
      if (excitement > mostExcitement) {
        mostExcitement = excitement;
        mostExcitingGame = game;
        mostExcitingWeek = week;
        mostExcitingGameId = game.game_id;
      }
    }
  }

  // Populate week dropdown (show all weeks, always enabled, star most exciting)
  weekSelect.innerHTML = '';
  allWeeks.forEach(week => {
    const option = document.createElement('option');
    option.value = week;
    let label = `Week ${week}`;
    if (week === mostExcitingWeek) {
      label += ' ★';
    }
    option.textContent = label;
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
      },
      plugins: [],
      // Set fixed size for all charts
      responsive: false,
      maintainAspectRatio: false
    });
  }

  function drawExcitementChart(plays) {
    const ctx = document.getElementById('excitementChart').getContext('2d');
    if (window.excitementChartInstance) window.excitementChartInstance.destroy();
    if (!plays.length) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      return;
    }
    const excitementData = [0];
    for (let i = 1; i < plays.length; i++) {
      excitementData.push(Math.abs(Number(plays[i].home_wp) - Number(plays[i-1].home_wp)));
    }
    window.excitementChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: plays.map(() => ''),
        datasets: [{
          label: 'Game Excitement (Win Probability Swings)',
          data: excitementData,
          borderColor: '#ffd700',
          backgroundColor: 'rgba(255,215,0,0.1)',
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
                return `Excitement: ${context.parsed.y.toFixed(3)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            title: { display: true, text: 'Excitement (Abs Δ Win Probability)' }
          },
          x: {
            title: { display: true, text: 'Game Progression' },
            ticks: {
              display: false
            }
          }
        }
      },
      plugins: [],
      // Set fixed size for all charts
      responsive: false,
      maintainAspectRatio: false
    });
  }

  // Add excitement statement element
  let excitementStatement = document.getElementById('excitementStatement');
  if (!excitementStatement) {
    excitementStatement = document.createElement('div');
    excitementStatement.id = 'excitementStatement';
    excitementStatement.style.textAlign = 'center';
    excitementStatement.style.fontWeight = 'bold';
    excitementStatement.style.margin = '20px 0';
    document.body.insertBefore(excitementStatement, document.body.children[3]);
  }

  // Initial render: show first Bills game for the first available week
  // Always select the first week by default
  weekSelect.value = allWeeks[0];
  // Render charts for week 1 immediately
  setTimeout(() => {
    weekSelect.dispatchEvent(new Event('change'));
  }, 0);

  // Display the most exciting game explanation only for the most exciting week
  function updateExcitementStatement(week) {
    const explanationDiv = document.getElementById('excitingExplanation');
    if (week == mostExcitingWeek) {
      excitementStatement.textContent = '★ Most Exciting Game';
      if (explanationDiv) {
        const homeName = teamNames[mostExcitingGame.home_team] || mostExcitingGame.home_team;
        const awayName = teamNames[mostExcitingGame.away_team] || mostExcitingGame.away_team;
        explanationDiv.innerHTML = `<strong>Most Exciting Game: Week ${mostExcitingWeek} (${homeName} vs ${awayName})</strong><br>Excitement: ${mostExcitement.toFixed(3)}<br><em>An exciting game is one with frequent and dramatic swings in win probability, meaning the outcome is uncertain and both teams have chances to win throughout. Close scores, lead changes, and unpredictable moments all contribute to excitement.</em>`;
        explanationDiv.style.display = '';
      }
    } else {
      excitementStatement.textContent = '';
      if (explanationDiv) explanationDiv.style.display = 'none';
    }
  }
  updateExcitementStatement(allWeeks[0]);

  // Enable week selection and restore dropdown functionality
  weekSelect.disabled = false;

  weekSelect.addEventListener('change', () => {
    const selectedWeek = Number(weekSelect.value);
    const games = getGamesForWeek(data, selectedWeek).filter(g => g.home_team === 'BUF' || g.away_team === 'BUF');
    if (games.length) {
      const game = games[0];
      const plays = data.filter(row => row.game_id === game.game_id);
      drawGameChartFixedY(plays);
      drawExcitementChartFixedY(plays);
      updateGameHeader(game);
      showError('');
    } else {
      drawGameChartFixedY([]);
      drawExcitementChartFixedY([]);
      updateGameHeader(null);
      showError('No Bills games found for this week.');
    }
  updateExcitementStatement(selectedWeek);
  // Removed season chart rendering for cleanup
  });
// Draw game chart with y-axis fixed at 0.5
function drawGameChartFixedY(plays) {
  const chartElem = document.getElementById('gameChart');
  if (!chartElem) {
    showError('Game chart canvas not found.');
    return;
  }
  const ctx = chartElem.getContext('2d');
  if (window.gameChartInstance) window.gameChartInstance.destroy();
  if (!plays.length) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return;
  }
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
          min: 0,
          max: 1.0,
          title: { display: true, text: 'Win Probability' }
        },
        x: {
          title: { display: true, text: 'Game Progression' },
          ticks: { display: false }
        }
      }
    },
    plugins: [],
    responsive: false,
    maintainAspectRatio: false
  });
}
// Draw excitement chart with y-axis fixed at 0.5
function drawExcitementChartFixedY(plays) {
  const chartElem = document.getElementById('excitementChart');
  if (!chartElem) {
    showError('Excitement chart canvas not found.');
    return;
  }
  const ctx = chartElem.getContext('2d');
  if (window.excitementChartInstance) window.excitementChartInstance.destroy();
  if (!plays.length) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return;
  }
  const excitementData = [0];
  for (let i = 1; i < plays.length; i++) {
    excitementData.push(Math.abs(Number(plays[i].home_wp) - Number(plays[i-1].home_wp)));
  }
  window.excitementChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: plays.map(() => ''),
      datasets: [{
        label: 'Game Excitement (Win Probability Swings)',
        data: excitementData,
        borderColor: '#ffd700',
        backgroundColor: 'rgba(255,215,0,0.1)',
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
              return `Excitement: ${context.parsed.y.toFixed(3)}`;
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 0.3,
          title: { display: true, text: 'Excitement (Abs Δ Win Probability)' }
        },
        x: {
          title: { display: true, text: 'Game Progression' },
          ticks: { display: false }
        }
      }
    },
    plugins: [],
    responsive: false,
    maintainAspectRatio: false
  });
}
}

function drawSeasonChart(data, weeks) {
// Draw season chart with y-axis fixed at 0.5
function drawSeasonChartFixedY(data, weeks) {
  // For each week, get all games, then for each game get the last play's home_wp
  // Show average Bills win probability for each week across the whole season
  // For each week, get all Bills games, then for each game get the last play's home_wp
  // Show average Bills win probability for each week across the whole season
  const weekProbs = weeks.map(week => {
    // Find all plays for Bills games in this week
    const plays = data.filter(row => row.week === week && (row.home_team === 'BUF' || row.away_team === 'BUF'));
    if (!plays.length) return 0;
    // Find the last play for each game
    const lastPlays = {};
    plays.forEach(row => {
      lastPlays[row.game_id] = row;
    });
    const probs = Object.values(lastPlays).map(p => Number(p.home_wp));
    return probs.length ? probs.reduce((a, b) => a + b, 0) / probs.length : 0;
  });
  const chartElem = document.getElementById('seasonChart');
  if (!chartElem) {
    showError('Season chart canvas not found.');
    return;
  }
  const ctx = chartElem.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: weeks.map(w => `Week ${w}`),
      datasets: [{
        label: 'Average Bills Win Probability (Whole Season)',
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
              return `Win Probability: ${context.parsed.y !== null ? context.parsed.y.toFixed(3) : 'N/A'}`;
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 1.0,
          title: { display: true, text: 'Win Probability' }
        },
        x: {
          title: { display: true, text: 'Week' }
        }
      }
    }
  });
}
  // ...existing code...
}

// Wait for Chart.js to be loaded before running main
function waitForChartJs(cb) {
  if (window.Chart) {
    cb();
  } else {
    setTimeout(() => waitForChartJs(cb), 100);
  }
}
waitForChartJs(main);
