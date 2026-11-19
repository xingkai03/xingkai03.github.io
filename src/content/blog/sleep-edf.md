---
title: Sleep EDF
description: ""
pubDate: 2026-11-18
draft: true
---
# Aim of this project

# Data

The data source is Sleep-EDF Expanded v1.0.0, Sleep-Cassette (SC) study: 78 healthy subjects aged 25–101, mostly two nights each, ambulatory recordings of ~20 h each.

Sleep is scored in 30s epochs into five AASM (American Academy of Sleep Medicine) stages (W, N1, N2, N3, REM).

A human scorer looks at EEG, EOG (eye movements) and chin EMG (muscle tone) and applies rules that are mostly **spectral and event-based**:

## Channels and sampling

| channel        | sampling rate | usage                                                                |
| -------------- | ------------- | -------------------------------------------------------------------- |
| EEG Fpz-Cz     | 100Hz         | frontal EEG: slow waves, K-complexes, frontal spindles, eye movement |
| EEG Pz-Oz      | 100Hz         | parieto-occipital EEG: alpha(W), spindles                            |
| EOG horizontal | 100Hz         | eye movements (REM, slow rolling in N1, blinks in W)                 |
| EMG submental  | 1Hz           | RMS envelope, not raw EMG                                            |
### EEG Fpz-Cz

Fpz sits on the forehead, just above the nose. Cz sits on top of the head. So this channel is the frontal EEG.

The definition of **slow waves** (from AASM): delta, 0.5~2Hz, peak-to-peak amplitude >75uV. An epoch is scored as **N3** when ≥20% of it consists of slow waves. (Feature: `sw_frac75`)

**K-complex** is a single large, sharp wave that stands out from the background.
- A sharp negative (upward) deflection followed immediately by a slower positive one, lasting at least 0.5s in total, often well over 75 uV.
- It can happen on its own or be triggered by a sound or touch, and a spindle often rides on its tail.
- It’s largest over the front of the head, so Fpz-Cz is the best channel for it here.

**Sleep spindle** is a short burst of fast, waxing-and-waning oscillation, like a spindle of thread on the trace.
- 11–16Hz (most often 12–14 Hz), lasting at least 0.5 s, typically 0.5–2s.
- Produced by the thalamus, and thought to protect sleep and help consolidate memory.
- They’re usually largest over the centre of the head. “Slow” spindles (about 11–13 Hz) tend to be frontal, and “fast” spindles (about 13–16 Hz) tend to be centro-parietal. That’s why both Fpz-Cz and Pz-Oz see them.

![spindle_kcomplex_examples](https://res.cloudinary.com/aiigdmpw/image/upload/v1795026595/spindle_kcomplex_examples.png)


An epoch with either one of **K-complex** or **frontal spindle** is scored as **N2**. (AASM)

**Eye movement** (ocular artifact): the eye has electrical polarity, the ==cornea== at the front is +, and the ==retina== at the back is −. When the eye rotates, the electric field around the eye changes. Fpz picks this up much more strongly than Pz-Oz at the back of the head.

### EEG Pz-Oz

Pz sits on top-back of the head, so it's called parieto-occipital EEG.

**Alpha wave** is a 8~12 Hz rhythm that waxes and wanes. It appears when awake with eyes closed and shrinks when you open your eyes or start to fall asleep.
- It comes from the visual (occipital) cortex, so it’s strongest at Oz.
- An epoch is scored as W when more than half of it has alpha.
- The fading of alpha is one way to recognise the move into N1.

![pz_oz_alpha_spindles](https://res.cloudinary.com/aiigdmpw/image/upload/v1795027826/pz_oz_alpha_spindles.png)

**Spindles** can be seen by Pz-Oz too, just less strongly. Spindles are usually strongest at the centre of the head (Cz). The faster (13–16 Hz) centro-parietal spindles are more visible on Pz-Oz.

### EOG horizontal

In Sleep-EDF, EOG horizontal is a single bipolar channel with electrodes at the **outer corners of the two eyes**. When both eyes look left, one electrode gets nearer the positive cornea and the other gets farther from it, so the channel swings strongly.

![eog_horizontal](https://res.cloudinary.com/aiigdmpw/image/upload/v1795029570/eog_horizontal_examples.png)

### EMG submental

EMG submental is the muscle activity under the chin. It measures muscle tone, and its job in sleep scoring is mainly **REM atonia**.

During REM the brainstem actively paralyses the skeletal muscles, so that you don’t act out your dreams, and the chin EMG drops to its lowest level of the night.



One finding: the PSDs show no 50 Hz peak, the power line hum has been removed by the recorder's anti-alias filter.

![psd_by_stage](https://res.cloudinary.com/aiigdmpw/image/upload/v1795027713/f03_psd_by_stage.png)


## Split

| set      | subjects | nights | epochs (whole)    | epochs (in-bed window) |
| -------- | -------- | ------ | ----------------- | ---------------------- |
| training | 68       | 133    | 360621            | 168696                 |
| hold-out | 10       | 19     | 51530 (predicted) | -                      |

## Class balance

We used the in-bed window, from first sleep epoch - 30min to last sleep epoch + 30min. This window is used by most papers (like DeepSleepNet).

![class_balance](https://res.cloudinary.com/aiigdmpw/image/upload/v1795030014/Unknown.png)

## Glance into whole night

![whole_night_spectrum](https://res.cloudinary.com/aiigdmpw/image/upload/v1795030772/SC4001E0_spectrogram_features_reference.png)

What we can find:
- N3 as bright power below 2Hz
- N2 as the horizontal 12–14 Hz spindle band
- REM as low, flat spectra with no spindles plus bursts of rapid eye movements and the lowest chin-EMG of the night
- Wake as broadband power with high EMG at both ends


# Features

## Spectral block

We are choosing between **periodogram, Welch and multitaper**:
- Periodogram (raw): take FFT of the whole epoch (3000 samples), square the magnitude and scale it.
	- of a 30-s epoch has frequency resolution 1/30 Hz but each bin is a χ²₂ variable — its standard deviation equals its mean (≈ 100 % variance), however long the epoch;
- **Welch** (256-sample Hann segments, 50 % overlap) averages ~22 segments, cutting the variance ~10× but coarsening resolution to ≈ 0.4 Hz and leaking through the Hann side-lobes;
- **multitaper** (DPSS, NW = 3, K = 5 tapers) averages 5 orthogonal tapered periodograms of the _whole_ epoch: variance ~5× lower with resolution 2W = 0.2 Hz and excellent leakage control.
- 

1. Also try a **hybrid**: use the whole-recording model to find the predicted sleep period, then apply the in-bed model inside it ±30 min and keep the whole-recording model outside it. This uses only predictions, so it works on the hold-out, and it should get the best of both.