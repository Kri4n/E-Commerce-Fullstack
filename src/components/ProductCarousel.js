import Carousel from 'react-bootstrap/Carousel';
import FirstImage from '../images/bag.jpg';
import SecondImage from "../images/tshirt.jpg";
import ThirdImage from "../images/watch.jpg";

function ProductCarousel() {
    return (
    <div className='p-3'>
      <h1 className='fw-bold'>New Releases</h1>
      <Carousel>
        <Carousel.Item>
          <img
            className="carousel-image img-fluid"
            src={FirstImage}
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>Lorem</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="carousel-image img-fluid"
            src={SecondImage}
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Lorem</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="carousel-image img-fluid"
            src={ThirdImage}
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Lorem</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      </div>
    );
}

export default ProductCarousel;
