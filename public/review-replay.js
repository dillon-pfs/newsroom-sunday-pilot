(function () {
  const root = document.getElementById("replay-root");
  const tapeNode = document.getElementById("replay-tape");
  if (!root || !tapeNode) return;

  const tape = JSON.parse(tapeNode.textContent || "{}");
  const beats = Array.isArray(tape.beats) ? tape.beats : [];
  const reelMs = Number(tape.reelMs) || 30000;
  const tickMs = Number(tape.tickMs) || 200;
  const firstBeatMs = Number(tape.firstBeatMs) || 400;

  let cursor = Number(root.getAttribute("data-cursor") || 0);
  let playing = false;
  let timer = 0;

  const playBtn = document.getElementById("replay-play");
  const rewindBtn = document.getElementById("replay-rewind");
  const scrub = document.getElementById("replay-scrub");
  const clockEl = document.getElementById("replay-clock");
  const stateEl = document.getElementById("replay-state");
  const delayedEl = document.getElementById("replay-delayed");
  const delayedCopy = document.getElementById("replay-delayed-copy");
  const timeline = document.getElementById("replay-timeline");
  const awayEl = document.querySelector("[data-replay-away]");
  const homeEl = document.querySelector("[data-replay-home]");
  const gameClockEl = document.querySelector("[data-replay-clock]");
  const statusEl = document.querySelector("[data-replay-status]");

  function visibleBeats() {
    return beats.filter(function (beat) {
      return beat.atMs <= cursor;
    });
  }

  function lastWith(key) {
    const list = visibleBeats();
    for (let i = list.length - 1; i >= 0; i -= 1) {
      if (list[i][key]) return list[i];
    }
    return null;
  }

  function hitchOnTape() {
    const list = visibleBeats();
    let lastDelay = null;
    for (let i = list.length - 1; i >= 0; i -= 1) {
      if (list[i].delayed) {
        lastDelay = list[i];
        break;
      }
    }
    if (!lastDelay) return false;
    return !list.some(function (beat) {
      return beat.atMs > lastDelay.atMs && beat.id === "sim-recovered";
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function kindLabel(kind) {
    if (kind === "fact") return "Fact";
    if (kind === "commentary") return "Commentary";
    if (kind === "correction") return "Correction";
    if (kind === "duplicate") return "Duplicate";
    if (kind === "status") return "Desk";
    return kind;
  }

  function statusLabel(status) {
    if (status === "awaiting_official") return "Awaiting official";
    if (status === "in_progress") return "In progress";
    if (status === "final") return "Final";
    return "Scheduled";
  }

  function render() {
    const list = visibleBeats().slice().reverse();
    const scoreBeat = lastWith("scoreAfter");
    const clockBeat = lastWith("clockLabel");
    const statusBeat = lastWith("gameStatus");
    const score = scoreBeat && scoreBeat.scoreAfter ? scoreBeat.scoreAfter : { away: 0, home: 0 };
    const hitch = hitchOnTape();
    const pausedMid = !playing && cursor > 0 && cursor < reelMs;
    const showDelayed = hitch || pausedMid;

    if (awayEl) awayEl.textContent = String(score.away);
    if (homeEl) homeEl.textContent = String(score.home);
    if (gameClockEl) gameClockEl.textContent = clockBeat ? clockBeat.clockLabel : "Pregame";
    if (statusEl) statusEl.textContent = statusLabel(statusBeat ? statusBeat.gameStatus : "scheduled");
    if (clockEl) clockEl.textContent = (cursor / 1000).toFixed(1) + "s / " + reelMs / 1000 + "s";
    if (stateEl) {
      stateEl.textContent = playing ? "Playing" : cursor >= reelMs ? "Ended" : "Paused";
    }
    if (playBtn) {
      playBtn.textContent = playing ? "Pause" : cursor >= reelMs ? "Play again" : "Play";
    }
    if (scrub && Number(scrub.value) !== cursor) {
      scrub.value = String(cursor);
    }
    if (delayedEl) {
      delayedEl.hidden = !showDelayed;
    }
    if (delayedCopy) {
      delayedCopy.textContent =
        hitch && playing
          ? "The tape itself called a hitch. Wait for the recovered beat."
          : "Replay is paused. Resume to keep the simulated wire moving.";
    }

    if (!timeline) return;
    if (list.length === 0) {
      timeline.innerHTML =
        '<div class="border border-dashed border-ink/20 px-4 py-12 text-center">' +
        '<p class="font-heading text-lg font-semibold">Tape is cued</p>' +
        '<p class="mx-auto mt-2 max-w-md text-sm text-ink/65">Press Play to walk the SIMULATED Sunday reel. Facts, commentary, a duplicate, a correction, and a delayed hitch are on the tape.</p>' +
        "</div>";
      return;
    }

    timeline.innerHTML = list
      .map(function (entry) {
        const extra =
          entry.kind === "correction"
            ? " border-masthead/40"
            : entry.kind === "duplicate"
              ? " opacity-70"
              : entry.delayed
                ? " border-dashed"
                : "";
        const character = entry.kind === "commentary"
          ? '<span class="inline-flex h-5 items-center rounded-full bg-secondary px-2 font-mono text-[10px] uppercase">Character</span>'
          : "";
        const delayed = entry.delayed
          ? '<span class="inline-flex h-5 items-center rounded-full border border-border px-2 font-mono text-[10px] uppercase">Delayed</span>'
          : "";
        const corrects = entry.correctsId
          ? '<p class="mt-2 font-mono text-[11px] text-masthead uppercase">Corrects ' +
            escapeHtml(entry.correctsId) +
            "</p>"
          : "";
        const dup = entry.duplicateOfId
          ? '<p class="mt-2 font-mono text-[11px] text-ink/50 uppercase">Duplicate of ' +
            escapeHtml(entry.duplicateOfId) +
            "</p>"
          : "";
        return (
          '<article class="border border-ink/12 bg-card px-4 py-3' +
          extra +
          '">' +
          '<div class="flex flex-wrap items-center gap-2">' +
          '<span class="inline-flex h-5 items-center rounded-full bg-sim px-2 font-mono text-[10px] tracking-wide text-sim-foreground uppercase">Simulated</span>' +
          '<span class="inline-flex h-5 items-center rounded-full border border-border px-2 font-mono text-[10px] uppercase">' +
          escapeHtml(kindLabel(entry.kind)) +
          "</span>" +
          character +
          delayed +
          '<span class="font-mono text-[11px] text-ink/45">' +
          escapeHtml(entry.postedAtLabel || "") +
          "</span></div>" +
          '<h3 class="mt-2 font-heading text-lg font-semibold">' +
          escapeHtml(entry.headline) +
          "</h3>" +
          '<p class="mt-1 text-sm leading-6 text-ink/75">' +
          escapeHtml(entry.body) +
          "</p>" +
          corrects +
          dup +
          "</article>"
        );
      })
      .join("");
  }

  function playOrPause() {
    if (cursor >= reelMs) {
      cursor = firstBeatMs;
      playing = true;
    } else if (!playing && cursor === 0) {
      cursor = firstBeatMs;
      playing = true;
    } else {
      playing = !playing;
    }
    syncTimer();
    render();
  }

  function rewind() {
    playing = false;
    cursor = 0;
    syncTimer();
    render();
  }

  function syncTimer() {
    window.clearInterval(timer);
    if (!playing) return;
    timer = window.setInterval(function () {
      cursor = Math.min(cursor + tickMs, reelMs);
      if (cursor >= reelMs) {
        playing = false;
        window.clearInterval(timer);
      }
      render();
    }, tickMs);
  }

  if (playBtn) playBtn.addEventListener("click", playOrPause);
  if (rewindBtn) rewindBtn.addEventListener("click", rewind);
  if (scrub) {
    scrub.addEventListener("input", function () {
      playing = false;
      cursor = Number(scrub.value) || 0;
      syncTimer();
      render();
    });
  }

  render();
})();
