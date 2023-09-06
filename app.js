window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

const body = document.body,
  reveals = document.querySelectorAll(".elem");
stopSection = document.querySelector(".section");
container = document.getElementById("container");
wrapper = document.querySelector(".wrapper");
windowHeight = window.innerHeight;
(height = container.offsetHeight + windowHeight), (speed = 0.05);
let raf;
let _scrollPercent = 0;
let progress = 0;
let scrollPercent = 0.0;
let currentElementIndex = 0;
let totalscroll = 0.0;
let offset = 0;
let isProgress = false;
let stopScroll = false;
let animationStarted = false;

body.style.height = height + "px";

function smoothScroll() {
  offset += (window.pageYOffset - offset) * speed;
  var scroll = "translateY(-" + offset + "px)";
  wrapper.style.transform = scroll;
  raf = requestAnimationFrame(smoothScroll);
}
smoothScroll();

function updateElements() {
  if (isProgress) {
    renderTransform(currentElementIndex);
  } else {
    for (let i = 0; i < reveals.length; i++) {
      renderTransform(i);
    }
  }
}

function renderTransform(index) {
  reveals[index].style.transform = `translateY(${
    (1 - _scrollPercent) * (index * 0.2 * window.innerHeight)
  }px) rotate(${90 * progress}deg)`;
}

function checkScrollPosition() {
  const containerPosition = stopSection.getBoundingClientRect();
  if (containerPosition.top <= windowHeight) {
    setScrollPercent();
  }
  if (stopScroll && containerPosition.top >= windowHeight / 2) {
    setScrollPercent();
  }
  startAnimation();
}

function setScrollPercent() {
  scrollOffset = window.pageYOffset;
  _scrollPercent = scrollOffset / (windowHeight / 2) || 0;
}

function startAnimation() {
  if (!stopScroll && window.scrollY >= container.offsetTop - windowHeight / 2) {
    _scrollPercent = 1;
    animationStarted = true;
  }
  if (stopScroll && window.scrollY <= container.offsetTop - windowHeight / 2) {
    animationStarted = true;
  }
}

function rotateElementsRight(event) {
  let speed = (event.deltaY / 360) * 20;
  scrollPercent += speed;
  totalscroll += speed;
  progress = scrollPercent / 90;
  isProgress = true;
  if (progress >= 0.9) {
    progress = 1;
  }
  if (scrollPercent > 90 && currentElementIndex < reveals.length - 1) {
    currentElementIndex = (currentElementIndex + 1) % reveals.length;
    scrollPercent = 0;
  }
}

function rotateElementsLeft(event) {
  let speed = (event.deltaY / 360) * 20;
  scrollPercent += speed;
  totalscroll += speed;
  progress = scrollPercent / 90;
  isProgress = true;
  if (progress <= 0.1) {
    progress = 0;
  }
  if (scrollPercent < 0 && currentElementIndex > 0) {
    currentElementIndex = (currentElementIndex - 1) % reveals.length;
    scrollPercent = 90;
  }
}

body.addEventListener(
  "mousewheel",
  (event) => {
    if (event.deltaY > 0 && totalscroll >= 275) {
      animationStarted = false;
    }
    if (event.deltaY < 0 && totalscroll < -0.1) {
      event.preventDefault();
      animationStarted = false;
      isProgress = false;
      progress = 0;
    }
    event.preventDefault();
  },
  { passive: false }
);

function scrollPage(event) {
  const scrollValue = event.deltaY || event.wheelDelta;
  window.scrollBy(0, scrollValue, "smooth");
  if (animationStarted && scrollValue > 0) {
    window.scrollTo(0, windowHeight / 2, "smooth");
    rotateElementsRight(event);
  }
  if (animationStarted && scrollValue < 0) {
    window.scrollTo(0, windowHeight / 2, "smooth");
    rotateElementsLeft(event);
  }
  event.preventDefault();
}

function loop() {
  checkScrollPosition();
  updateElements();
  requestAnimationFrame(loop);
}

loop();

var previousScrollPosition =
  window.pageYOffset || document.documentElement.scrollTop;

body.addEventListener("scroll", function () {
  let currentScrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;
  if (currentScrollPosition > previousScrollPosition) {
    stopScroll = false;
  } else if (currentScrollPosition < previousScrollPosition) {
    stopScroll = true;
  }
  previousScrollPosition = currentScrollPosition;
});

body.addEventListener("mousewheel", scrollPage, { passive: false });
