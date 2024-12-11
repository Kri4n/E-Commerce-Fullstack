import { Badge, Box, Card, HStack, Image } from "@chakra-ui/react";
import { NavLink } from 'react-router-dom';


export default function PreviewProducts(props){
    const { data } = props;
    
    const { _id, name, price } = data;

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
      };
    
    return(
        <Card.Root className='cardroot' flexDirection="row" overflow="hidden" maxW="xl">
        <Image
        objectFit="cover"
        maxW="120px"
        src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
        alt="Caffe Latte"
        />
        <Box>
        <Card.Body>
        <Card.Title mb="2">{truncateText(name, 20)}</Card.Title>
        <HStack mt="4">
        <Badge className='lead'>PHP {price}</Badge>
        </HStack>
        </Card.Body>
        <Card.Footer>
        <NavLink to={`/shop/${_id}`} className='text-decoration-none text-dark btn btn-light'>More Details</NavLink>
        </Card.Footer>
        </Box>
        </Card.Root>
    )
}