function createParticles() {
    const particlesContainer = document.querySelector('.particles') || document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;

        // Generate random movement values
        const moveX1 = Math.random() * 100 - 50; // Random value between -50 and 50
        const moveY1 = Math.random() * 100 - 50;
        const moveX2 = Math.random() * 100 - 50;
        const moveY2 = Math.random() * 100 - 50;
        const moveX3 = Math.random() * 100 - 50;
        const moveY3 = Math.random() * 100 - 50;

        particle.style.setProperty('--moveX1', `${moveX1}px`);
        particle.style.setProperty('--moveY1', `${moveY1}px`);
        particle.style.setProperty('--moveX2', `${moveX2}px`);
        particle.style.setProperty('--moveY2', `${moveY2}px`);
        particle.style.setProperty('--moveX3', `${moveX3}px`);
        particle.style.setProperty('--moveY3', `${moveY3}px`);

        particle.style.animation = `moveParticle ${Math.random() * 10 + 10}s linear infinite`;

        particlesContainer.appendChild(particle);
    }
}

document.addEventListener('DOMContentLoaded', createParticles);

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function notify() {
    const emailInput = document.getElementById('email');
    const button = document.querySelector('.notify-button');
    const buttonText = document.getElementById('buttonText');
    const loadingWheel = document.querySelector('.loading-wheel');
    const email = emailInput.value.trim();

    if (isValidEmail(email)) {
        buttonText.style.display = 'none'; // Hide the button text
        loadingWheel.style.display = 'inline-block'; // Show the loading wheel

        // Simulate loading process
        setTimeout(() => {
            buttonText.style.display = 'block'; // Show the button text
            loadingWheel.style.display = 'none'; // Hide the loading wheel
            showNotification(); // Function to show the notification after successful operation
        }, 2000); // Simulate loading time
    } else {
        shakeElement(document.querySelector('.email-container'));
                            
    }
}



function showNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'flex'; // Make sure it's visible
    setTimeout(() => {
        notification.style.top = '40px';
    }, 10); // Small delay to ensure the display change has taken effect
    setTimeout(() => {
        notification.style.top = '-100px';
    }, 3000);
}

function closeNotification() {
    const notification = document.getElementById('notification');
    notification.style.top = '-100px';
}

function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}


function hideNotification() {
    const notification = document.getElementById('notification');
    notification.style.top = '-100px';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 300); // Wait for the transition to complete
}

function closeNotification() {
    hideNotification();
}
// Keep your existing createParticles function


document.addEventListener('DOMContentLoaded', function() {
    const backgroundVideo = document.querySelector('.background-video');
    const particlesContainer = document.querySelector('.particles');
    
    if (backgroundVideo) {
        // Hide video initially
        backgroundVideo.style.opacity = '0';
        
        // Essential settings for iOS
        backgroundVideo.playsInline = true;
        backgroundVideo.muted = true;
        backgroundVideo.autoplay = true;
        backgroundVideo.setAttribute('playsinline', '');
        backgroundVideo.setAttribute('webkit-playsinline', '');
        backgroundVideo.setAttribute('muted', '');
        backgroundVideo.load();
    }
    
    if (particlesContainer) {
        particlesContainer.style.opacity = '0';
    }

    // Function to handle video playback
    const startVideoFade = async () => {
        if (backgroundVideo) {
            try {
                backgroundVideo.style.transition = 'opacity 2s ease-in-out';
                
                const isMobileIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                if (isMobileIOS) {
                    // Ensure proper positioning on iOS
                    backgroundVideo.style.webkitTransform = 'translateX(-50%) translateY(60vh)';
                    backgroundVideo.style.transform = 'translateX(-50%) translateY(60vh)';
                    
                    // Start playback
                    backgroundVideo.currentTime = 0;
                    const playPromise = backgroundVideo.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            backgroundVideo.style.opacity = '1';
                        }).catch(error => {
                            console.log('Playback failed:', error);
                            // Fallback for user interaction
                            document.addEventListener('touchstart', () => {
                                backgroundVideo.play();
                                backgroundVideo.style.opacity = '1';
                            }, { once: true });
                        });
                    }
                } else {
                    backgroundVideo.style.opacity = '1';
                    await backgroundVideo.play();
                }
            } catch (error) {
                console.log('Video error:', error);
            }
        }
    };

    // Animate elements with delay
    setTimeout(function() {
        const elements = document.querySelectorAll('.animate-element');
        const animationDelay = 200;

        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('show');
            }, index * animationDelay);
        });

        // Create and animate particles
        setTimeout(() => {
            createParticles();
            if (particlesContainer) {
                particlesContainer.style.transition = 'opacity 1s ease-in-out';
                particlesContainer.style.opacity = '1';
            }
            
            // Start video fade
            setTimeout(startVideoFade, 500);
        }, (elements.length * animationDelay) + 200);
    }, 100);
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