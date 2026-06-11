class Timer {
  constructor(duration, onTick, onTimeout) {
    this.duration = duration;
    this.remaining = duration;
    this.onTick = onTick;
    this.onTimeout = onTimeout;
    this.interval = null;
  }
  start() {
    this.stop();
    this.remaining = this.duration;
    this.onTick(this.remaining);
    this.interval = setInterval(() => {
      this.remaining--;
      this.onTick(this.remaining);
      if (this.remaining <= 0) {
        this.stop();
        this.onTimeout();
      }
    }, 1000);
  }
  stop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }
  reset() {
    this.stop();
    this.remaining = this.duration;
    this.onTick(this.remaining);
  }
} 