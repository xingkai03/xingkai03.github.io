---
title: Signal Processing CM2013
description: ""
pubDate: 2026-11-18
draft: false
---
Both columns are time-locked, but only the left is phase-locked.

![https://res.cloudinary.com/aiigdmpw/image/upload/v1795076379/phase_locked_vs_time_locked.svg](https://res.cloudinary.com/aiigdmpw/image/upload/v1795076379/phase_locked_vs_time_locked.svg)

- **Phase-locked activity** survives averaging. This is why an ERP (event-related potential) only contains phase-locked activity. Researchers often call this **evoked activity**.
- **Non-phase-locked activity** cancels out in the average. The activity is still there in every trial, but the plain average hides it. This is called **induced activity**. To see it, you do a time-frequency analysis on each trial first, compute the power, and then average the power. Power ignores phase, so nothing cancels.

How we measure:
- Time-locked power (both evoked and induced)
	- ERSP (event-related spectral perturbation)
	- ERD/ERS (event-related desynchronization/synchronization)
- Phase-locking across trials
	- ITC (inter-trial phase coherence), also called PLF (phase-locking factor). It goes from 0 (random phases) to 1 (identical phase in every trial).

Examples:
ERD (power goes down)
- Mu/beta ERD with movement. When you move your right hand, mu (8~12 Hz) and beta (13~30 Hz) power drop over the left motor cortex (around C3). The drop starts about 1~2s before the movement. Imagining the movement gives a similar drop, and motor-imagery BCIs are built on this.

### Multitaper

**NW** is the time-half-bandwidth product. It controls how much the spectrum is smoothed across frequency.
- N is the length of the window (the number of samples, like duration T)
- W is the half-bandwidth, the frequency resolution you accept. Each peak in the spectrum gets smeared over ±W around its true frequency.

**K** is the number of tapers, K = 2NW - 1. Tapers beyond 2NW − 1 leak too much power from far-away frequencies, so they are usually not used. Less tapers get a noisier spectrum.


![https://res.cloudinary.com/aiigdmpw/image/upload/v1795082370/multitaper_explained.png](https://res.cloudinary.com/aiigdmpw/image/upload/v1795082370/multitaper_explained.png)


In the figure, NW=3 and T=2s, so W = 1.5Hz. The peak at 10Hz is spead over 8.5Hz~11.5Hz

DPSS tapers (discrete prolate spheroidal sequences, also called Slepian sequences) have no closed-form formula. They are defined by an optimisation problem.

The whole idea is about best energy concentration at band \[-W, W\] 

