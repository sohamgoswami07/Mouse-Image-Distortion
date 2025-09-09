import images from "../constants/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const titles = document.querySelectorAll('.title');
  const hoverImage = document.querySelector('.hover-image');

  let targetX = 0, targetY = 0;   // target cursor pos
  let currentX = 0, currentY = 0; // actual image pos
  let velocityX = 0, velocityY = 0; // for spring/cloth effect
  let isMoving = false;

  // Ensure transform origin is center (blob-like effect)
  hoverImage.style.transformOrigin = "center center";
  hoverImage.style.transition = "opacity 0.5s ease"; // fade animation
  hoverImage.style.opacity = "0"; // start hidden

  // Track cursor position globally
  document.addEventListener('mousemove', (e) => {
    const imgWidth = hoverImage.offsetWidth || 0;
    const imgHeight = hoverImage.offsetHeight || 0;

    targetX = e.pageX - imgWidth / 2;
    targetY = e.pageY - imgHeight / 2;

    // Ensure it is visible while inside
    hoverImage.style.opacity = "1";
  });

  // Fade away when leaving window
  document.addEventListener("mouseleave", () => {
    hoverImage.style.opacity = "0";
  });

  // Fade back when entering window
  document.addEventListener("mouseenter", () => {
    hoverImage.style.opacity = "1";
  });

  function animate() {
    // Calculate difference
    let dx = targetX - currentX;
    let dy = targetY - currentY;
  
    // Spring physics (adds elasticity like cloth)
    velocityX += dx * 0.1; 
    velocityY += dy * 0.1;
  
    // Damping so it eases back smoothly
    velocityX *= 0.5; 
    velocityY *= 0.5;
  
    // Update position
    currentX += velocityX;
    currentY += velocityY;
  
    hoverImage.style.left = currentX + 'px';
    hoverImage.style.top = currentY + 'px';
  
    // Blob-like stress: smooth skew + scale from center
    let skewX = velocityX * 0.3;
    let skewY = velocityY * 0.3;
    let scaleX = 1 + Math.abs(velocityX) * 0.003; 
    let scaleY = 1 + Math.abs(velocityY) * 0.003;
  
    hoverImage.style.transform = `
      translate(0, 0) 
      skew(${skewX}deg, ${skewY}deg) 
      scale(${scaleX}, ${scaleY})
    `;
  
    // --- NEW: Check intersection with titles ---
    const imgRect = hoverImage.getBoundingClientRect();
  
    titles.forEach((title) => {
      const titleRect = title.getBoundingClientRect();
      const isIntersecting = !(
        imgRect.right < titleRect.left ||
        imgRect.left > titleRect.right ||
        imgRect.bottom < titleRect.top ||
        imgRect.top > titleRect.bottom
      );
  
      if (isIntersecting) title.style.color = "#ff3b3b"; // blended color when intersect
    });
  
    requestAnimationFrame(animate);
  }  

  if (!isMoving) {
    isMoving = true;
    requestAnimationFrame(animate);
  }

  // Hover logic
  titles.forEach((title, index) => {
    title.addEventListener('mouseenter', () => {
      hoverImage.src = images[index].img;
      hoverImage.style.display = 'block';
      hoverImage.style.opacity = "1";
    });

    title.addEventListener('mouseleave', () => {
      hoverImage.style.opacity = "0";
    });
  });
});
