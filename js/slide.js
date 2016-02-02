
var Carousel = require('./node_modules/react-bootstrap').Carousel;
var CarouselItem = require('./node_modules/react-bootstrap').CarouselItem;
const carouselInstance = (
  React.createElement(Carousel, null, 
    React.createElement(CarouselItem, null, 
      React.createElement("img", {width: 900, height: 500, alt: "900x500", src: "./assets/img/carousel.png"}), 
      React.createElement("div", {className: "carousel-caption"}, 
        React.createElement("h3", null, "First slide label"), 
        React.createElement("p", null, "Nulla vitae elit libero, a pharetra augue mollis interdum.")
      )
    ), 
    React.createElement(CarouselItem, null, 
      React.createElement("img", {width: 900, height: 500, alt: "900x500", src: "./assets/img/carousel.png"}), 
      React.createElement("div", {className: "carousel-caption"}, 
        React.createElement("h3", null, "Second slide label"), 
        React.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
      )
    ), 
    React.createElement(CarouselItem, null, 
      React.createElement("img", {width: 900, height: 500, alt: "900x500", src: "./assets/img/carousel.png"}), 
      React.createElement("div", {className: "carousel-caption"}, 
        React.createElement("h3", null, "Third slide label"), 
        React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur.")
      )
    )
  )
);

var mountNode = document.getElementById('slide area');
ReactDOM.render(carouselInstance, mountNode);