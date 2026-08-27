# PEOCR-STUDY1 — Stage 2 Technical Smoke PASS

Date: 2026-08-27

```text
smoke ID = PEOCR-S2-SMOKE-2026-08-27-v1
workflow run = 33037897038
workflow conclusion = success
production smoke = PASS
independent smoke verification = PASS
scientific generation = false
formal inference performed = false
```

Technical seeds were the already-quarantined Stage 0 fixture seeds `24010001..24010004`; they are outside Stage 2's scientific seed block and remain ineligible for scientific reuse.

Verified Stage 1 dependencies:

```text
reference universe SHA-256 = 5138525eb554639a68c3234f567c17e04a7c86686554917039ce9918d9938063
historical trajectories = 1602
opening prefixes = 1604
RAW states = 76010
observations = 113642
frozen PAVA mapping SHA-256 = b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac
Stage 1 development result SHA-256 = 93c449b5d28d5fe2a51375d867f27b47880b54bc13c0ec45c6206226edd47b75
```

All production gates passed: authorization remained closed, no scientific seed was used, dependency hashes were verified, deterministic replay passed, trajectory/opening firewall probes passed, selected cross-stage overlap was zero on all axes, predictions were finite and clipped to `[0.01,0.99]`, proper scores were finite, primary bootstrap was deterministic, IRLS was executable, and the scientific source tree was clean.

Independent verification separately reconstructed the complete Stage 1 reference universe, independently replayed all four technical games, verified the frozen monotone mapping/clipping contract, and verified exact production source hashes.

Canonical hashes:

```text
STAGE_2_TECHNICAL_SMOKE_RESULT.json = f2cf9b0bc0b091611e88871d8399a340e579c84f4b4143feaf85e266c0bc491e
STAGE_2_TECHNICAL_SMOKE_VERIFICATION.json = 1d5d9cba6869939d35156fa03069e9cf4490de8f291421d797d1545be82a5d6b
workflow artifact ID = 9632722463
workflow artifact ZIP SHA-256 = e42e3ee6228363282bfb4abd3c55ea55fb51cc808ab34cb18ff1ed92c5da834a
```

Passing this technical gate does not itself authorize Stage 2 scientific generation. An explicit source-bound Stage 2 authorization commit remains required.
