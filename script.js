(() => {
  "use strict";

  const MAX_ATTEMPTS = 8;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const elements = {
    alarmClock: document.querySelector("#alarm-clock"),
    attemptCount: document.querySelector("#attempt-count"),
    attemptPips: [...document.querySelectorAll("#attempt-pips span")],
    books: document.querySelector("#books"),
    clockPositioner: document.querySelector("#clock-positioner"),
    digitalTime: document.querySelector("#digital-time"),
    game: document.querySelector("#game"),
    instructions: document.querySelector("#instructions"),
    resetButton: document.querySelector("#reset-button"),
    room: document.querySelector("#room"),
    soundLabel: document.querySelector("#sound-label"),
    soundToggle: document.querySelector("#sound-toggle"),
    startButton: document.querySelector("#start-button"),
    startOverlay: document.querySelector("#start-overlay"),
    statusMessage: document.querySelector("#status-message"),
    stopButton: document.querySelector("#stop-button"),
    stopLabel: document.querySelector("#stop-label"),
    timePeriod: document.querySelector("#time-period"),
    volume: document.querySelector("#volume"),
  };

  const state = {
    attempts: 0,
    clockX: 0,
    clockY: 0,
    isLocked: false,
    isMuted: false,
    isSleeping: false,
    lastAntic: -1,
    started: false,
    timers: new Set(),
  };

  class AlarmAudio {
    constructor(volume) {
      this.context = null;
      this.masterGain = null;
      this.interval = null;
      this.isActive = false;
      this.isMuted = false;
      this.volume = volume;
    }

    async ensureContext() {
      if (!this.context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;

        if (!AudioContext) {
          throw new Error("Web Audio is not supported by this browser.");
        }

        this.context = new AudioContext();
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        this.updateGain(true);
      }

      if (this.context.state === "suspended") {
        await this.context.resume();
      }
    }

    async start() {
      this.isActive = true;

      try {
        await this.ensureContext();
      } catch (error) {
        this.isActive = false;
        announce("The visual alarm is running, but this browser could not start sound.");
        return;
      }

      if (!this.interval) {
        this.playBurst();
        this.interval = window.setInterval(() => this.playBurst(), 1080);
      }
    }

    stop() {
      this.isActive = false;
      window.clearInterval(this.interval);
      this.interval = null;
    }

    playBurst() {
      if (!this.context || !this.masterGain || !this.isActive || this.isMuted) {
        return;
      }

      const startAt = this.context.currentTime;
      const notes = [
        { offset: 0, frequency: 780 },
        { offset: 0.16, frequency: 620 },
        { offset: 0.34, frequency: 820 },
      ];

      notes.forEach(({ offset, frequency }) => {
        const oscillator = this.context.createOscillator();
        const envelope = this.context.createGain();
        const noteStart = startAt + offset;
        const noteEnd = noteStart + 0.115;

        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(frequency, noteStart);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.93, noteEnd);

        envelope.gain.setValueAtTime(0.0001, noteStart);
        envelope.gain.exponentialRampToValueAtTime(0.5, noteStart + 0.018);
        envelope.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

        oscillator.connect(envelope);
        envelope.connect(this.masterGain);
        oscillator.start(noteStart);
        oscillator.stop(noteEnd + 0.02);
      });
    }

    setMuted(isMuted) {
      this.isMuted = isMuted;
      this.updateGain();
    }

    setVolume(volume) {
      this.volume = volume;
      this.updateGain();
    }

    updateGain(immediate = false) {
      if (!this.context || !this.masterGain) {
        return;
      }

      const target = this.isMuted ? 0 : this.volume * 0.22;

      if (immediate) {
        this.masterGain.gain.setValueAtTime(target, this.context.currentTime);
      } else {
        this.masterGain.gain.setTargetAtTime(target, this.context.currentTime, 0.025);
      }
    }
  }

  const alarmAudio = new AlarmAudio(Number(elements.volume.value) / 100);

  const antics = [
    {
      message: "Nope. It jumped out of reach.",
      run() {
        const { x, y } = randomDeskPosition();
        elements.alarmClock.classList.add("is-jumping");
        later(() => setClockPosition(x, y), prefersReducedMotion.matches ? 0 : 120);
        later(() => elements.alarmClock.classList.remove("is-jumping"), 900);
        return 760;
      },
    },
    {
      message: "It rolled away with alarming confidence.",
      run() {
        const roomWidth = elements.room.clientWidth;
        const direction = state.clockX > 0 ? -1 : 1;
        const x = clamp(state.clockX + direction * roomWidth * 0.27, ...clockXBounds());
        elements.alarmClock.classList.add("is-rolling");
        later(() => setClockPosition(x, randomBetween(-20, 12)), prefersReducedMotion.matches ? 0 : 100);
        later(() => elements.alarmClock.classList.remove("is-rolling"), 1200);
        return 980;
      },
    },
    {
      message: "Coward. It is hiding behind the books.",
      run() {
        const roomRect = elements.room.getBoundingClientRect();
        const booksRect = elements.books.getBoundingClientRect();
        const baseCenterX = roomRect.left + roomRect.width * clockBaseRatio();
        const targetCenterX = booksRect.left + booksRect.width * 0.58;

        elements.clockPositioner.classList.add("behind-book");
        setClockPosition(clamp(targetCenterX - baseCenterX, ...clockXBounds()), 20);
        return 850;
      },
    },
    {
      message: "Even the Stop button is trying to escape.",
      run() {
        const direction = Math.random() > 0.5 ? 1 : -1;
        const distance = Math.min(elements.room.clientWidth * 0.18, 155);
        elements.stopButton.style.setProperty("--button-x", `${direction * distance}px`);
        elements.stopButton.style.setProperty("--button-y", `${randomBetween(-115, -55)}px`);
        return 620;
      },
    },
    {
      message: "Tiny legs! Of course it has tiny legs.",
      run() {
        const [minX, maxX] = clockXBounds();
        const x = state.clockX >= 0 ? minX * 0.84 : maxX * 0.84;
        elements.alarmClock.classList.add("has-legs");
        setClockPosition(x, -10);
        later(() => elements.alarmClock.classList.remove("has-legs"), 1700);
        return 1050;
      },
    },
    {
      message: "Stop? The button clearly says Snooze.",
      run() {
        elements.stopLabel.textContent = "Snooze";
        elements.stopButton.setAttribute("aria-label", "Snooze — the clock changed the button");
        return 600;
      },
    },
    {
      message: "Silence... wait for it.",
      run() {
        elements.alarmClock.classList.add("pretending");
        elements.alarmClock.classList.remove("is-ringing");
        alarmAudio.stop();

        later(() => {
          if (!state.isSleeping && state.started) {
            elements.alarmClock.classList.remove("pretending");
            elements.alarmClock.classList.add("is-ringing");
            alarmAudio.start();
            announce("Psych! It started ringing again.");
          }
        }, prefersReducedMotion.matches ? 500 : 1100);

        return prefersReducedMotion.matches ? 650 : 1250;
      },
    },
    {
      message: "It fell off the desk... and it is climbing back.",
      run() {
        elements.alarmClock.classList.add("is-falling");
        later(() => elements.alarmClock.classList.remove("is-falling"), 2300);
        return prefersReducedMotion.matches ? 550 : 1950;
      },
    },
    {
      message: "A blanket? This is getting unprofessional.",
      run() {
        elements.alarmClock.classList.add("has-blanket");
        return 720;
      },
    },
  ];

  function startGame() {
    if (state.started) {
      return;
    }

    state.started = true;
    state.isSleeping = false;
    elements.startOverlay.classList.add("is-hidden");
    elements.startOverlay.setAttribute("aria-hidden", "true");
    elements.startOverlay.inert = true;
    elements.alarmClock.classList.add("is-ringing");
    elements.alarmClock.setAttribute("aria-label", "A red alarm clock ringing loudly");
    announce("The alarm has noticed you. Try to stop it.");
    alarmAudio.start();
    elements.stopButton.focus({ preventScroll: true });
  }

  function attemptStop() {
    if (!state.started || state.isSleeping || state.isLocked) {
      return;
    }

    state.attempts += 1;
    updateAttemptDisplay();

    if (state.attempts >= MAX_ATTEMPTS) {
      finishGame();
      return;
    }

    clearTimers();
    clearAnticVisuals();
    const anticIndex = chooseAntic();
    const antic = antics[anticIndex];
    state.lastAntic = anticIndex;
    state.isLocked = true;
    elements.stopButton.setAttribute("aria-disabled", "true");
    announce(antic.message);
    const lockDuration = antic.run();

    later(() => {
      if (!state.isSleeping) {
        state.isLocked = false;
        elements.stopButton.removeAttribute("aria-disabled");
      }
    }, lockDuration);
  }

  function finishGame() {
    clearTimers();
    clearAnticVisuals();
    state.isSleeping = true;
    state.isLocked = false;
    alarmAudio.stop();

    elements.alarmClock.classList.remove("is-ringing", "pretending");
    elements.alarmClock.classList.add("is-sleeping");
    elements.alarmClock.setAttribute("aria-label", "The alarm clock is asleep");
    elements.stopButton.disabled = true;
    elements.stopButton.removeAttribute("aria-disabled");
    elements.stopLabel.textContent = "zzz";
    elements.instructions.textContent = "The clock won. Use Reset room for a rematch.";
    announce("Too late. It went back to sleep.");
  }

  function resetGame() {
    const shouldRestart = state.started;

    clearTimers();
    clearAnticVisuals();
    alarmAudio.stop();
    state.attempts = 0;
    state.clockX = 0;
    state.clockY = 0;
    state.isLocked = false;
    state.isSleeping = false;
    state.lastAntic = -1;

    elements.alarmClock.className = "alarm-clock";
    elements.clockPositioner.className = "clock-positioner";
    elements.clockPositioner.style.setProperty("--clock-x", "0px");
    elements.clockPositioner.style.setProperty("--clock-y", "0px");
    elements.stopButton.disabled = false;
    elements.stopButton.removeAttribute("aria-disabled");
    resetStopButton();
    elements.instructions.innerHTML = "Press <kbd>Stop</kbd> if you can catch it. Keyboard and touch welcome.";
    updateAttemptDisplay();

    if (shouldRestart) {
      elements.alarmClock.classList.add("is-ringing");
      elements.alarmClock.setAttribute("aria-label", "A red alarm clock ringing loudly");
      announce("Reset complete. It is angry again.");
      alarmAudio.start();
      elements.stopButton.focus({ preventScroll: true });
    } else {
      elements.alarmClock.setAttribute("aria-label", "A red alarm clock waiting to ring");
      announce("It knows you're awake.");
    }
  }

  function clearAnticVisuals() {
    elements.alarmClock.classList.remove(
      "has-blanket",
      "has-legs",
      "is-falling",
      "is-jumping",
      "is-rolling",
      "pretending",
    );
    elements.clockPositioner.classList.remove("behind-book");
    resetStopButton();
  }

  function resetStopButton() {
    elements.stopLabel.textContent = "Stop";
    elements.stopButton.removeAttribute("aria-label");
    elements.stopButton.style.setProperty("--button-x", "0px");
    elements.stopButton.style.setProperty("--button-y", "0px");
  }

  function chooseAntic() {
    const choices = antics.map((_, index) => index).filter((index) => index !== state.lastAntic);
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function updateAttemptDisplay() {
    elements.attemptCount.textContent = String(state.attempts);
    elements.attemptPips.forEach((pip, index) => {
      pip.classList.toggle("is-used", index < state.attempts);
    });
  }

  function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const displayHours = hours % 12 || 12;
    const minutes = String(now.getMinutes()).padStart(2, "0");

    elements.digitalTime.textContent = `${String(displayHours).padStart(2, "0")}:${minutes}`;
    elements.digitalTime.dateTime = `${String(hours).padStart(2, "0")}:${minutes}`;
    elements.timePeriod.textContent = hours >= 12 ? "PM" : "AM";
  }

  function announce(message) {
    elements.statusMessage.textContent = message;
  }

  function setClockPosition(x, y) {
    const [minX, maxX] = clockXBounds();
    state.clockX = clamp(x, minX, maxX);
    state.clockY = clamp(y, -110, 30);
    elements.clockPositioner.style.setProperty("--clock-x", `${state.clockX}px`);
    elements.clockPositioner.style.setProperty("--clock-y", `${state.clockY}px`);
  }

  function randomDeskPosition() {
    const [minX, maxX] = clockXBounds();
    let x = randomBetween(minX, maxX);

    if (Math.abs(x - state.clockX) < 90) {
      x = state.clockX >= 0 ? minX * 0.82 : maxX * 0.82;
    }

    return { x, y: randomBetween(-75, 14) };
  }

  function clockXBounds() {
    const roomWidth = elements.room.clientWidth;
    const clockWidth = elements.clockPositioner.offsetWidth;
    const baseCenter = roomWidth * clockBaseRatio();
    const padding = Math.max(8, roomWidth * 0.015);
    const minX = -baseCenter + clockWidth / 2 + padding;
    const maxX = roomWidth - baseCenter - clockWidth / 2 - padding;
    return [minX, maxX];
  }

  function clockBaseRatio() {
    return window.innerWidth <= 420 ? 0.54 : window.innerWidth <= 700 ? 0.56 : window.innerWidth <= 980 ? 0.57 : 0.56;
  }

  function randomBetween(min, max) {
    return Math.round(min + Math.random() * (max - min));
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function later(callback, delay) {
    const timer = window.setTimeout(() => {
      state.timers.delete(timer);
      callback();
    }, delay);
    state.timers.add(timer);
    return timer;
  }

  function clearTimers() {
    state.timers.forEach((timer) => window.clearTimeout(timer));
    state.timers.clear();
  }

  function toggleSound() {
    state.isMuted = !state.isMuted;
    alarmAudio.setMuted(state.isMuted);
    elements.soundToggle.setAttribute("aria-pressed", String(state.isMuted));
    elements.soundLabel.textContent = state.isMuted ? "Sound off" : "Sound on";

    if (!state.isMuted && state.started && !state.isSleeping) {
      alarmAudio.start();
    }
  }

  function handleResize() {
    if (!state.started) {
      return;
    }

    setClockPosition(state.clockX, state.clockY);
  }

  elements.startButton.addEventListener("click", startGame);
  elements.stopButton.addEventListener("click", attemptStop);
  elements.resetButton.addEventListener("click", resetGame);
  elements.soundToggle.addEventListener("click", toggleSound);
  elements.volume.addEventListener("input", (event) => {
    alarmAudio.setVolume(Number(event.currentTarget.value) / 100);
  });
  window.addEventListener("resize", handleResize);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      alarmAudio.stop();
    } else if (state.started && !state.isSleeping) {
      alarmAudio.start();
    }
  });

  updateTime();
  updateAttemptDisplay();
  window.setInterval(updateTime, 1000);
})();
