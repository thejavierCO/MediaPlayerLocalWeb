(function (a) {
	document.addEventListener("DOMContentLoaded", function () {
		MP = document.getElementById('Mp');
		coverimg = document.getElementById("picture")
		fileload = 0;
		canvast = document.getElementsByTagName('canvas');
		if (Mp) {
			DetMp();
			loadXMLDoc()
			coverimg.addEventListener("load", function (a) {
				colortest(a.path);
			})

		} else {
			console.log(false)
		}
		//infobox()

	});
})();


function DetMp() {
	Mp.controls = false;
	Mp.autoplay = true;
	TimeMp();
	Mpinfo("Mp");
	//colortest();
}

function btp(a) {
	if (Mp.paused || Mp.ended) {
		document.title = "play";
		Mp.play();
	} else {
		document.title = "pause";
		Mp.pause();
	}
}
function ptest(File) {
	var file1 = File.files[0], url = file1.urn || file1.name;
	ID3.loadTags(File, function () {
		testtest(File)
	}, {
		tags: ["title", "artist", "album", "picture"],
		dataReader: ID3.FileAPIReader(file1)
	});
	var archiver = File
	var reader = new FileReader();
	reader.onload = function () {
		var dataURL = reader.result;
		if (playlist.length == 10) {
			playlist = 0;
		} else {
			playlist.push(dataURL);
		}
	}
	reader.readAsDataURL(archiver.files[0]);
}
function testtest(a) {
	var tags = ID3.getAllTags(a);
	pltitle.push(tags.title);
	plalbum.push(tags.album);
	plartist.push(tags.artist);
	var image = tags.picture;
	if (image) {
		var base64String = "";
		for (var i = 0; i < image.data.length; i++) {
			base64String += String.fromCharCode(image.data[i]);
		}
		var base64 = "data:" + image.format + ";base64," +
			window.btoa(base64String);
		plcover.push(base64);
	} else {
		plcover.push("http://images.coveralia.com/audio/a/Amy_Winehouse-Back_To_Black_(Limited_Edition)-CD.jpg");
	}
	boxcontentload(playlist.length);
	x = document.getElementById('numerfile');
	x.innerHTML = '(' + playlist.length + ')';
}
//---------------------------------------------------
function pld() {
	t = document.getElementById('title')//.textContent = "";
	ar = document.getElementById('artist')//.textContent = "";
	al = document.getElementById('album')//.textContent = "";
	file = playlist[0];
	pl = playlist[fileload];

	if (fileload < playlist.length) {
		fileload++
		Mp.src = playlist[fileload]
		t.textContent = pltitle[fileload];
		ar.textContent = plartist[fileload];
		al.textContent = plalbum[fileload];
		document.getElementById('picture').setAttribute('src', plcover[fileload]);
		coverfondo(plcover[fileload]);
		Id3s("l", pl, "Mp")
		if (fileload == playlist.length) {
			console.log("ok")
		}
	} else {
		fileload = 0
		Mp.src = playlist[fileload]
		t.textContent = pltitle[fileload];
		ar.textContent = plartist[fileload];
		al.textContent = plalbum[fileload];
		document.getElementById('picture').setAttribute('src', plcover[fileload]);
		coverfondo(plcover[fileload]);
		Id3s("l", pl, "Mp")
	}
}
playlist = []
plalbum = []
plcover = []
pltitle = []
plartist = []
//-------------------------------------------------
function TimeMp() {
	Mp.ontimeupdate = function () {
		var p = document.getElementById("test2");
		var p1 = document.getElementById("test1");
		s123(p, Mp.currentTime);
		s123(p1, Mp.duration);
	};
}
function s123(p, time) {
	hors = Math.floor(time / 3600);
	min = Math.floor((time % 3600) / 60);
	seg = Math.floor(time % 60);
	min = min < 10 ? '0' + min : min;
	seg = seg < 10 ? '0' + seg : seg;
	p.innerHTML = min + ":" + seg;
	bar();
}
function bar() {
	test = document.getElementById("linea");
	s1 = Mp.currentTime;
	s2 = Mp.duration;
	x = Math.floor((s1 * 100) / s2);
	test.style.width = x + '%';
}
function pl(File) {
	var file1 = File.files[0], url = file1.urn || file1.name;
	console.log(url)
}
//--------------------------------------------------------------------
function showTags(url) {
	var tags = ID3.getAllTags(url);
	document.getElementById('title').innerHTML = tags.title || "";
	document.getElementById('artist').innerHTML = tags.artist || "";
	document.getElementById('album').innerHTML = tags.album || "";
	var image = tags.picture;
	if (image) {
		var base64String = "";
		for (var i = 0; i < image.data.length; i++) {
			base64String += String.fromCharCode(image.data[i]);
		}
		var base64 = "data:" + image.format + ";base64," +
			window.btoa(base64String);
		document.getElementById('picture').setAttribute('src', base64);
		coverfondo(base64);
	} else {
		document.getElementById('picture').setAttribute('src', "http://images.coveralia.com/audio/a/Amy_Winehouse-Back_To_Black_(Limited_Edition)-CD.jpg")
	}
}
//--------------------------------------------------------------------
function Id3s(Type, File, player) {
	if (Type) {
		if (File) {
			if (Type == "D") {
				console.log("on type")
				if (File) {
					console.log("on file")
				}
				if (player) {
					console.log("on player");
				}
			} else {
				if (Type == "s") {
					console.log("is server file")
					ID3.loadTags(File, function () {
						showTags(File);
					}, {
						tags: ["title", "artist", "album", "picture"]
					});
				}
				if (Type == "l") {
					var file1 = File.files[0], url = file1.urn || file1.name;
					ID3.loadTags(url, function () {
						showTags(url);
					}, {
						tags: ["title", "artist", "album", "picture"],
						dataReader: ID3.FileAPIReader(file1)
					});
					if (player) {
						var archiver = File
						var reader = new FileReader();
						reader.onload = function () {
							var dataURL = reader.result;
							var oninput = document.getElementById(player);
							oninput.src = dataURL;
						}
						reader.readAsDataURL(archiver.files[0]);
					}
				}

			}
		} else {
			console.error("is file not exist")
		}
	} else {
		console.error("you need info")
	}
}
function Mpinfo(player) {
	tag = document.getElementById(player).src;
	Id3s("s", tag, player);
}
function colortest(t) {
	var colorThief = new ColorThief();
	var a = colorThief.getColor(t[0]);
	var cp = colorThief.getPalette(t[0], 8, 5);
	barColor(a, cp);
}
function barColor(a, cp) {
	box = document.getElementById('linea')
	test = document.getElementById('bar')
	box.style.backgroundColor = "rgb(" + a[0] + "," + a[1] + "," + a[2] + ")";
	test.style.backgroundColor = "rgb(" + cp[3][0] + "," + cp[3][1] + "," + cp[3][2] + ")";
}
function coverfondo(base64) {
	x = document.getElementById('fondo');
	x.style.backgroundImage = "url(" + base64 + ")";
}
function boxcontentload(a) {
	cover = document.getElementById('imgcover');
	cover.innerHTML += '<img class=\"coverbox\" src=\"' + plcover[a] + '\"></img>';
	cover.innerHTML += '<span>' + pltitle[a] + '</span>' + '<br>';
}
//-----------------------------------------------------------------------
function Mptest(state) {
	if (state == "P") {
		Mp.play();
	}
	if (state == "p") {
		Mp.pause()
	}
	if (state == "loop") {
		Mp.loop = true;
	}
}
async function loadXMLDoc() {
	let data = await fetch("./test.json").then(e => e.json())
	test(data)
	// var xhttp = new XMLHttpRequest();
	// xhttp.onreadystatechange = function () {
	// 	if (this.readyState == 4 && this.status == 200) {
	// 		data = JSON.parse(this.response);
	// 		test(data);
	// 	}
	// }
	// xhttp.open("GET", "../test.json", true);
	// xhttp.send();
}
function test(a) {
	if (a["ok"]["Mp"]["File"]) {
		Id3s("s", a["ok"]["Mp"]["File"]);
		Mp.src = a["ok"]["Mp"]["File"];
	}
	if (a["ok"]["Mp"]["state"] == "pause") {
		Mptest("p")
	}
	if (a["ok"]["Mp"]["state"] == "playing") {
		Mptest("P")
	}
	if (a["ok"]["Mp"]["replaying"] == "on") {
		Mptest("loop")
	}
	console.log(a["ok"]["Mp"])
}