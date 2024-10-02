let $ = a => document.querySelector(a);
let $$ = a => document.querySelectorAll(a);

document.addEventListener("DOMContentLoaded", async function () {
	let Player = new Player_mediaData("audio#MP");
	await Player.getID3();
	let { title, album, artist, picture } = Player.getDataFile();
	$("span[title]").innerText = title;
	$("span[album]").innerText = album;
	$("span[artist]").innerText = artist;
	$("img[picture]").src = picture;
	$("div.barBg").onclick = ({ offsetX, target: { offsetWidth } }) => {
		const Porcentaje = offsetX * 100 / offsetWidth;
		const PosicionOut = Porcentaje * Player.duration / 100;
		Player.posicion = PosicionOut
	}
	Player.on("status", () => {
		$("button[btnCtl]").innerText = Player.status;
		$("div.barProgress").style.width = (Player.posicion * 100 / Player.duration) + "%";
		let Total = new timeFormat(Player.duration * 1000);
		$("span[total]").innerText = Total.Hours + ":" + Total.Minutes + ":" + Total.Seconds;
		let Posicion = new timeFormat(Player.posicion * 1000);
		$("span[posicion]").innerText = Posicion.Hours + ":" + Posicion.Minutes + ":" + Posicion.Seconds;
	})
	$("button[btnCtl]").onclick = () => Player.switchPlayAndPause()
});