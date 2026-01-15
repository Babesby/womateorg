

const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const closeBtn = document.querySelector('.nav-close');

toggle.onclick = () => navLinks.classList.toggle('open');
closeBtn.onclick = () => navLinks.classList.remove('open');

document.querySelectorAll('.nav-links a').forEach(a =>
    a.onclick = () => navLinks.classList.remove('open')
);





/* PARTICLES */
const canvas = document.getElementById('pleroma-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function init() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    particles = Array.from({length:80},()=>({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        r:Math.random()*2,
        a:Math.random()*Math.PI*2,
        s:.2+Math.random()*.3
    }));
}
function animate() {
    ctx.fillStyle='rgba(5,6,8,.08)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
        p.x+=Math.cos(p.a)*p.s;
        p.y+=Math.sin(p.a)*p.s;
        if(p.x<0)p.x=canvas.width;
        if(p.y<0)p.y=canvas.height;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba(126,177,72,0.5)';
        ctx.fill();
    });
    requestAnimationFrame(animate);
}
addEventListener('resize',init);
init(); animate();






function toggleForm() {
    const formOverlay = document.getElementById('form-overlay');
    // Toggle between none and flex
    if (formOverlay.style.display === 'none' || formOverlay.style.display === '') {
        formOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    } else {
        formOverlay.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
}





function handleShare() {
    const shareData = {
        title: 'WOMATE | She Leads Climate Mentorship Programme',
        text: 'Join the 2026 WOMATE Cohort. She Leads equips young women with climate knowledge to actively engage in climate advocacy & action',
        url: 'https://womate.org/She-leads.html'
    };

    // Check if the device supports native mobile sharing (iOS/Android)
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
    } else {
        // Desktop Fallback: Toggle the custom menu
        const menu = document.getElementById('desktop-share-menu');
        menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
    }
}

function copyLink() {
    navigator.clipboard.writeText("https://womate.org/She-leads.html");
    alert("Link copied to clipboard! Share it on your Instagram Bio or Story.");
}

// Close menu if clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.btn-primary')) {
        const menu = document.getElementById('desktop-share-menu');
        if (menu && menu.style.display === 'flex') menu.style.display = 'none';
    }
}








const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-track img');
let index = 0;

setInterval(() => {
    index = (index + 1) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
}, 4000);



// Hover-driven parallax for the sphere content
const sphere = document.querySelector('.insight-gate');
const content = document.querySelector('.sphere-content');

sphere.addEventListener('mousemove', (e) => {
    let x = (window.innerWidth / 2 - e.pageX) / 40;
    let y = (window.innerHeight / 2 - e.pageY) / 40;
    content.style.transform = `translateX(${x}px) translateY(${y}px)`;
});

setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}, 4000);








function toggleShopModal() {
    const shopModal = document.getElementById('shop-modal');
    // Toggle between none and flex
    if (shopModal.style.display === 'none' || shopModal.style.display === '') {
        shopModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    } else {
        shopModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
}






document.querySelector('.gnosis-extra-syne').addEventListener('mousemove', (e) => {
    const { offsetX, offsetY, target } = e;
    const { clientWidth, clientHeight } = target;
    const xPos = (offsetX / clientWidth) - 0.5;
    const yPos = (offsetY / clientHeight) - 0.5;
    
    // Subtly shift the glow based on mouse position
    target.style.textShadow = `${xPos * 20}px ${yPos * 20}px 40px rgba(126, 177, 72, 0.4)`;
});
