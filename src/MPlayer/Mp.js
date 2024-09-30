
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

//-------------------------------------------------

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