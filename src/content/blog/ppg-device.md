---
title: PPG Device
description: PPG Device
pubDate: 2026-10-01
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

Assume two relevant haemoglobin species, oxygenated haemoglobin (HbO2) and deoxygenated haemoglobin
Typical wavelengths are 660nm and 940nm.


Go back to the topic, the PPG device we are building is more like the
