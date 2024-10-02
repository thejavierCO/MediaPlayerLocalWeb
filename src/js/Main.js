document.addEventListener("DOMContentLoaded", async function () {
	let Player = new Player_mediaData("audio#MP").autoplay().loop().autoInsertData();
	let ProgressBar = new Barra("div.barBg", "div.barProgress");
	ProgressBar.on("updatePosicion", ({ detail }) => {
		const Porcentaje = detail.posicion * 100 / detail.max;
		const PosicionOut = Porcentaje * Player.duration / 100;
		Player.posicion = PosicionOut
	})
	Player.on("currentTime", ({ detail: { total, posicion } }) => {
		ProgressBar.setPosicionForPercentage((posicion * 100 / total))
	})
	await Player.getID3()
	// update from local file
	$("input#audioFile").onchange = ({ srcElement: { files: [file] } }) =>
		Player.insertLocalFile(file)
			.then(async clearUrl => {
				Player.on("finished", _ => clearUrl())
				await Player.getID3(file)
			})
});

