---
name: timer-choreography
description: Precision timing preset choreography and Rickroll reaction capture workflow
---

# Timer Choreography Subsystem

## Overview
Timer Mode in GazeCam provides comedic timing distortions. It operates completely independently of gaze detection, using explicit array step timings `{ label, durationMs }` rather than simple `setInterval` loops.

## Preset Definitions & Exact Step Timings

### 1. "3 sec" Preset (Suspiciously Long ~7s Total)
- `"3"` -> 4000ms
- `"2"` -> 2000ms
- `"1"` -> 1000ms
- Total duration: 7000ms -> Trigger capture.

### 2. "10 sec" Preset (Blitz Collapse ~4s Total)
- `"10"` -> 1000ms
- `"9"` -> 1000ms
- `"8"` -> 1000ms
- `"7"` down to `"1"` -> 143ms each (blitz speed ~1000ms total)
- Total duration: ~4000ms -> Trigger capture.

### 3. "5 sec" Preset (Rickroll Trap)
- `"5"`, `"4"`, `"3"`, `"2"`, `"1"` -> 1000ms each (5000ms total normal speed)
- **CRITICAL WARNING**: Do NOT collapse this preset into a direct photo capture upon step completion!
- Instead, upon `"1"` finishing:
  1. Trigger full-screen `RickrollOverlay` (`dQw4w9WgXcQ` YouTube video embed).
  2. Keep picture-in-picture (PiP) live webcam feed active in bottom-right corner to capture user reaction.
  3. After ~4.5s (or upon user clicking skip button), dismiss overlay and trigger capture on the live frame.
