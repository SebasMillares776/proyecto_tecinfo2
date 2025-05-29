document.addEventListener('DOMContentLoaded', () => {
    // Convert hex color to RGB for CSS rgba() usage in JS
    const hexToRgb = (hex) => {
        let r = 0, g = 0, b = 0;
        // Handle #ABC format
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            // Handle #AABBCC format
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return `${r}, ${g}, ${b}`;
    };

    document.documentElement.style.setProperty('--color-primary-rgb', hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim()));
    document.documentElement.style.setProperty('--color-text-rgb', hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim()));


    // --- Galería de Imágenes Interactiva ---
    const imageItems = document.querySelectorAll('.image-item');
    const prevButton = document.querySelector('.gallery-button.prev');
    const nextButton = document.querySelector('.gallery-button.next');
    let currentImageIndex = 0;

    const showImage = (index) => {
        imageItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
    };

    const nextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % imageItems.length;
        showImage(currentImageIndex);
    };

    const prevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + imageItems.length) % imageItems.length;
        showImage(currentImageIndex);
    };

    prevButton.addEventListener('click', prevImage);
    nextButton.addEventListener('click', nextImage);

    // Auto-slide functionality (optional)
    let imageGalleryInterval = setInterval(nextImage, 5000); // Change image every 5 seconds

    // Pause auto-slide on hover
    const imageGallery = document.querySelector('.image-gallery');
    imageGallery.addEventListener('mouseenter', () => clearInterval(imageGalleryInterval));
    imageGallery.addEventListener('mouseleave', () => imageGalleryInterval = setInterval(nextImage, 5000));

    // Initial display
    showImage(currentImageIndex);


    // --- Videos Interactivos (Modal con YouTube API) ---
    const videoCards = document.querySelectorAll('.video-card');
    const videoModal = document.getElementById('video-modal');
    const closeModalButton = document.querySelector('.close-button');
    const modalVideoTitle = document.getElementById('modal-video-title');
    const modalVideoDescription = document.getElementById('modal-video-description');
    let player; // YouTube Player object

    // Function to load YouTube Iframe API
    function onYouTubeIframeAPIReady() {
        // This function is called automatically by the YouTube API when it's ready.
        // We'll create the player instance when a video is opened.
    }

    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoId = card.dataset.videoId;
            const videoTitle = card.dataset.title;
            const videoDescription = card.dataset.description;

            modalVideoTitle.textContent = videoTitle;
            modalVideoDescription.textContent = videoDescription;
            videoModal.style.display = 'block';

            if (player) {
                player.loadVideoById(videoId);
            } else {
                player = new YT.Player('youtube-player', {
                    height: '500',
                    width: '100%',
                    videoId: videoId,
                    playerVars: {
                        'autoplay': 1,
                        'controls': 1,
                        'rel': 0, // Do not show related videos
                        'modestbranding': 1 // No YouTube logo
                    },
                    events: {
                        'onReady': (event) => event.target.playVideo()
                    }
                });
            }
        });
    });

    closeModalButton.addEventListener('click', () => {
        videoModal.style.display = 'none';
        if (player) {
            player.stopVideo(); // Stop the video when modal is closed
        }
    });

    // Close modal if clicking outside the content
    window.addEventListener('click', (event) => {
        if (event.target === videoModal) {
            videoModal.style.display = 'none';
            if (player) {
                player.stopVideo();
            }
        }
    });


    // --- Juegos Interactivos ---

    // Quiz del Reciclaje
    const quizGameButton = document.querySelector('.game-button[data-game-id="quiz-reciclaje"]');
    const quizContent = document.getElementById('quiz-reciclaje');
    const quizQuestions = quizContent.querySelectorAll('.quiz-question');
    const quizResults = quizContent.querySelector('.quiz-results');
    const quizScoreDisplay = document.getElementById('quiz-score');
    const quizRestartButton = quizContent.querySelector('.quiz-restart-button');

    let currentQuizQuestion = 0;
    let score = 0;
    const quizAnswers = {
        'q1': 'd', // Envases de tetrabrik (suelen ir en el amarillo o gris, no azul de papel/cartón)
        'q2': 'c'  // Energía solar
    };

    const showQuizQuestion = (index) => {
        quizQuestions.forEach((q, i) => {
            q.classList.remove('active');
            if (i === index) {
                q.classList.add('active');
                q.querySelector('.feedback').textContent = ''; // Clear previous feedback
                const radioButtons = q.querySelectorAll('input[type="radio"]');
                radioButtons.forEach(radio => radio.checked = false); // Uncheck radios
            }
        });
        quizResults.classList.remove('active');
    };

    const checkQuizAnswer = (questionElement, questionName, selectedAnswer) => {
        const feedbackElement = questionElement.querySelector('.feedback');
        if (selectedAnswer === quizAnswers[questionName]) {
            feedbackElement.textContent = '¡Correcto!';
            feedbackElement.className = 'feedback correct';
            score++;
        } else {
            feedbackElement.textContent = `Incorrecto. La respuesta correcta es "${quizAnswers[questionName].toUpperCase()}".`;
            feedbackElement.className = 'feedback incorrect';
        }
    };

    quizQuestions.forEach(question => {
        const nextButton = question.querySelector('.quiz-next-button');
        const questionName = question.dataset.question; // e.g., '1' for q1

        nextButton.addEventListener('click', () => {
            const selectedRadio = question.querySelector(`input[name="q${questionName}"]:checked`);
            if (selectedRadio) {
                checkQuizAnswer(question, `q${questionName}`, selectedRadio.value);
                setTimeout(() => {
                    currentQuizQuestion++;
                    if (currentQuizQuestion < quizQuestions.length) {
                        showQuizQuestion(currentQuizQuestion);
                    } else {
                        quizQuestions.forEach(q => q.classList.remove('active'));
                        quizResults.classList.add('active');
                        quizScoreDisplay.textContent = `Has respondido correctamente a ${score} de ${quizQuestions.length} preguntas.`;
                    }
                }, 1000); // Give time to read feedback
            } else {
                alert('Por favor, selecciona una opción.');
            }
        });
    });

    quizRestartButton.addEventListener('click', () => {
        currentQuizQuestion = 0;
        score = 0;
        showQuizQuestion(currentQuizQuestion);
    });

    quizGameButton.addEventListener('click', () => {
        document.querySelectorAll('.game-content').forEach(gc => gc.classList.remove('active')); // Hide other games
        quizContent.classList.add('active');
        showQuizQuestion(currentQuizQuestion);
    });


    // Eco-Memory Game
    const memoryGameButton = document.querySelector('.game-button[data-game-id="eco-memory"]');
    const memoryGameContent = document.getElementById('eco-memory');
    const memoryGrid = memoryGameContent.querySelector('.memory-grid');
    const memoryStatus = memoryGameContent.querySelector('#memory-status');
    const memoryRestartButton = memoryGameContent.querySelector('.memory-restart-button');

    const memoryEmojis = ['🌳', '☀️', '💧', '♻️', '🌍', '💡', '🌱', '🌬️'];
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let lockBoard = false;

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const createMemoryBoard = () => {
        memoryGrid.innerHTML = '';
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        lockBoard = false;
        memoryStatus.textContent = 'Encuentra los pares.';

        const gameEmojis = shuffleArray([...memoryEmojis, ...memoryEmojis]);

        gameEmojis.forEach((emoji, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.emoji = emoji;
            cardElement.dataset.index = index;

            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.textContent = emoji;

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');
            // You can add a default icon or text for the back of the card if desired
            // cardBack.textContent = '?';

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardElement.appendChild(cardInner);

            cardElement.addEventListener('click', flipCard);
            memoryGrid.appendChild(cardElement);
            cards.push(cardElement);
        });
    };

    const flipCard = (event) => {
        if (lockBoard) return;
        const clickedCard = event.currentTarget;
        if (clickedCard === flippedCards[0]) return; // Prevent clicking the same card twice

        clickedCard.classList.add('flipped');
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            lockBoard = true;
            checkForMatch();
        }
    };

    const checkForMatch = () => {
        const [cardOne, cardTwo] = flippedCards;
        const isMatch = cardOne.dataset.emoji === cardTwo.dataset.emoji;

        isMatch ? disableCards() : unflipCards();
    };

    const disableCards = () => {
        const [cardOne, cardTwo] = flippedCards;
        cardOne.classList.add('matched');
        cardTwo.classList.add('matched');
        cardOne.removeEventListener('click', flipCard);
        cardTwo.removeEventListener('click', flipCard);
        matchedPairs++;

        resetBoard();
        if (matchedPairs === memoryEmojis.length) {
            memoryStatus.textContent = '¡Felicidades! Has encontrado todos los pares.';
        }
    };

    const unflipCards = () => {
        lockBoard = true; // Keep board locked during unflip animation
        setTimeout(() => {
            flippedCards.forEach(card => card.classList.remove('flipped'));
            resetBoard();
        }, 1000); // Unflip after 1 second
    };

    const resetBoard = () => {
        [flippedCards, lockBoard] = [[], false];
    };

    memoryRestartButton.addEventListener('click', createMemoryBoard);

    memoryGameButton.addEventListener('click', () => {
        document.querySelectorAll('.game-content').forEach(gc => gc.classList.remove('active')); // Hide other games
        memoryGameContent.classList.add('active');
        createMemoryBoard(); // Initialize the game
    });

});
