let $ = a => document.querySelector(a);
let $$ = a => document.querySelectorAll(a);
class timeFormat {
  constructor(TimeMillis) {
    this._current_time = TimeMillis;
  }
  get current() {
    return this._current_time
  }
  get Hours() {
    return new String(Math.trunc(this.current / 1000 / 60 / 60) % 60 || 0).padStart(2, "0")
  }
  get Minutes() {
    return new String(Math.trunc(this.current / 1000 / 60) % 60 || 0).padStart(2, "0")
  }
  get Seconds() {
    return new String(Math.trunc(this.current / 1000) % 60 || 0).padStart(2, "0")
  }
  get Miliseconds() {
    return new String(Math.trunc(this.current) || 0).padEnd(4, "0")
  }
  useRange(max) {
    return Number(parseFloat(((this.current * 1) / (max * 1000)).toString()).toFixed(3))
  }
}

class Barra extends EventTarget {
  constructor(bg, progress) {
    super();
    this.tagBg(bg)
    this.tagProgress(progress)
  }
  tagBg(query) {
    this.bg = $(query)
    this.bg.addEventListener("click", ({ offsetX }) => {
      this.progress.style.width = offsetX;
      this.emit("updatePosicion", { max: this.max, posicion: this.posicion })
    })
    return this
  }
  tagProgress(query) {
    this.progress = $(query)
    return this
  }
  get max() {
    return this.bg.clientWidth;
  }
  get posicion() {
    return this.progress.clientWidth;
  }
  set posicion(data) {
    this.progress.style.width = data;
  }
  setPosicionForPercentage(posicion) {
    this.posicion = posicion * this.max / 100;
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

class GetColorsCover {
  constructor(tag) {
    const colorThief = new ColorThief();
    this.rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('');
    this.Palette = new Promise((res, req) => {
      if (tag.src == "") req("not defined source")
      tag.addEventListener("load", () => {
        let testing = colorThief.getPalette(tag, 8, 5);
        res(testing.map(e => this.rgbToHex(e[0], e[1], e[2])))
      })
    })
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
  useFormatTime() {
    let Total = new timeFormat(this.duration * 1000);
    let Posicion = new timeFormat(this.posicion * 1000);
    return {
      data: { Total, Posicion },
      Total: Total.Hours + ":" + Total.Minutes + ":" + Total.Seconds,
      Posicion: Posicion.Hours + ":" + Posicion.Minutes + ":" + Posicion.Seconds
    }
  }
  switchPlayAndPause() {
    if (this.status != "playing") this.play();
    else this.pause();
  }
  autoplay() {
    this.tag.autoplay = true;
    return this;
  }
  muted() {
    this.tag.muted = true;
    return this;
  }
  loop() {
    this.tag.loop = true;
    return this;
  }
  play() {
    this.emit("play")
    this.tag.play();
    return this;
  }
  pause() {
    this.emit("pause")
    this.tag.pause();
    return this;
  }
  on(type, fns) {
    this.addEventListener(type, fns);
    return () => this.removeEventListener(type, fns);
  }
  emit(type, data) {
    if (!data) this.dispatchEvent(new Event(type))
    else this.dispatchEvent(new CustomEvent(type, { detail: data }))
    return this;
  }
}

class Player_mediaData extends MPlayer {
  constructor(tag) {
    super(tag);
    this.getID3 = (url) => new Promise((res, req) => {
      if (!this.src) throw "not defined source"
      jsmediatags.read(url || this.src, {
        onSuccess: (tag) => {
          this.ID3 = tag;
          if (this.autoInsertInfo) this.autoInsert()
          res(this);
        },
        onError: req
      })
    })
    this.insertLocalFile = (File) => new Promise((res, req) => {
      let reader = new FileReader();
      reader.onload = async () => {
        let { type } = File;
        let blob = new Blob([reader.result], { type })
        console.log(blob)
        let url = URL.createObjectURL(blob)
        this.src = url;
        if (this.autoGetInfo) await this.getID3(blob)
        res(() => URL.revokeObjectURL(url))
      }
      reader.onerror = req;
      reader.readAsArrayBuffer(File);
    })
    this.on("currentTime", () => {
      if (this.autoInsertInfo) {
        this.updateTime();
        let btn = $("button[btnCtl]")
        let text = this.status == "playing" ? "Pause" : "Play";
        btn.onclick = () => this.switchPlayAndPause();
        if (btn.innerText != text) btn.innerText = this.status == "playing" ? "Pause" : "Play";
      }
    });
  }
  async getColorsCover() {
    let data = $("img[targetGetColor]")
    let colors = new GetColorsCover(data);
    return await colors.Palette;
  }
  autoGetID3() {
    this.autoGetInfo = true;
    if (this.src) this.getID3()
    return this;
  }
  autoInsertData() {
    this.autoInsertInfo = true;
    return this;
  }
  autoInsert() {
    const { title, album, artist, picture } = this.getDataFile();
    $$("[title]").forEach((tag) => tag.innerText = title);
    $$("[album]").forEach((tag) => tag.innerText = album);
    $$("[artist]").forEach((tag) => tag.innerText = artist);
    $$("img[picture]").forEach((tag) => tag.src = picture);
    this.updateTime();
  }
  updateTime() {
    let { Total, Posicion } = this.useFormatTime()
    $$("[Total_time]").forEach((tag) => {
      let text = tag.innerText;
      if (text != Total) tag.innerText = Total;
    });
    $$("[Posicion_time]").forEach((tag) => {
      let text = tag.innerText;
      if (text != Posicion) tag.innerText = Posicion
    });
  }
  getDataFile() {
    if (!this.ID3) throw "not call getID3";
    const image = this.ID3.tags.picture;
    if (image) {
      let { format: type, data } = image;
      console.log(image)
      let blob = new Blob([data], { type })
      console.log(blob)
      let url = URL.createObjectURL(blob)
      this.ID3.tags.picture = url;//base64;
    } else {
      this.ID3.tags.picture = "http://images.coveralia.com/audio/a/Amy_Winehouse-Back_To_Black_(Limited_Edition)-CD.jpg";
    }
    return this.ID3.tags
  }
}