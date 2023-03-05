import React from 'react'
import Image from 'next/image'

const NoComment = () => {
    return (
        <div className='flex justify-center items-center   min-h-[30vh] pt-12'>
            <div>
                <figure>
                    <Image src="/assets/images/nocomment.png" height={130} width={130} alt="" />
                </figure>
                <p className='text-white text-center mt-12 h-4	'>Be the first to comment</p>
            </div>
        </div>
    )
}

export default NoComment