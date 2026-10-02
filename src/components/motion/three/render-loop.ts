interface LoopOptions {
  /** Return true while something is still moving; the loop stops itself when it returns false. */
  frame: (_dt: number, _time: number) => boolean;
  /** Frames closer together than this are skipped (60fps cap on 120Hz screens). 0 means no cap. */
  minFrameMs?: number;
}

export function createLoop({ frame, minFrameMs = 0 }: LoopOptions) {
  let id = 0;
  let last = 0;
  let running = false;

  const tick = (now: number) => {
    id = requestAnimationFrame(tick);
    if (minFrameMs && now - last < minFrameMs - 1) return;

    const dt = Math.min((now - (last || now)) / 1000, 1 / 20);

    last = now;
    if (!frame(dt, now / 1000)) stop();
  };
  const start = () => {
    if (running || document.hidden) return;
    running = true;
    last = 0;
    id = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(id);
  };
  const onVisibility = () => (document.hidden ? stop() : start());

  document.addEventListener('visibilitychange', onVisibility);

  return {
    start,
    stop,
    dispose() {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
