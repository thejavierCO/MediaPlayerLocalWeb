let $ = a => document.querySelector(a);
let $$ = a => document.querySelectorAll(a);

document.addEventListener("DOMContentLoaded", async function () {
	let Player = new Player_mediaData("audio#MP");
	console.log(await Player.ID3())
});
// function Mplayer() {
// 	MP.ontimeupdate = function(){text(MP)}
// }
// function text(a) {
// 	total = Math.floor(a.duration)
// 	posicion = Math.floor(a.currentTime)
// 	por = Math.floor((posicion*100)/total);
// 	test(por)
// }
// function testpor(a,b) {
// 	p = a.offsetX
// 	t = b.offsetWidth
// 	po = Math.floor((p*100)/t);
// 	bsr(po)
// }
// function test(a) {
// 	bar = document.getElementById('barload')
// 	bar.style = "Width:"+a+"%;";
// }
// function bsr(a) {
// 	to = Math.floor(MP.duration)
// 	posicion = Math.floor((a*to)/100)
// 	MP.currentTime = posicion;
// }
//------------------------------------------------------------------------------------------------------
// function showTags(url) {
// 	var tags = ID3.getAllTags(url);
// 	var image = tags.picture;
// 	if (image) {
// 		var base64String = "";
// 		for (var i = 0; i < image.data.length; i++) {
// 		    base64String += String.fromCharCode(image.data[i]);
// 		}
// 		var base64 = "data:" + image.format + ";base64," +
// 		window.btoa(base64String);
// 	}
// 	console.log(tags)
// }
// function id3(File){
// 	var file1 = File.files[0], url = file1.urn || file1.name;
// 	ID3.loadTags(url, function() {
// 		showTags(url);
// 	}, {
// 		tags: ["title","artist","album","picture"],
// 		dataReader: ID3.FileAPIReader(file1)
// 	});
// 	console.log(File)
// }