const gliders = document.querySelectorAll('.glider');

new Glider(gliders[0], {
  slidesToShow: 1,
  itemWidth: 200,
  dots: gliders[0].parentElement.querySelector('.dots'),
  draggable: true,
  arrows: {
    prev: '.glider-prev',
    next: '.glider-next'
  }
});
