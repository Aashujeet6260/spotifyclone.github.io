

let currentSongs = new Audio;
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let songName = element.href.split("/songs")[1];
            songs.push(songName.substring(1)); // Remove the leading "/"
        }
    }
    return songs;
}


// when the song will be playing 

const playMusic = (track, pause = false) => {
    currentSongs.src = "/songs/" + track;
    if (!pause) {
        currentSongs.play();
        play.src = "./assets/pause.svg";

    }

    document.querySelector(".song-info").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}



async function main() {
    // to get the list of songs from the server
    songs = await getsongs();
    playMusic(songs[0], true);
    
    let decodedSongs = songs.map(song => decodeURIComponent(song));

    let songUL = document.getElementById("List").getElementsByTagName("ul")[0]
    for (const song of decodedSongs) {
        songUL.innerHTML = songUL.innerHTML + `<li>

       <img class="invert"src="./assets/music.svg" alt="" srcset="">
       <div class="songinfo">
           <div> ${song.replaceAll("%20", " ")}</div>
           <div class="artistname">Aashu</div>
       </div>
       <div class="playnow">
       <span>Playnow</span>
       <img src="./assets/playbutton.svg" alt="" srcset="">
   </div>
       
      </li>`;
    }

    // adding event listner to each song 

    Array.from(document.getElementById("List").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', (event) => {
            
            playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML.trim())
        });

    });


    // adding event listener to the play button
    play.addEventListener('click', () => {
        if (currentSongs.paused) {
            currentSongs.play();
            play.src = "./assets/pause.svg";
        } else {
            currentSongs.pause(); // Corrected this line
            play.src = "./assets/play.svg";
        }
    });


    /// to timeupdate

    currentSongs.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSongs.currentTime)} / ${secondsToMinutesSeconds(currentSongs.duration)}`

        document.querySelector(".circle").style.left = (currentSongs.currentTime / currentSongs.duration) * 100 + "%";
    })

    // add an event listener to the seek bar

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSongs.currentTime = currentSongs.duration * percent / 100;
    })


    // add event listner to hambuerger 

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // add event listner to close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    })


    // add event listmer into the previous and next button
    previous.addEventListener('click', () => {
        let index = songs.indexOf(currentSongs.src.split("/")[currentSongs.src.split("/").length - 1]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });
    
    next.addEventListener('click', () => {
        let index = songs.indexOf(currentSongs.src.split("/")[currentSongs.src.split("/").length - 1]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    // add event listiner to the volume button 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        
        currentSongs.volume = parseInt(e.target.value)/100    
    });

    // add an event to violume 

    
}



main();



