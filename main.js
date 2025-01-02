let i = 0
let hello = document.getElementById('hello')
setInterval(() => {
    if (i < 5) {
        i++
    } else {
        i = 0
    }

    // Random color generator function
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Switch statement implementation
    switch (i) {
        case 0:
            hello.style.fontFamily = `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`;
            break;
        case 1:
            hello.style.fontFamily = `Georgia, 'Times New Roman', Times, serif`;
            hello.style.color = getRandomColor(); 
            break;
        case 2:
            hello.style.fontFamily = `unset`;
            hello.style.color = getRandomColor(); 
            break;
        case 3:
            hello.style.fontFamily = `cursive`;
            hello.style.color = getRandomColor(); 
            break;
        case 4:
            hello.style.fontFamily = `monospace`;
            hello.style.color = getRandomColor(); 
            break;
        case 5:
            hello.style.fontFamily = `'Courier New', Courier`;
            hello.style.color = getRandomColor(); 
            break;
        default:
            break;
    }

}, 500);

let appear = document.querySelectorAll('appear')

//chatgpt

document.addEventListener("DOMContentLoaded", () => {
    const appearElements = document.querySelectorAll(".appear");

    const observerOptions = {
        threshold: 0.2, // Trigger when 20% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Add the 'active' class when the element is visible
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    appearElements.forEach((el) => {
        observer.observe(el);
    });
});
