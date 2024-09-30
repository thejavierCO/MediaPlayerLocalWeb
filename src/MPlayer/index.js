class MPlayer {
  constructor(query) {
    this.tag = document.querySelector(query)
  }
  get src() {
    return this.tag.src;
  }
  set src(data) {
    this.tag.src = data;
  }
  play() {
    return this.tag.play();
  }
  pause() {
    return this.tag.pause();
  }
  autoplay() {
    this.tag.autoplay = true;
  }
}