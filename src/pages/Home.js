import { Container } from 'react-bootstrap';
import ProductCarousel from '../components/ProductCarousel';
import Highlights from '../components/Highlights';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home(){

    return(
        <>  
            <Container>
                <FeaturedProducts/>
                <Highlights />
                <ProductCarousel/>
            </Container>
        </>
    );
}