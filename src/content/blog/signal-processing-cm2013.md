---
title: Signal Processing CM2013
description: ""
pubDate: 2026-11-18
draft: true
---
Both columns are time-locked, but only the left is phase-locked.

![https://res.cloudinary.com/aiigdmpw/image/upload/v1795076379/phase_locked_vs_time_locked.svg](https://res.cloudinary.com/aiigdmpw/image/upload/v1795076379/phase_locked_vs_time_locked.svg)

- **Phase-locked activity** survives averaging. This is why an ERP (event-related potential) only contains phase-locked activity. Researchers often call this **evoked activity**.
- **Non-phase-locked activity** cancels out in the average. The activity is still there in every trial, but the plain average hides it. This is called **induced activity**. To see it, you do a time-frequency analysis on each trial first, compute the power, and then average the power. Power ignores phase, so nothing cancels.

How we measure:
- Time-locked power (both evoked and induced)
	- ERSP event-related spectral perturbation, or ERD/ERS (event-related desynchronization/synchronization) Phase-locking across trials: ITC (inter-trial phase coherence), also called PLF (phase-locking factor). It goes from 0 (random phases) to 1 (identical phase in every trial).


Slepian taper sequences:


