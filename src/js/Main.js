let $ = a => document.querySelector(a);
let $$ = a => document.querySelectorAll(a);

document.addEventListener("DOMContentLoaded", async function () {
	let Player = new Player_mediaData("audio#MP");
	console.log(await Player.ID3())
});