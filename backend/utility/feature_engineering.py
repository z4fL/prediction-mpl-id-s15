import pandas as pd
import numpy as np

# feature_engineering
def helper_function(mpl_df, attribute_df):
    # Buat dictionary hero untuk lookup cepat
    attribute_dict = attribute_df.set_index('hero')[['durability', 'offense', 'control_effects', 'difficulty', 'early', 'mid', 'late']].to_dict('index')

    # Fungsi untuk menghitung total atribut untuk setiap tim
    def sum_attributes(row, side):
        positions = ['explaner', 'jungler', 'midlaner', 'goldlaner', 'roamer']
        features = ['durability', 'offense', 'control_effects', 'difficulty', 'early', 'mid', 'late']
        side_sums = {f"{side}_{feature}": sum(attribute_dict.get(row[f"{side}_{pos}"], {}).get(feature, 0) for pos in positions) for feature in features}
        return pd.Series(side_sums)

    # Apply fungsi sum_attributes untuk blue dan red team
    blue_features = mpl_df.apply(lambda row: sum_attributes(row, 'blue'), axis=1)
    red_features = mpl_df.apply(lambda row: sum_attributes(row, 'red'), axis=1)

    # Gabungkan hasil ke dalam mpl_df
    mpl_df = pd.concat([mpl_df, blue_features, red_features], axis=1)

    # Hitung total power spike
    mpl_df['blue_total_power_spike'] = mpl_df[['blue_early', 'blue_mid', 'blue_late']].sum(axis=1)
    mpl_df['red_total_power_spike'] = mpl_df[['red_early', 'red_mid', 'red_late']].sum(axis=1)

    # Tambahkan perbedaan atribut
    mpl_df['durability_diff'] = mpl_df['blue_durability'] - mpl_df['red_durability']
    mpl_df['offense_diff'] = mpl_df['blue_offense'] - mpl_df['red_offense']
    mpl_df['control_effects_diff'] = mpl_df['blue_control_effects'] - mpl_df['red_control_effects']
    mpl_df['difficulty_diff'] = mpl_df['blue_difficulty'] - mpl_df['red_difficulty']
    mpl_df['power_spike_diff'] = mpl_df['blue_total_power_spike'] - mpl_df['red_total_power_spike']

    # Rata-rata nilai untuk role per team
    for feature in ['durability', 'offense']:
        mpl_df[f'blue_avg_{feature}'] = mpl_df[f'blue_{feature}'] / 5
        mpl_df[f'red_avg_{feature}'] = mpl_df[f'red_{feature}'] / 5

    # Aggressiveness score
    mpl_df['blue_aggressiveness_score'] = mpl_df['blue_offense'] / mpl_df['blue_durability']
    mpl_df['red_aggressiveness_score'] = mpl_df['red_offense'] / mpl_df['red_durability']

    # Perbandingan early-mid dan mid-late untuk kedua tim
    for side in ['blue', 'red']:
        mpl_df[f'{side}_early_mid_ratio'] = np.where(mpl_df[f'{side}_mid'] == 0, 1, mpl_df[f'{side}_early'] / mpl_df[f'{side}_mid'])
        mpl_df[f'{side}_mid_late_ratio'] = np.where(mpl_df[f'{side}_late'] == 0, 1, mpl_df[f'{side}_mid'] / mpl_df[f'{side}_late'])

    # Drop kolom posisi yang tidak dipakai
    mpl_df.drop(columns=[f'{side}_{pos}' for side in ['blue', 'red'] for pos in ['explaner', 'jungler', 'midlaner', 'goldlaner', 'roamer']], inplace=True)

    # Drop kolom atribut yang sudah dihitung
    drop_columns = [
        'blue_durability', 'blue_offense', 'blue_control_effects', 'blue_difficulty',
        'red_durability', 'red_offense', 'red_control_effects', 'red_difficulty',
        'blue_total_power_spike', 'red_total_power_spike',
        'blue_early', 'blue_mid', 'blue_late',
        'red_early', 'red_mid', 'red_late'
    ]
    mpl_df.drop(columns=drop_columns, inplace=True)

    return mpl_df.round(3)
