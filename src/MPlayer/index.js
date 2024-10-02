class timeFormat {
  constructor(TimeMillis) {
    this._current_time = TimeMillis;
  }
  get current() {
    return this._current_time
  }
  get Hours() {
    return new String(Math.trunc(this.current / 1000 / 60 / 60) % 60).padStart(2, "0")
  }
  get Minutes() {
    return new String(Math.trunc(this.current / 1000 / 60) % 60).padStart(2, "0")
  }
  get Seconds() {
    return new String(Math.trunc(this.current / 1000) % 60).padStart(2, "0")
  }
  get Miliseconds() {
    return new String(Math.trunc(this.current)).padEnd(4, "0")
  }
  useRange(max) {
    return Number(parseFloat(((this.current * 1) / (max * 1000)).toString()).toFixed(3))
  }
}

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

class Player_mediaData extends MPlayer {
  constructor(tag) {
    super(tag);
    this.getID3 = () => new Promise((res, req) => {
      jsmediatags.read(this.src, {
        onSuccess: (tag) => {
          this.ID3 = tag;
          res(this);
        },
        onError: req
      })
    })
  }
  getDataFile() {
    if (!this.ID3) throw "not call getID3";
    const image = this.ID3.tags.picture;
    if (image) {
      var base64String = "";
      for (var i = 0; i < image.data.length; i++) {
        base64String += String.fromCharCode(image.data[i]);
      }
      var base64 = "data:" + image.format + ";base64," +
        window.btoa(base64String);
      this.ID3.tags.picture = base64;
    } else {
      this.ID3.tags.picture = "http://images.coveralia.com/audio/a/Amy_Winehouse-Back_To_Black_(Limited_Edition)-CD.jpg";
    }
    return this.ID3.tags
  }
}