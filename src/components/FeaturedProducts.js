import { useState, useEffect } from 'react';
import { CardGroup } from 'react-bootstrap';
import PreviewProducts from './PreviewProducts';

export default function FeaturedProducts(){

    const [previews, setPreviews] = useState([])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`)
        .then(res => res.json())
        .then(data => {
            const numbers = []
            const featured = []

            const generateRandomNums = () => {
                let randomNum = Math.floor(Math.random() * data.length)

                if(numbers.indexOf(randomNum) === -1){
                    numbers.push(randomNum)
                } else {
                    generateRandomNums()
                }
            }

            for(let i = 0; i < 6; i++){
                generateRandomNums();

                featured.push(
                    <PreviewProducts data={data[numbers[i]]} key={data[numbers[i]]._id} breakPoint={2}/>
                )
            }
            setPreviews(featured);
        })
    }, [])

    return(
        <>  
        <div className='bg-light rounded mt-3 p-5 border shadow'>
            <h4 className='text-center'>Featured Products</h4>
            <CardGroup className='justify-content-center gap-1 mt-4'>
                {previews}
            </CardGroup>
        </div>
        </>
    )
}