---
title: PPG Device
description: PPG Device
pubDate: Oct 1 2026
heroImage: ../../assets/pasted-image-1794425563147.png
---

This is a continuous lab project from KTH CM2015 Project Career Course (PCC), Part 1.

# 1 Photoplethysmography (PPG)
Abracadabra, hope I get this name right. The name, actually makes sense. Photo- = light, plethysmo- = increase (from Greek), and -graphy. It literally means photon increase recording.

## 1.1 Two kinds of PPG (transmissive & reflective)
For transmissive PPG, the light shines through the tissue (like a fingertip or earlobe) to a sensor on the opposite side. Because the light passes straight through the arterial bed, this method is the **clinical standard** for accuracy. And it's also what we are building. One example is fingertip oximeters.

![transmissive-ppg](https://res.cloudinary.com/aiigdmpw/image/upload/v1794480809/trans-ppg.svg)

For reflective PPG, the light shines into the skin on the wrist and bounces back to a sensor sitting right next to the LED. This is convenient for daily wear, but more **sensitive** to movements. One example is smart watches.

![reflective-ppg](https://res.cloudinary.com/aiigdmpw/image/upload/v1794480946/reflective-ppg.svg)

## 1.2 How PPG measures SpO2
Most modern smart watches use PPG to estimate SpO2.

<p>
<img src="https://res.cloudinary.com/aiigdmpw/image/upload/v1794427695/IMG_9925.jpg" style="width:30%;height:auto" alt="garmin-gen4-lighton" />
<img src="https://res.cloudinary.com/aiigdmpw/image/upload/v1794479313/IMG_9935.jpg" style="width:30%;height:auto" alt="garmin-gen4-spo2" />
<img src="https://res.cloudinary.com/aiigdmpw/image/upload/v1794427858/IMG_9926.jpg" style="width:30%;height:auto" alt="garmin-gen4-lightoff" />
</p>

This is my Garmin Forerunner 265, 4th generation, it has 2 LED emitters and 4 photodetectors. It shine 2 kinds of lights.
- Green, detect HR and HRV.
- Red + infrared, detect SpO2, mostly during sleep.

I tested Pulse Ox Detection in Garmin, it's a really quick flicker. I captured one frame from the video and find out that it flicker red and green the same time (the middle picture). I'm not sure if it uses this two wavelengths or there is an infrared wavelength hidden.

The calculation of SpO2 is straightforward, BME3303 Biomedical Sensors of SJTU introduced it briefly.

### 1.2.1 Oxygen saturation (SpO2) definition
There are two relevant **haemoglobin** species, oxygenated haemoglobin (HbO2) and deoxygenated haemoglobin (Hb). SpO2 is defined as:

$$
SpO_2 = \frac{c_{HbO_2}}{c_{HbO_2}+c_{Hb}} \times 100\%
$$

Hb and HbO2 have different absorption spectra, making two-wavelength estimation of SpO2 possible. Typical wavelengths are 660nm (R) and 940nm (IR).

### 1.2.2 Light absorption modelling
Beer–Lambert model for wavelength $\lambda$:

$$
I_{\lambda}=I_{0\lambda} \exp[-B_{\lambda}-CL_{\lambda}(t)(\varepsilon_{\lambda, D}(1-S)+\varepsilon_{\lambda, O}S)]
$$

It's similar to X-ray reconstruction, HU in CT. The signals all attenuate exponentially.
- $I_{\lambda}, I_{0\lambda}$ are the received intensity and source intensity
- $B_{\lambda}$ is intercept (background attenuation)
- $C$ is total arterial haemoglobin concentration
- $L_\lambda(t)$ is effective arterial optical path length, changing with pulse and time
- $\varepsilon_{\lambda,D},\varepsilon_{\lambda,O}$ are absorption coefficients of Hb and HbO₂.

Take the logarithmic change between **diastole** and **systole**:

$$
\Delta A_\lambda
=\ln\frac{I_{\lambda,\mathrm{dia}}}{I_{\lambda,\mathrm{sys}}}
=C\Delta L_\lambda
\left[
\varepsilon_{\lambda,D}
+\left(\varepsilon_{\lambda,O}-\varepsilon_{\lambda,D}\right)S
\right]
$$

Cancelling out many terms.

### 1.2.3 Solve the ratio
Two wavelengths experience equal pulsatile path length changes ($\Delta L_{\lambda}$)

$$
R_A=\frac{\Delta A_r}{\Delta A_i}
=
\frac{\varepsilon_{r,D}+(\varepsilon_{r,O}-\varepsilon_{r,D})S}
{\varepsilon_{i,D}+(\varepsilon_{i,O}-\varepsilon_{i,D})S}
$$

r for red, i for infrared. Solve S:

$$
S=
\frac{\varepsilon_{r,D}-R_A\varepsilon_{i,D}}
{R_A(\varepsilon_{i,O}-\varepsilon_{i,D})
-(\varepsilon_{r,O}-\varepsilon_{r,D})}
$$

$\varepsilon$ is constant and $R_A$ is the ratio of two measurements, and we are done! 

# 2 Circuit
Let's go back to the topic of the PPG device we are building.

## 2.1 Components
Our MCU is BBC Micro:bit. A really toy-like controller, designed by BBC for primary school students.

![microbit](https://cdn.makecode.com/blob/7c747185fef1b4f8069beb3c5c2820a5503c64a0//static/mb/projects/flashing-heart/sim.gif)

I have mixed feeling for it. On one hand, my first experience as a "maker" begins with Micro:bit, when I was like 12, 13 yrs old. I remember building the Snake game on the 5*5 LED matrix, because I didn't know its capability. On the other hand, 10 years later, now a master's student and still using it, kind of shameful. 

Anyway, it's really easy to put your hands on and it's powerful. It has builtin accelerometer, compass, temperature and light sensors, speaker and microphone, bluetooth module, 32-bit SoC and 32-bit ARM, 64MHz Clock Speed, 512KB Flash, 128KB RAM.


Our choice of components:
- Infrared LED: Vishay TSHA5200
- Infrared Phototransistor: Osram SFH310
- Band Pass Filter with Amplification
- Indicator LED
- Connectors
