//Array randomizer (Fisher-Yates algorithm)
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function setMusicName(name) {
	$("#music-name").fadeOut(1000, function() {
		$(this).html(name);
		$(this).fadeIn(1000);
	});
}

var youtubePlayer;
var actualMusic = -1;

$(function() {
	if (l_bgImagesRandom)
		l_bgImages = shuffle(l_bgImages);
	if (l_music) {
		if (l_youtube) {
			loadYoutube();
		} else {
			l_musicList = shuffle(l_musicList);
			var music = document.getElementById("music");
			music.src = l_musicList[Math.floor(Math.random() * l_musicList.length)];
			music.volume = 0.05;
			music.autoplay = true;
			music.load();
		}
	}

	$.backstretch(l_bgImages, {duration: l_bgImageDuration, fade: l_bgImageFadeVelocity});
	$("#title").html("<img src='"+l_serverImage+"'>");
});

function loadYoutube() {
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
	youtubePlayer = new YT.Player('player', {
	  height: '390',
	  width: '640',
	  host: 'https://www.youtube.com',
	  playerVars: {
		controls: 0,
		cc_load_policy: 0,
		disablekb: 1,
		modestbranding: 1,
		rel: 0,
		showinfo: 0
	  },
	  events: {
	    'onReady': onPlayerReady,
		'onStateChange': onPlayerStateChange
	  }
	});
}

function onPlayerReady(event) {
	$.getJSON( "https://unnamedproject.ru/scripts/unnamedplayer/php/playlist.php?playlistId="+l_musicPlaylist, function( data ) {
		var playlistLength = data.pageInfo.totalResults;
		youtubePlayer.cuePlaylist({
			'listType': 'playlist',
			'list': l_musicPlaylist,
			'index' : [Math.floor(Math.random() * playlistLength)]
		});
		setTimeout( function() { 
			//event.target.stopVideo();
			//event.target.playVideoAt(3);
			if (youtubePlayer.isMuted()) youtubePlayer.unMute();
			youtubePlayer.setVolume(l_musicVolume);
			event.target.setShuffle(true); 
			event.target.playVideo();
			event.target.setLoop(true);
			}, 
		500);
	});
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING) {
		var id = event.target.getPlaylist()[event.target.getPlaylistIndex()];
		$.getJSON('https://unnamedproject.ru/scripts/unnamedplayer/php/video.php?id='+id, function (data) {
			setMusicName(data.title);
			console.log(data.title);
		});
	}
}

var neededFiles;
var downloadedFiles = 0;

function DownloadingFile( fileName ) {
	downloadedFiles++;
	refreshProgress();

	setStatus("Загрузка файлов...");
}

function SetStatusChanged( status ) {
	if (status.indexOf("Getting Addon #") != -1) {
		downloadedFiles++;
		refreshProgress();
	}

	setStatus(status);
}

function SetFilesNeeded( needed ) {
	neededFiles = needed + 1;
}

function refreshProgress() {
	progress = Math.floor(((downloadedFiles / neededFiles)*100));

	setProgress(progress);
}

function setStatus(status) {
	if(status == 'Retrieving server info...') {
		$("#status").html("Получение информации о сервере...");
		setProgress(5);
	} else if(status == 'Mounting Addons') {
		$("#status").html("Монтирование аддонов");
		setProgress(55);
	} else if(status == 'Workshop Complete') {
		$("#status").html("Воркшоп - успешно");
		setProgress(85);
	} else if(status == 'Sending client info...') {
		$("#status").html("Отправка сведений о клиенте...");
		setProgress(100);
	} else if(status == 'Starting Lua...') {
		$("#status").html("Запуск Lua...");
		setProgress(90);
	} else {
		$("#status").html("Загрузка...");
		setProgress(35);
	}
}

function setProgress(progress) {
	$("#loading-progress").css("width", progress + "%");
	$("#percent").html(progress + "%");
}