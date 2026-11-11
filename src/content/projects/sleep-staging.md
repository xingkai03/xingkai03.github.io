---
title: Automatic sleep staging from EEG, EOG and EMG
context: Group project · CM2013, KTH · 2026
order: 1
featured: true
summary: >-
  A pipeline that labels every 30-second epoch of an overnight recording as Wake,
  N1, N2, N3 or REM, using the public Sleep-EDF dataset. It runs in three stages:
  signal preprocessing, feature extraction and machine learning.
highlights:
  - Subject-wise validation (leave-one-subject-out and grouped k-fold on 68 subjects), so the model is always tested on people it has never seen.
  - On a three-subject pilot, adding validated spectral features raised Cohen's κ from 0.75 to 0.78 and macro-F1 from 0.65 to 0.68.
  - "Reproducible engineering: locked Python environment, 60+ automated tests and a results log recording every change and why it was kept."
tools:
  - Python
  - MNE
  - SciPy
  - scikit-learn
  - Signal processing
links:
  - label: Code on GitHub
    href: https://github.com/xingkai03/CM2013_SleepEDF_Group14
---
