document.addEventListener("DOMContentLoaded", async function () {
	let Player = new Player_mediaData("audio#MP").autoInsertData().autoGetID3();
	let ProgressBar = new Barra("div.barBg", "div.barProgress");
	ProgressBar.on("updatePosicion", ({ detail }) => {
		const Porcentaje = detail.posicion * 100 / detail.max;
		const PosicionOut = Porcentaje * Player.duration / 100;
		Player.posicion = PosicionOut
	})
	Player.on("currentTime", ({ detail: { total, posicion } }) => {
		ProgressBar.setPosicionForPercentage((posicion * 100 / total))
	})
	// update from local file
	$("input#audioFile").onchange = ({ srcElement: { files: [file] } }) =>
		Player.insertLocalFile(file)
			.then(async clearUrl => {
				Player.on("finished", _ => clearUrl())
				return Player.getColorsCover();
			}).then(e => {
				console.log(e.length)
				for (let index = 0; index < e.length; index++) {
					if ($$("[useBgColor" + index + "]").length != 0) $$("[useBgColor" + index + "]").forEach(tag => tag.style.backgroundColor = e[index])
					if ($$("[useBrColor" + index + "]").length != 0) $$("[useBrColor" + index + "]").forEach(tag => tag.style.borderColor = e[index])
					if ($$("[useColor" + index + "]").length != 0) $$("[useColor" + index + "]").forEach(tag => tag.style.color = e[index])
				}
			})

});

