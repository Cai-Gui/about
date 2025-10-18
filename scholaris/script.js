// Navbar and Menu Functionality
document.addEventListener('DOMContentLoaded', function () {
    const logo = document.querySelector('.logo');
    const homeLink = document.querySelector('.dropdown-menu a[href="https://fcg.ct.ws/"]');
    const insightumLink = document.querySelector('.dropdown-menu a[href="https://fcg.ct.ws/scholaris"]');

    // Logo click navigates to the home page
    logo.addEventListener('click', function () {
        window.location.href = 'https://fcg.ct.ws/';
    });

    // Home link click navigates to the home page
    homeLink.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default anchor behaviour
        window.location.href = 'https://fcg.ct.ws/';
    });

    // Insightum link click navigates to the Insightum page
    insightumLink.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default anchor behaviour
        window.location.href = 'https://fcg.ct.ws/scholaris';
    });

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        dropdownMenu.classList.toggle('active');
    }

    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInside = hamburger.contains(event.target) || dropdownMenu.contains(event.target);
        if (!isClickInside && isMenuOpen) {
            toggleMenu();
        }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && isMenuOpen) {
            toggleMenu();
        }
    });
});

// Quiz Functionality
let quizData = [];
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let totalQuestions = 0;
let userAnswers = [];

const quizCodeTextarea = document.getElementById('quiz-code');
const startQuizButton = document.getElementById('start-quiz-button');
const helpButton = document.getElementById('help-button');
const instructionSection = document.getElementById('instruction-section');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
const notificationCloseButton = document.getElementById('notification-close-button');
const currentQuestionNumberSpan = document.getElementById('current-question-number');
const totalQuestionsSpan = document.getElementById('total-questions');
const quizQuestionDiv = document.getElementById('quiz-question');
const quizOptionsDiv = document.getElementById('quiz-options');
const correctAnswersSpan = document.getElementById('correct-answers');
const totalQuestionsResultSpan = document.getElementById('total-questions-result');
const retryButton = document.getElementById('retry-button');
const newQuizButton = document.getElementById('new-quiz-button');
const pageTitle = document.querySelector('.page-title');

startQuizButton.addEventListener('click', function () {
    const code = quizCodeTextarea.value.trim();
    const pasteButton = document.getElementById('paste-button');
  
    if (!code) {
        shakeElement(quizCodeTextarea);
        shakeElement(pasteButton);
        return;
    }

    try {
        // Clear previous quizData if any
        quizData = [];
        eval(code);

        if (!Array.isArray(quizData)) {
            throw new Error('quizData is not an array.');
        }

        totalQuestions = quizData.length;

        if (totalQuestions < 1) {
            throw new Error('The quiz must contain at least 1 question.');
        }

        if (totalQuestions > 15) {
            throw new Error('Too many questions. Please provide up to 15 questions.');
        }

        // Validate each question object
        for (let i = 0; i < quizData.length; i++) {
            const q = quizData[i];
            if (
                typeof q.question !== 'string' ||
                !Array.isArray(q.options) ||
                q.options.length !== 4 ||
                typeof q.correctOptionIndex !== 'number' ||
                q.correctOptionIndex < 0 ||
                q.correctOptionIndex > 3
            ) {
                throw new Error(`Invalid format in question ${i + 1}.`);
            }
        }

        instructionSection.style.display = 'none';
        totalQuestionsSpan.textContent = totalQuestions;
        startQuiz();
    } catch (e) {
        showError(`Error! Did you follow the format?`);
        shakeElement(quizCodeTextarea);
        shakeElement(pasteButton);
    }
});

function startQuiz() {
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    userAnswers = [];
    shuffleArray(quizData);
    quizSection.style.display = 'block';
    pageTitle.style.display = 'none';
    instructionSection.style.display = 'none';
    document.querySelector('.page-title').classList.add('hidden');
    quizQuestionDiv.classList.add('large');
    showQuestion();
}

function showQuestion() {
    quizQuestionDiv.textContent = '';
    quizOptionsDiv.innerHTML = '';

    const questionData = quizData[currentQuestionIndex];
    currentQuestionNumberSpan.textContent = currentQuestionIndex + 1;
    quizQuestionDiv.textContent = questionData.question;

    questionData.options.forEach(function (option, index) {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', function () {
            checkAnswer(index, button);
        });
        quizOptionsDiv.appendChild(button);
    });
}

function checkAnswer(selectedOptionIndex, selectedButton) {
    const questionData = quizData[currentQuestionIndex];
    const buttons = quizOptionsDiv.querySelectorAll('button');
    buttons.forEach(function (button, index) {
        button.disabled = true;
        if (index === questionData.correctOptionIndex) {
            button.style.backgroundColor = '#28a745'; // Green for correct
            button.style.color = '#fff';
        }
    });

    if (selectedOptionIndex !== questionData.correctOptionIndex) {
        selectedButton.style.backgroundColor = '#dc3545'; // Red for incorrect
        selectedButton.style.color = '#fff';
    } else {
        correctAnswersCount++;
    }

    // Store user's answer
    userAnswers.push({
        question: questionData.question,
        options: questionData.options,
        correctOptionIndex: questionData.correctOptionIndex,
        userSelectedIndex: selectedOptionIndex
    });

    setTimeout(function () {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 500); // Wait for 0.5 seconds
}

function showResult() {
    quizSection.style.display = 'none';
    resultSection.style.display = 'block';
    correctAnswersSpan.textContent = correctAnswersCount;
    totalQuestionsResultSpan.textContent = totalQuestions;

    // Calculate percentage
    const percentage = Math.round((correctAnswersCount / totalQuestions) * 100);
    // Update circle
    updateScoreCircle(percentage);

    // Populate review section
    populateReviewSection();
}

function updateScoreCircle(percentage) {
    const progressCircle = document.querySelector('.progress-circle');
    const scorePercentageText = document.querySelector('.score-percentage');

    const radius = progressCircle.getAttribute('r');
    const circumference = 2 * Math.PI * radius;

    const offset = circumference - (percentage / 100) * circumference;
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = offset;

    scorePercentageText.textContent = `${percentage}%`;
}

function populateReviewSection() {
    const reviewSection = document.getElementById('review-section');
    reviewSection.innerHTML = '';

    userAnswers.forEach(function (answer, index) {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('review-question');

        if (answer.userSelectedIndex === answer.correctOptionIndex) {
            questionDiv.classList.add('correct');
        } else {
            questionDiv.classList.add('incorrect');
        }

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `Question ${index + 1}: ${answer.question}`;
        questionDiv.appendChild(questionTitle);

        const userAnswerP = document.createElement('p');
        userAnswerP.innerHTML = `Your answer: <span class="user-answer">${answer.options[answer.userSelectedIndex]}</span>`;
        questionDiv.appendChild(userAnswerP);

        if (answer.userSelectedIndex !== answer.correctOptionIndex) {
            const correctAnswerP = document.createElement('p');
            correctAnswerP.innerHTML = `Correct answer: <span class="correct-answer">${answer.options[answer.correctOptionIndex]}</span>`;
            questionDiv.appendChild(correctAnswerP);
        }

        reviewSection.appendChild(questionDiv);
    });
}

retryButton.addEventListener('click', function () {
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    userAnswers = [];
    shuffleArray(quizData);
    resultSection.style.display = 'none';
    quizSection.style.display = 'block';
    showQuestion();
});

newQuizButton.addEventListener('click', function () {
    // Clear quiz data
    quizData = [];
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    totalQuestions = 0;
    userAnswers = [];

    // Reset UI elements
    resultSection.style.display = 'none';
    instructionSection.style.display = 'block';
    document.querySelector('.page-title').classList.remove('hidden');
    quizQuestionDiv.classList.remove('large');
    quizCodeTextarea.value = '';
    pageTitle.style.display = 'block';
});

/* Help Modal Functionality */
helpButton.addEventListener('click', function () {
    showModal();
});

function showModal() {
    const helpModal = document.getElementById('help-modal');
    helpModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    const helpModal = document.getElementById('help-modal');
    helpModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

const modalCloseButton = document.getElementById('modal-close-button');
modalCloseButton.addEventListener('click', function () {
    closeModal();
});

const modalOverlay = document.querySelector('#help-modal .modal-overlay');
modalOverlay.addEventListener('click', function () {
    closeModal();
});

// Close modal with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const helpModal = document.getElementById('help-modal');
        if (helpModal.style.display === 'block') {
            closeModal();
        }
    }
});

/* Copy Instructions Functionality */
document.addEventListener('DOMContentLoaded', function() {
    const copyInstructionsButton = document.getElementById('copy-instructions-button');
    const modalCopyText = document.getElementById('modal-copy-text');

    copyInstructionsButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(modalCopyText.value.trim());
            // Visual feedback for successful copy
            modalCopyText.style.backgroundColor = '#f0f9ff';
            setTimeout(() => {
                modalCopyText.style.backgroundColor = ''; // Reset the background color after a short delay
            }, 300);
        } catch (err) {
            // No failure handling needed
        }
    });

    const pasteButton = document.getElementById('paste-button');
    const quizCodeTextarea = document.getElementById('quiz-code');

    pasteButton.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            quizCodeTextarea.value = text;
            quizCodeTextarea.style.backgroundColor = '#f0f9ff';
            setTimeout(() => {
                quizCodeTextarea.style.backgroundColor = ''; // Reset after visual feedback
            }, 300);
        } catch (err) {
            // Since failures are not to be handled, no error catching block here.
        }
    });
});

/* Notification Functionality */
let notificationTimeout;

function showError(message) {
    notification.classList.remove('closing');
    notificationMessage.textContent = message;
    notification.style.display = 'flex';
    
    // Clear any existing timeout
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    
    // Set new timeout for 5 seconds
    notificationTimeout = setTimeout(function() {
        closeNotification();
    }, 5000);
}

function closeNotification() {
    notification.classList.add('closing');
    // Wait for animation to complete before hiding
    setTimeout(() => {
        notification.style.display = 'none';
        notification.classList.remove('closing');
    }, 300); // Match animation duration (0.3s = 300ms)
}

notificationCloseButton.addEventListener('click', function () {
    clearTimeout(notificationTimeout);
    closeNotification();
});

/* Utility Functions */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(function () {
        element.classList.remove('shake');
    }, 500);
}
document.querySelector('.done-button').addEventListener('click', function() {
    closeModal();
});


// Smooth scrolling implementation
let currentPosition = window.pageYOffset;
let targetPosition = window.pageYOffset;
let scrolling = false;

function smoothScroll() {
    if (!scrolling) return;

    currentPosition += (targetPosition - currentPosition) * 0.1;

    if (Math.abs(targetPosition - currentPosition) < 1) {
        currentPosition = targetPosition;
        scrolling = false;
    }

    window.scrollTo(0, currentPosition);
    requestAnimationFrame(smoothScroll);
}

document.addEventListener('wheel', function(e) {
    e.preventDefault();
    
    // Adjust this value to control scroll speed (lower = slower)
    const scrollFactor = 0.5;
    
    targetPosition += e.deltaY * scrollFactor;
    targetPosition = Math.max(0, Math.min(targetPosition, document.documentElement.scrollHeight - window.innerHeight));
    
    if (!scrolling) {
        scrolling = true;
        requestAnimationFrame(smoothScroll);
    }
}, { passive: false });

// Ensure smooth scrolling works with other scroll events (e.g., clicking on links)
document.addEventListener('click', function(e) {
    const target = e.target.closest('a[href^="#"]');
    if (target) {
        e.preventDefault();
        const targetId = target.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetPosition = targetElement.offsetTop;
            if (!scrolling) {
                scrolling = true;
                requestAnimationFrame(smoothScroll);
            }
        }
    }
});