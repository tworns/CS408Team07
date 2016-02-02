{/*Slide code boyz!*/}

var Carousel = require('./node_modules/react-bootstrap').Carousel;
var CarouselItem = require('./node_modules/react-bootstrap').CarouselItem;
const carouselInstance = (
  <Carousel>
    <CarouselItem>
      <img width={900} height={500} alt="900x500" src="./assets/img/carousel.png"/>
      <div className="carousel-caption">
        <h3>First slide label</h3>
        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
      </div>
    </CarouselItem>
    <CarouselItem>
      <img width={900} height={500} alt="900x500" src="./assets/img/carousel.png"/>
      <div className="carousel-caption">
        <h3>Second slide label</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </CarouselItem>
    <CarouselItem>
      <img width={900} height={500} alt="900x500" src="./assets/img/carousel.png"/>
      <div className="carousel-caption">
        <h3>Third slide label</h3>
        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
      </div>
    </CarouselItem>
  </Carousel>
);

var mountNode = document.getElementById('slide area');
ReactDOM.render(carouselInstance, mountNode);
