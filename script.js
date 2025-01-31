// Select elements
const percentageDisplay = document.getElementById('percentage');
const musicPlayerPage = document.getElementById('device');
const circleProgress = document.querySelector('.circle-progress');
const celebrationImage = document.getElementById('celebration-image');

// Function to simulate loading and percentage animation
function startLoader() {
  // Set the body to the loader style
  document.body.classList.add('loader-style');
  
  let percentage = 0;
  const totalTime = 3000; // 10 seconds
  const intervalTime = 100; // 100 milliseconds interval
  const incrementAmount = (100 / (totalTime / intervalTime)); // percentage increment for 10 seconds
  
  const interval = setInterval(() => {
    percentage += incrementAmount;
    percentage = Math.min(percentage, 100); // Keep it at 100 max
    percentageDisplay.textContent = `${Math.round(percentage)}%`;

    // Calculate the stroke offset based on the percentage
    const offset = 345 - (345 * (percentage / 100));
    circleProgress.style.strokeDashoffset = offset;

    if (percentage >= 100) {
      clearInterval(interval);
      showCelebration();
    }
  }, intervalTime);
}

// Function to show the celebration image
function showCelebration() {
  // Hide the loader circle
  document.querySelector('.loader-circle').style.display = 'none';
  
  // Show the celebration image with animation
  celebrationImage.style.display = 'block';
  celebrationImage.classList.add('reveal-celebration');

  // After 5 seconds, switch to the music player page
  setTimeout(() => {
    // Switch to the music player body style
    document.body.classList.remove('loader-style');
    document.body.classList.add('device');
    
    // Show the music player by adding the "show" class
    musicPlayerPage.classList.add('show');
    loadSong();
  }, 1600); // 5 seconds for the celebration image to show
}

// Start the loader as soon as the document content is fully loaded
document.addEventListener('DOMContentLoaded', startLoader);





// ----------------Music Player

// set variables
let currentSong = 0, playing = false, repeatMode = 'none';

// grab relevant element references
const elements = {
  images: document.getElementsByClassName("album-art"),
  songs: document.getElementsByClassName("song"),
  artists: document.getElementsByClassName("artist"),
  play: document.getElementById("play-button"),
  previous: document.getElementById("previous-button"),
  next: document.getElementById("next-button"),
  repeat: document.getElementById('repeat-button'),
  currentSong: document.getElementById("current-song"),
  slider: document.getElementById("slider"),
  progressBar: document.getElementById("slider") // Progress bar container
};

// Array of song file URLs
const songList = [
  "Audio/audio.mp3",
  "Audio/audio-2.mp3",
  "Audio/audio-3.mp3"
];

const audio = new Audio(songList[currentSong]);

// Update song source and play
function loadSong() {
  audio.src = songList[currentSong];
  audio.play();
  playing = true;
  elements.play.classList.add("pause");
}

// Play/Pause functionality
function play() {
  if (!playing) {
    audio.play();
    playing = true;
    elements.play.classList.add("pause");
  } else {
    audio.pause();
    playing = false;
    elements.play.classList.remove("pause");
  }
}

// Move to next song
function next() {
  updateDOM('remove');
  currentSong = (currentSong + 1) % songList.length;
  updateDOM('add');
  loadSong();
  elements.slider.value = 0;
}

// Move to previous song
function previous() {
  updateDOM('remove');
  currentSong = (currentSong - 1 + songList.length) % songList.length;
  updateDOM('add');
  loadSong();
  elements.slider.value = 0;
}

// Update UI
function updateDOM(action) {
  elements.currentSong.innerHTML = currentSong + 1;
  if (action === 'add') {
    elements.images[currentSong].classList.add("active");
    elements.songs[currentSong].classList.add("active");
    elements.artists[currentSong].classList.add("active");
  } else {
    elements.images[currentSong].classList.remove("active");
    elements.songs[currentSong].classList.remove("active");
    elements.artists[currentSong].classList.remove("active");
  }
}

// Sync slider with audio progress (Fixing the color issue)
audio.addEventListener("timeupdate", () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  elements.slider.value = progress;

  // Fix: Ensure progress color updates correctly with the slider indicator
  elements.slider.style.background = `linear-gradient(to right, #49C6FF ${progress}%, #ddd ${progress}%)`;
});

// Change song position using slider
function sliderChange() {
  audio.currentTime = (elements.slider.value / 100) * audio.duration;
}

// Play next song when the current one ends
audio.addEventListener("ended", () => {
  if (repeatMode === 'one') {
    loadSong(); // Repeat the current song
  } else if (repeatMode === 'all') {
    next(); // Move to next song
  } else {
    next(); // Move to next song when no repeat
  }
});



// Toggle repeat mode
function toggleRepeat() {
  if (repeatMode === 'none') {
    repeatMode = 'one'; // Repeat the current song
    elements.repeat.classList.remove('repeat-all', 'repeat-none');
    elements.repeat.classList.add('repeat-one');
    document.getElementById("repeat-icon").src = "images/repeat-one.png"; // Update image for repeat one
    elements.repeat.setAttribute('aria-label', "Repeat One"); // Update accessible label
  } else if (repeatMode === 'one') {
    repeatMode = 'all'; // Repeat the entire playlist
    elements.repeat.classList.remove('repeat-one', 'repeat-none');
    elements.repeat.classList.add('repeat-all');
    document.getElementById("repeat-icon").src = "images/repeat.png"; // Update image for repeat all
    elements.repeat.setAttribute('aria-label', "Repeat All"); // Update accessible label
  } else {
    repeatMode = 'none'; // No repeat
    elements.repeat.classList.remove('repeat-one', 'repeat-all');
    elements.repeat.classList.add('repeat-none');
    document.getElementById("repeat-icon").src = "images/repeat-none.png"; // Update image for no repeat
    elements.repeat.setAttribute('aria-label', "No Repeat"); // Update accessible label
  }
}


// Keyboard Controls
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "Space":
      play();
      event.preventDefault(); // Prevents scrolling
      break;
    case "ArrowRight":
      audio.currentTime += 5; // Forward 5 seconds
      break;
    case "ArrowLeft":
      audio.currentTime -= 5; // Rewind 5 seconds
      break;
  }
});

// Initial setup
function init() {
  updateDOM('add');
  elements.next.addEventListener("click", next);
  elements.previous.addEventListener("click", previous);
  elements.play.addEventListener("click", play);
  elements.slider.addEventListener("input", sliderChange);
  elements.repeat.addEventListener("click", toggleRepeat); // Add event listener for repeat button
}

init();
