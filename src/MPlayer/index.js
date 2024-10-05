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
    return Number(parseFloat(((this.current * 1) / (max * 1000) || 0).toString()).toFixed(3))
  }
  structFormat(type) {
    let struct = [
      (a) => a.Hours + ":" + a.Minutes + ":" + a.Seconds,
      (a) => a.Minutes + ":" + a.Seconds,
      (a) => a.Seconds
    ];
    return struct[type](this);
  }
}
class tagHtml {
  constructor(query) {
    this.tag = query;
  }
  get tag() {
    return $(this._tag);
  }
  set tag(query) {
    if (typeof query != "string") this._tag = query;
    this._tag = query;
  }
  get style() {
    return this.tag.style;
  }
  get on() {
    return (type, fns) => this.tag.addEventListener(type, fns);
  }
  get emit() {
    return (type, data) => {
      if (!data) this.tag.dispatchEvent(new Event(type));
      else this.tag.dispatchEvent(new CustomEvent(type, { detail: data }))
    }
  }
  getTagsAll(list) {
    if (!list) throw "require array";
    return list.map(query => {
      let result = [];
      $$(query).forEach(e => {
        result.push(new tagHtml(e))
      })
      return result;
    });
  }
}

class Barra {
  constructor(queryBg, queryProgress) {
    this.tagBg = new tagHtml(queryBg);
    this.tagProgress = new tagHtml(queryProgress);
    this.tagBg.on("click", ({ offsetX }) => {
      this.tagProgress.style.width = offsetX;
    });
  }
  get max() {
    return this.tagBg.tag.clientWidth;
  }
  get posicion() {
    return this.tagProgress.tag.clientWidth;
  }
  set posicion(data) {
    this.tagProgress.style.width = data;
  }
  setPosicionForPercentage(posicion) {
    this.posicion = posicion * this.max / 100;
  }
  updatePosicion(fns) {
    this.tagBg.on("click", () => fns(this.posicion, this.max));
  }
}

class GetColorsCover {
  constructor(tag) {
    this.colorThief = new ColorThief();
    this.rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('');
    this.Palette = new Promise((res, req) => {
      if (tag.src == "") throw "not exist source";
      tag.addEventListener("load", () =>
        res((this.colorThief.getPalette(tag, 3, 10)).map(e => this.rgbToHex(e[0], e[1], e[2]))))
    })
  }
}

class MPlayer extends tagHtml {
  constructor(query) {
    super(query);
    this.on("timeupdate", _ => {
      this.emit("status", { status: this.status })
      this.emit("currentTime", { total: this.duration, posicion: this.posicion })
    });
    this.on("ended", () => {
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
      Total,
      Posicion
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
    const [tagTitle, tagAlbum, tagArtist, tagPicture] = this.getTagsAll(["[title]", "[album]", "[artist]", "img[picture]"]);
    const { title, album, artist, picture } = this.getDataFile();
    tagTitle.forEach((tag) => tag.innerText = title);
    tagAlbum.forEach((tag) => tag.innerText = album);
    tagArtist.forEach((tag) => tag.innerText = artist);
    tagPicture.forEach((tag) => {
      tag.src = picture;
      tag.addEventListener("load", _ => URL.revokeObjectURL(picture))
    });
    this.updateTime();
  }
  updateTime() {
    let { Total, Posicion } = this.useFormatTime()
    $$("[Total_time]").forEach((tag) => {
      let text = tag.innerText;
      if (text != Total) tag.innerText = Total.structFormat(0);
    });
    $$("[Posicion_time]").forEach((tag) => {
      let text = tag.innerText;
      if (text != Posicion) tag.innerText = Posicion.structFormat(0)
    });
  }
  getDataFile() {
    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }
    if (!this.ID3) throw "not call getID3";
    const image = this.ID3.tags.picture;
    if (image) {
      let { format: type, data } = image;
      // convert base64
      let base64String = "";
      for (var i = 0; i < data.length; i++) {
        base64String += String.fromCharCode(data[i]);
      }
      //-----------------------------------------
      let blob = b64toBlob(btoa(base64String), type)
      let url = URL.createObjectURL(blob)
      //------------------------------------------
      this.ID3.tags.picture = url;
    } else {
      this.ID3.tags.picture = "http://images.coveralia.com/audio/a/Amy_Winehouse-Back_To_Black_(Limited_Edition)-CD.jpg";
    }
    return this.ID3.tags
  }
}