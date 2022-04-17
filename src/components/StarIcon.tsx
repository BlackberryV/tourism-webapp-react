import React from "react"

interface StarIconProps {
    filled: boolean
}

const StarIcon: React.FC<StarIconProps> = ({ filled }) => {
    const classname = filled ? "ri-star-fill yellow" : "ri-star-fill gray"
    return (
        <i className={classname}></i>
    )
}

export default StarIcon