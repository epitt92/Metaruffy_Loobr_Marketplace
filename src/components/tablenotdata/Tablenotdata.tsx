import React from 'react'
import Image from 'next/image'
import Loader from '../loader/Loader'

const Tablenotdata = ( { width, height,colSpan }: any) => {
  return (
    <tr className=' text-xl font-Proxima-SemiBold  text-themecolor  '>
    <td className='!text-center p-12 mt-12 font-Proxima-SemiBold text-xl' colSpan={6}>No Data</td>
   </tr>
  
  )
}

export default Tablenotdata