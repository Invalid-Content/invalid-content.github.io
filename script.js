// Translations object with English and French text
const translations = {
    en: {
        "musicTitle": "Music",
        "aboutTitle": "About Me",
        "photosTitle": "Photos",
        "contactTitle": "Contact",
    },
    fr: {
        "musicTitle": "Musique",
        "aboutTitle": "Qui suis-je?",
        "photosTitle": "Photos",
        "contactTitle": "Contactez",
    }
};

// Flag to check if typing is in progress
let typingInProgress = false;

// Function to type out text with blinking cursor
function typeText(element, textToType, callback) {
    element.textContent = ""; // Clear initial text
    element.style.opacity = 1; // Make text visible
    let index = 0;

    // Ensure typing doesn't get interrupted
    function type() {
        if (index < textToType.length) {
            element.textContent += textToType[index];
            index++;
            setTimeout(type, 100); // Adjust typing speed here
        } else {
            // Add the cursor at the end once typing is complete
            const cursor = document.createElement("span");
            cursor.classList.add("cursor");
            cursor.textContent = "|";
            element.appendChild(cursor);

            // Call the callback after typing is finished
            if (callback) {
                callback();
            }
        }
    }

    // Initiate typing
    type();
}

// Function to switch language and restart the animation
function switchLanguage(language, callback) {
    if (typingInProgress) return; // Block language switching if typing is still in progress

    typingInProgress = true; // Set the flag to indicate typing is in progress
    const languageToggle = document.getElementById("languageToggle");
    languageToggle.disabled = true; // Disable the toggle button during animation

    let elements = document.querySelectorAll("[data-translate]");
    let count = 0;
    let total = elements.length;

    elements.forEach((element) => {
        const key = element.getAttribute("data-translate");
        const newText = translations[language][key];

        // Clear text before restarting typing to prevent duplicate typing
        element.textContent = "";

        // Restart typing with new text and pass a callback
        typeText(element, newText, () => {
            count++;
            // After all elements have been typed out, call the final callback
            if (count === total && callback) {
                callback();
            }
        });
    });
}

// Event listener for the language toggle slider
document.getElementById("languageToggle").addEventListener("change", function() {
    const language = this.checked ? "fr" : "en"; // Toggle between English and French

    // Wait for typing to finish before switching language
    switchLanguage(language, () => {
        console.log("Language switch complete and all texts are typed.");
        typingInProgress = false; // Reset flag once language switch is complete
        // Re-enable the language toggle after a set time (e.g., 3 seconds)
        setTimeout(() => {
            const languageToggle = document.getElementById("languageToggle");
            languageToggle.disabled = false; // Re-enable the toggle button
        }, 900); // Delay in milliseconds
    });
});
document.querySelectorAll('.gallery img').forEach(img => {
    const ratio = img.naturalWidth / img.naturalHeight;
    if (ratio > 1) {
        img.classList.add('aspect-4-3'); // Landscape images (4:3)
    } else {
        img.classList.add('aspect-3-4'); // Portrait images (3:4)
    }
});

// IntersectionObserver to trigger typewriter animation when elements enter the viewport
const observerOptions = {
    threshold: 0.1 // Trigger when 10% of the element is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains("typed")) {
            entry.target.classList.add("typed"); // Mark as typed to prevent retriggering
            const key = entry.target.getAttribute("data-translate");
            const language = document.getElementById("languageToggle").checked ? "fr" : "en";
            const textToType = translations[language][key];
            typeText(entry.target, textToType, () => {});
        }
    });
}, observerOptions);

// Observe each typewriter element
document.querySelectorAll(".typewriter[data-translate]").forEach((element) => {
    element.setAttribute("data-text", element.textContent);
    element.textContent = ""; // Clear initial text in HTML
    observer.observe(element);
});

// Initialize typing effect for elements that are in view initially (on page load)
document.querySelectorAll(".typewriter[data-translate]").forEach((element) => {
    const key = element.getAttribute("data-translate");
    const language = document.getElementById("languageToggle").checked ? "fr" : "en";
    const textToType = translations[language][key];
    typeText(element, textToType, () => {});
});

document.addEventListener('DOMContentLoaded', function () {
    // Get elements
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playPauseImg = playPauseBtn.querySelector('img');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const songItems = document.querySelectorAll('.musicSelector ul li');
    const audioTexts = {
        clip1: "E Ritorno Da Te  -  Laura Pausini",
        clip2: "Face a la Mer  -  Calogero & Passl",
        clip3: "Hello  -  Adele",
        clip4: "I'm Alive  -  Celine Dion",
        clip5: "Le Ballet. -  Celine Dion",
        clip6: "The Reason. -  Celine Dion"
    };

    let isPlaying = false;
    let currentAudio = null;

    // Function to play the selected song
    function playSong(songFile, clipId) {
        if (currentAudio) {
            currentAudio.pause();  // Pause any currently playing audio
        }

        // Set the new song source
        audioPlayer.src = `./music/${songFile}`;
        audioPlayer.play();  // Play the new song
        isPlaying = true;
        playPauseImg.src = './ui/pauseBtn.png';  // Change to pause button image
        
        document.getElementById('songName').textContent = audioTexts[clipId] || "Playing...";
    }

    // Event listener for song selection
    songItems.forEach(item => {
        item.addEventListener('click', function () {
            const songFile = item.getAttribute('data-song');
            const clipId = item.getAttribute('data-clip');
            playSong(songFile, clipId);
        });
    });

    // Event listener for play/pause button
    playPauseBtn.addEventListener('click', function () {
        if (isPlaying) {
            audioPlayer.pause();  // Pause the song
            isPlaying = false;
            playPauseImg.src = './ui/playBtn.png';  // Change to play button image
        } else {
            audioPlayer.play();  // Play the song
            isPlaying = true;
            playPauseImg.src = './ui/pauseBtn.png';  // Change to pause button image
        }
    });

    nextBtn.addEventListener('click', function () {
        if (audioPlayer.duration > 0) {
            audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 15);  // Fast forward 15 seconds
        }
    });

    prevBtn.addEventListener('click', function () {
        if (audioPlayer.currentTime > 0) {
            audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 15);  // Rewind 15 seconds
        }
    });

    // Optional: Update play/pause button when audio ends
    audioPlayer.addEventListener('ended', function () {
        isPlaying = false;
        playPauseImg.src = './ui/playBtn.png';  // Change to play button when the song ends
    });
});

// Select the photo-column container and the rows to be cloned
const photoColumn = document.querySelector('.photo-column');
const photoColumn2 = document.querySelector('.photo-column2');
const photoColumn3 = document.querySelector('.photo-column3');
const rowsToClone = ['.photo-row1', '.photo-row2', '.photo-row3'];

// Clone the rows and append them to the container for continuous scrolling
rowsToClone.forEach(rowClass => {
    const row = document.querySelector(rowClass);
    const clone = row.cloneNode(true);
    clone.classList.add('cloned'); // add a class to identify clones if needed
    photoColumn.appendChild(clone);
    photoColumn2.appendChild(clone);
    
});

let isScrollingRow1 = true;
let isScrollingRow2 = true;
let isScrollingRow3 = true;

function scrollRows() {
    if (isScrollingRow1) {
        photoColumn.scrollLeft += 1;

        if (photoColumn.scrollLeft >= photoColumn.scrollWidth / 2) {
            photoColumn.scrollLeft = 0;
        }
    }

    requestAnimationFrame(scrollRows);
}

function scrollRows2() {
    if (isScrollingRow2) {
        photoColumn2.scrollLeft -= 1;

        if (photoColumn2.scrollLeft <= 0) {
            photoColumn2.scrollLeft = photoColumn2.scrollWidth / 2;
        }
    }

    requestAnimationFrame(scrollRows2);
}

function scrollRows3() {
    if (isScrollingRow3) {
        photoColumn3.scrollLeft += 1;

        if (photoColumn3.scrollLeft >= photoColumn3.scrollWidth / 2) {
            photoColumn3.scrollLeft = 0;
        }
    }

    requestAnimationFrame(scrollRows3);
}

// Start scrolling
scrollRows();
scrollRows2();
scrollRows3();

// Add event listeners for hover
photoColumn.addEventListener("mouseenter", () => (isScrollingRow1 = false));
photoColumn.addEventListener("mouseleave", () => (isScrollingRow1 = true));

photoColumn2.addEventListener("mouseenter", () => (isScrollingRow2 = false));
photoColumn2.addEventListener("mouseleave", () => (isScrollingRow2 = true));

photoColumn3.addEventListener("mouseenter", () => (isScrollingRow3 = false));
photoColumn3.addEventListener("mouseleave", () => (isScrollingRow3 = true));
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const endSelect = document.getElementById("endSelect");
    const musicSelector = document.querySelector(".musicSelector");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Change CSS variables when #endSelect is in the viewport
                musicSelector.style.setProperty('-webkit-mask-image', '-webkit-gradient(linear, left top, left bottom, from(black), to(black)');
                musicSelector.style.setProperty('-webkit-mask-image', 'linear-gradient(to bottom, black 0%, black 100%)');
                musicSelector.style.setProperty('mask-image', '-webkit-gradient(linear, left top, left bottom, from(black), to(black))');
                musicSelector.style.setProperty('mask-image', 'linear-gradient(to bottom, black 0%, black 100%)');
            } else {
                // Reset to original values if desired
                musicSelector.style.setProperty('webkit-mask-image', '-webkit-gradient(linear, left top, left bottom, from(black), to(transparent)');
                musicSelector.style.setProperty('webkit-mask-image', 'linear-gradient(to bottom, black 0%, transparent 100%)');
                musicSelector.style.setProperty('mask-image', '-webkit-gradient(linear, left top, left bottom, from(black), to(transparent))');
                musicSelector.style.setProperty('mask-image', 'linear-gradient(to bottom, black 0%, transparent 100%)');
            }
        });
    });

    observer.observe(endSelect);
});

function clearContents(element) {
        element.value = "";
}
const galleryImages = document.querySelectorAll('.gallery-image');
const fullscreen = document.getElementById('fullscreen');
const fullscreenImage = document.getElementById('fullscreen-image');

galleryImages.forEach(image => {
    image.addEventListener('click', () => {
        fullscreenImage.src = image.src; // Set the clicked image as fullscreen image
        fullscreen.classList.add('active'); // Show fullscreen view
    });
});

function closeFullscreen() {
    fullscreen.classList.remove('active'); // Hide fullscreen view
    fullscreenImage.src = ''; // Clear the image source
}