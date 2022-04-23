import React, {FC} from 'react';
import {Carousel} from "react-responsive-carousel";

interface ISliderProps {
    images: string[];
}

const Slider: FC<ISliderProps> = ({images}) => {
    return (
        <div>
            <Carousel className="slider" infiniteLoop={true}>
                {images.map(img => (
                    <img className='slider-image' key={Date.now()} src={img} alt=''/>
                ))
                }
            </Carousel>
        </div>
    );
};

export default Slider;