import csv
import json

# Only keep relevant columns for frontend
KEEP_COLS = [
    'play_id', 'game_id', 'home_team', 'away_team', 'week', 'game_date', 'home_wp'
]

rows = []
with open('bills.csv', newline='') as f:
    reader = csv.DictReader(f)
    count_total = 0
    count_exported = 0
    first_row_printed = False
    for row in reader:
        if not first_row_printed:
            print("First row:", row)
            first_row_printed = True
        # Only keep regular season weeks 1-21
        try:
            week = int(row['week'])
        except:
            continue
        if not (1 <= week <= 21):
            continue
        # Only keep plays with win probability
        if row['home_wp'] == '' or row['game_id'] == '':
            continue
        filtered = {k: row[k] for k in KEEP_COLS}
        filtered['week'] = week
        filtered['home_wp'] = float(row['home_wp'])
        rows.append(filtered)

with open('bills_data.json', 'w') as f:
    json.dump(rows, f, indent=2)
