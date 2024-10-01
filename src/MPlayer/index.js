class MPlayer extends EventTarget {
  constructor(query) {
    super();
    this.tag = document.querySelector(query)
    this.tag.addEventListener("timeupdate", _ => {
      this.emit("status", { status: this.status })
      this.emit("currentTime", { total: this.duration, posicion: this.posicion })
    });
    this.tag.addEventListener("ended", () => {
      this.emit("status", { status: "finished" })
      this.emit("finished")
    })
  }
  get src() {
    return this.tag.src;
  }
  set src(data) {
    this.emit("updateSrc", { data })
    this.tag.src = data;
  }
  get duration() {
    return this.tag.duration;
  }
  get posicion() {
    return this.tag.currentTime;
  }
  set posicion(data) {
    if (typeof data !== "number") throw "require number";
    this.tag.currentTime = data;
  }
  get status() {
    if (this.tag.paused) return "paused";
    else if (this.tag.ended) return "finished";
    else return "playing"
  }
  get autoplay() {
    return this.tag.autoplay;
  }
  set autoplay(data) {
    this.tag.autoplay = data;
  }
  switchPlayAndPause() {
    if (this.status != "playing") this.play();
    else this.pause();
  }
  loop() {
    this.tag.loop = true;
  }
  play() {
    this.emit("play")
    return this.tag.play();
  }
  pause() {
    this.emit("pause")
    return this.tag.pause();
  }
  on(type, fns) {
    this.addEventListener(type, fns);
    return () => this.removeEventListener(type, fns);
  }
  emit(type, data) {
    if (!data) this.dispatchEvent(new Event(type))
    else this.dispatchEvent(new CustomEvent(type, { detail: data }))
  }
}