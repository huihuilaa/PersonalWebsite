import songs from '../json/songs.json' with { type: 'json' };
import movies from '../json/movies.json' with { type: 'json' };
import works from '../json/works.json' with { type: 'json' };
import urls from '../json/urls.json' with { type: 'json' };

const audio = document.getElementById('musicPlayer');
const playBtn = document.getElementById('playBtn');
const musicName = document.querySelector('.music-name');
const nextSongText = document.querySelector('.music-next-song');
const progressDot = document.querySelector('.music-progress-dot');
const timeDisplay = document.querySelector('.music-time');
const navList = document.querySelector('.nav');


const modals = {
    video: document.getElementById("videoModal"),
    work: document.getElementById("workModal"),
    link: document.getElementById("linkModal")
};

const iframes = {
    youtube: document.getElementById("youtubePlayer"),
    pdf: document.getElementById("workPDFViewer"),
    link: document.getElementById("linkViewer")
};

let songIndex = 0;


const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

const loadSong = (index) => {
    const song = songs[index];
    progressDot.style.left = '0%';
    musicName.innerText = song.title;
    audio.src = song.source;
    nextSongText.innerText = `下一首：${song.next}`;
};

// Initialize Music Player

if (audio) {
    audio.volume = 0.3;
    loadSong(songIndex);
}

// Play Control

playBtn?.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerText = '||';
    } else {
        audio.pause();
        playBtn.innerText = '▶';
    }
});

audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressDot.style.left = `${percent}%`;
    timeDisplay.innerText = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration || 0)}`;
});

document.addEventListener('click', (e) => {
    const target = e.target;

    // Hamburger Menu Control
    if (target.closest('#mobile-menu')) {
        navList.classList.toggle('active');
    }

    // Smooth Scroll & Auto Close Menu
    if (target.classList.contains('nav-link')) {
        e.preventDefault();
        navList.classList.remove('active');
        const targetEl = document.querySelector(target.getAttribute('href'));
        if (targetEl) window.scrollTo({ top: targetEl.offsetTop - 100, behavior: 'smooth' });
    }

    // Song Switch
    
    if (target.closest('.next-btn')) {
        songIndex = (songIndex + 1) % songs.length;
        loadSong(songIndex);
        audio.play();
        playBtn.innerText = '||';
    }

    if (target.closest('.prev-btn')) {
        songIndex = (songIndex - 1 + songs.length) % songs.length;
        loadSong(songIndex);
        audio.play();
        playBtn.innerText = '||';
    }

    // Movies Modal

    if (target.closest('.card-1-3')) {
        const movieName = target.closest('.card-1-3').parentElement.querySelector('.movie-name').innerText.trim();
        if (movies[movieName]) {
            iframes.youtube.src = `${movies[movieName]}?autoplay=1`;
            modals.video.style.display = "block";
        }
    }

    // Works Modal

    if (target.closest('.card-1-2 img')) {
        const title = target.closest('.card-1-2').querySelector('h3').innerText.trim();
        if (works[title]) {
            iframes.pdf.src = works[title].pdf;
            modals.work.style.display = "block";
        }
    }

    // Contact Modal

    if (target.dataset.type || target.closest('[data-type]')) {
        const el = target.dataset.type ? target : target.closest('[data-type]');
        const type = el.dataset.type;
        
        if (urls[type]) {
            e.preventDefault();
            iframes.link.src = urls[type];
            modals.link.style.display = "block";
        }
    }

    // Close Modal

    if (target.classList.contains('modal') || target.closest('[class*="close-"]')) {
        const activeModal = target.closest('.modal');
        if (activeModal) {
            activeModal.style.display = "none";
            const iframe = activeModal.querySelector('iframe');
            if (iframe) iframe.src = "";
        }
    }
});