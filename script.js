let player;
let currentVideoIndex = 0;
let videoIds = [];
let currentVideoId = '';

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: '',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    document.getElementById('playPauseButton').addEventListener('click', playPauseVideo);
    document.getElementById('backButton').addEventListener('click', playPreviousVideo);
    document.getElementById('nextButton').addEventListener('click', playNextVideo);
    document.getElementById('searchButton').addEventListener('click', searchVideos);
    updateProgressBar();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        document.getElementById('playStatus').textContent = 'Playing';
    } else {
        document.getElementById('playStatus').textContent = 'Paused';
    }
}

function playPauseVideo() {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function playPreviousVideo() {
    if (currentVideoIndex > 0) {
        currentVideoIndex--;
        loadVideoById(videoIds[currentVideoIndex]);
    }
}

function playNextVideo() {
    if (currentVideoIndex < videoIds.length - 1) {
        currentVideoIndex++;
        loadVideoById(videoIds[currentVideoIndex]);
    }
}

function loadVideoById(videoId) {
    player.loadVideoById(videoId);
    currentVideoId = videoId;
}

function searchVideos() {
    const query = document.getElementById('searchInput').value;
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=AIzaSyChL7OogZEmTvrjGjh_S1GzpBEZXdCfGX4`)
        .then(response => response.json())
        .then(data => {
            videoIds = data.items.map(item => item.id.videoId);
            displaySearchResults(data.items);
            if (videoIds.length > 0) {
                currentVideoIndex = 0;
                loadVideoById(videoIds[0]);
            }
        })
        .catch(error => console.error('Error fetching YouTube data:', error));
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const currentTime = document.getElementById('currentTime');
    const totalDuration = document.getElementById('totalDuration');

    setInterval(() => {
        if (player && player.getDuration) {
            const duration = player.getDuration();
            const currentTimeValue = player.getCurrentTime();
            if (duration) {
                progressBar.max = duration;
                progressBar.value = currentTimeValue;
                currentTime.textContent = formatTime(currentTimeValue);
                totalDuration.textContent = formatTime(duration);
            }
        }
    }, 1000);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function displaySearchResults(items) {
    const playlist = document.getElementById('playlist');
    playlist.innerHTML = '';
    items.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = item.snippet.title;
        listItem.classList.add('playlist-item'); // Add a class for styling
        listItem.style.cursor = 'pointer';
        listItem.style.padding = '10px';
        listItem.style.backgroundColor = '#333';
        listItem.style.borderRadius = '5px';
        listItem.style.marginBottom = '10px';
        listItem.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        listItem.addEventListener('mouseover', () => {
            listItem.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)';
        });
        listItem.addEventListener('mouseout', () => {
            listItem.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });
        listItem.addEventListener('click', () => {
            currentVideoIndex = index;
            loadVideoById(item.id.videoId);
        });
        playlist.appendChild(listItem);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById('menuButton');
    const navLinks = document.getElementById('navLinks');
    const homeLink = document.querySelector('a[href="#home"]');
    const aboutLink = document.querySelector('a[href="#about"]');
    const contactLink = document.querySelector('a[href="#contact"]');
    const aboutSection = document.getElementById('about');
    const contactSection = document.getElementById('contact');

    menuButton.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    homeLink.addEventListener('click', () => {
        aboutSection.classList.remove('show ');
        contactSection.classList.remove('show');
    });

    aboutLink.addEventListener('click', () => {
        aboutSection.classList.add('show');
        contactSection.classList.remove('show');
    });

    contactLink.addEventListener('click', () => {
        contactSection.classList.add('show');
        aboutSection.classList.remove('show');
    });

    function updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        const currentTime = document.getElementById('currentTime');
        const totalDuration = document.getElementById('totalDuration');

        setInterval(() => {
            if (player && player.getDuration) {
                const duration = player.getDuration();
                const currentTimeValue = player.getCurrentTime();
                if (duration) {
                    progressBar.max = duration;
                    progressBar.value = currentTimeValue;
                    currentTime.textContent = formatTime(currentTimeValue);
                    totalDuration.textContent = formatTime(duration);
                }
            }
        }, 1000);
    }

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function displaySearchResults(items) {
        const playlist = document.getElementById('playlist');
        playlist.innerHTML = '';
        items.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = item.snippet.title;
            listItem.style.cursor = 'pointer';
            listItem.style.padding = '10px';
            listItem.style.backgroundColor = '#333';
            listItem.style.borderRadius = '5px';
            listItem.style.marginBottom = '10px';
            listItem.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            listItem.addEventListener('mouseover', () => {
                listItem.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)';
            });
            listItem.addEventListener('mouseout', () => {
                listItem.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            });
            listItem.addEventListener('click', () => {
                currentVideoIndex = index;
                loadVideoById(item.id.videoId);
            });
            playlist.appendChild(listItem);
        });
    }
});
