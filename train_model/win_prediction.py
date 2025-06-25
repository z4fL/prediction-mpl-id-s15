import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

import pickle
import os

mpl_df = pd.read_csv("../dataset/MPL_ID_S15.csv")
attributes_df = pd.read_csv("../dataset/heroes_detail_1.9.72.csv")

mpl_df.drop(columns=[
    'match_id',
    'tournament',
    'stage',
    'region',
    'date',
    'game_number',
    'blue_team',
    'red_team',
    'blue_bans',
    'red_bans',
    'game_duration'
    ], inplace=True)

attributes_df.drop(columns=[
    'id',
    'main_role',
    'secondary_role',
    'main_lane',
    'secondary_lane',
    'first_speciality',
    'secondary_speciality',
    'portrait',
    'icon'
    ], inplace=True)

# Fungsi untuk menambahkan sum atribut untuk tiap side
def calculate_side_features(mpl_df, attribute_df):
    # Buat dictionary mapping hero untuk lookup cepat
    attribute_dict = attribute_df.set_index('name')[['durability', 'offense', 'control_effects', 'difficulty', 'early', 'mid', 'late']].to_dict('index')

    # Fungsi internal untuk menghitung sum atribut dari satu sisi (blue atau red)
    def sum_attributes(row, side):
        positions = ['explaner', 'jungler', 'midlaner', 'goldlaner', 'roamer']
        features = ['durability', 'offense', 'control_effects', 'difficulty', 'early', 'mid', 'late']
        side_sums = {f"{side}_{feature}": 0 for feature in features}

        for pos in positions:
            hero = row[f"{side}_{pos}"]
            if hero in attribute_dict:
                for feature in features:
                    side_sums[f"{side}_{feature}"] += attribute_dict[hero][feature]

        return pd.Series(side_sums)

    # Apply fungsi di atas untuk setiap row di mpl_df
    blue_features = mpl_df.apply(lambda row: sum_attributes(row, 'blue'), axis=1)
    red_features = mpl_df.apply(lambda row: sum_attributes(row, 'red'), axis=1)

    # Gabungkan hasil ke mpl_df
    mpl_df = pd.concat([mpl_df, blue_features, red_features], axis=1)

    # Hitung total power spike untuk tiap side
    mpl_df['blue_total_power_spike'] = mpl_df[['blue_early', 'blue_mid', 'blue_late']].sum(axis=1)
    mpl_df['red_total_power_spike'] = mpl_df[['red_early', 'red_mid', 'red_late']].sum(axis=1)

    return mpl_df

# fungsi untuk menghitung Differences in Team Attributes and Performance
def perform_feature_engineering(mpl_df):
    # Feature engineering berdasarkan perbedaan atribut
    mpl_df['durability_diff'] = mpl_df['blue_durability'] - mpl_df['red_durability']
    mpl_df['offense_diff'] = mpl_df['blue_offense'] - mpl_df['red_offense']
    mpl_df['control_effects_diff'] = mpl_df['blue_control_effects'] - mpl_df['red_control_effects']
    mpl_df['difficulty_diff'] = mpl_df['blue_difficulty'] - mpl_df['red_difficulty']
    mpl_df['power_spike_diff'] = mpl_df['blue_total_power_spike'] - mpl_df['red_total_power_spike']

    # Average nilai untuk role per team
    mpl_df['blue_avg_durability'] = mpl_df['blue_durability'] / 5
    mpl_df['red_avg_durability'] = mpl_df['red_durability'] / 5
    mpl_df['blue_avg_offense'] = mpl_df['blue_offense'] / 5
    mpl_df['red_avg_offense'] = mpl_df['red_offense'] / 5

    # Skor aggressiveness
    mpl_df['blue_aggressiveness_score'] = mpl_df['blue_offense'] / mpl_df['blue_durability']
    mpl_df['red_aggressiveness_score'] = mpl_df['red_offense'] / mpl_df['red_durability']

    # Perbandingan early-mid dan mid-late untuk tim blue
    mpl_df['blue_early_mid_ratio'] = np.where(mpl_df['blue_mid'] == 0, 1, mpl_df['blue_early'] / mpl_df['blue_mid'])
    mpl_df['blue_mid_late_ratio'] = np.where(mpl_df['blue_late'] == 0, 1, mpl_df['blue_mid'] / mpl_df['blue_late'])

    # Perbandingan early-mid dan mid-late untuk tim red
    mpl_df['red_early_mid_ratio'] = np.where(mpl_df['red_mid'] == 0, 1, mpl_df['red_early'] / mpl_df['red_mid'])
    mpl_df['red_mid_late_ratio'] = np.where(mpl_df['red_late'] == 0, 1, mpl_df['red_mid'] / mpl_df['red_late'])

    # Drop kolom posisi yang tidak dipakai
    mpl_df.drop(columns=[
        'blue_explaner', 'blue_jungler', 'blue_midlaner', 'blue_goldlaner', 'blue_roamer',
        'red_explaner', 'red_jungler', 'red_midlaner', 'red_goldlaner', 'red_roamer'
    ], inplace=True)

    # Drop kolom yang tidak diperlukan untuk model
    mpl_df = mpl_df.drop(columns=[
        'blue_durability', 'blue_offense', 'blue_control_effects', 'blue_difficulty',
        'red_durability', 'red_offense', 'red_control_effects', 'red_difficulty',
        'blue_total_power_spike',
        'blue_early', 'blue_mid', 'blue_late',
        'red_total_power_spike',
        'red_early', 'red_mid', 'red_late'
    ])

    return mpl_df

# calculate side features
mpl_df_new = calculate_side_features(mpl_df, attributes_df)
# differences in team attributes and performance
mpl_df_transformed = perform_feature_engineering(mpl_df_new)
# rounded 3
mpl_df_transformed = mpl_df_transformed.round(3)

X = mpl_df_transformed.drop(columns=['winner'])  # Semua kolom kecuali 'result'
y = mpl_df_transformed['winner']  # Kolom target

# Split dataset 75/25
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

# Melatih model Random Forest
rf_model = RandomForestClassifier(
    max_depth=15,
    n_estimators=160,
    random_state=8,
    class_weight='balanced'
)
rf_model.fit(X_train, y_train)

# Melakukan prediksi pada data test
y_pred = rf_model.predict(X_test)

# Hitung akurasi
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy:.2f}')

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
print('Confusion Matrix:')
print(cm)

# Classification report
report = classification_report(y_test, y_pred)
print('Classification Report:')
print(report)

scores = cross_val_score(rf_model, X, y, cv=5)
print("CV Mean Accuracy:", scores.mean())

# Saving model
filename = 'rf_model.pkl'
model_dir = '../model'
os.makedirs(model_dir, exist_ok=True)
model_path = os.path.join(model_dir, filename)
pickle.dump(rf_model, open(model_path, 'wb'))

print(f"Model saved to {filename}")