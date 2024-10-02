let $ = a => document.querySelector(a);
let $$ = a => document.querySelectorAll(a);

document.addEventListener("DOMContentLoaded", async function () {
	let Player = new Player_mediaData("audio#MP");
	Player.loop();
	await Player.getID3().then((Player) => {
		let { title, album, artist, picture } = Player.getDataFile();
		$("span[title]").innerText = title;
		$("span[album]").innerText = album;
		$("span[artist]").innerText = artist;
		$("img[picture]").src = picture;
		$("div.barBg").onclick = ({ offsetX: posicion }) => {
			const { clientWidth: width } = $("div.barBg")
			const Porcentaje = posicion * 100 / width;
			const PosicionOut = Porcentaje * Player.duration / 100;
			Player.posicion = PosicionOut
		}
	})
	$("button[btnCtl]").onclick = () => Player.switchPlayAndPause()
	// update info
	Player.on("status", () => {
		$("button[btnCtl]").innerText = Player.status;
		$("div.barProgress").style.width = (Player.posicion * 100 / Player.duration) + "%";
		let Total = new timeFormat(Player.duration * 1000);
		$("span[total]").innerText = Total.Hours + ":" + Total.Minutes + ":" + Total.Seconds;
		let Posicion = new timeFormat(Player.posicion * 1000);
		$("span[posicion]").innerText = Posicion.Hours + ":" + Posicion.Minutes + ":" + Posicion.Seconds;
	})
	// update from local file
	$("input#audioFile").onchange = ({ srcElement: { files: [file] } }) => {
		Player.insertLocalFile(file)
			.then(clearUrl => {
				Player.on("finished", _ => clearUrl())
				return Player.getID3(file)
			})
			.then((Player) => {
				let { title, album, artist, picture } = Player.getDataFile();
				$("span[title]").innerText = title;
				$("span[album]").innerText = album;
				$("span[artist]").innerText = artist;
				$("img[picture]").src = picture;
				$("div.barBg").onclick = ({ offsetX: posicion }) => {
					const { clientWidth: width } = $("div.barBg")
					const Porcentaje = posicion * 100 / width;
					const PosicionOut = Porcentaje * Player.duration / 100;
					Player.posicion = PosicionOut
				}
			})
	}
});

