import React from 'react'
import Image from 'next/image'

const Notfound = () => {
  return (
    <div className='flex justify-center items-center  min-h-[60vh] w-full'>
      <div>
      <figure>
      <Image src="/assets/images/datanot.png" height={287} width={438} alt=""/>
      </figure>
      <h2 className='text-white text-center mt-12'>No Data Found</h2>
      </div>
      </div>
  )
}

export default Notfound