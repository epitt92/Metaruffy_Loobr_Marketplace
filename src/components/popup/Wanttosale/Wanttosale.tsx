import React,{useState} from 'react'
import Button from '../../Button/Button'
import Saletab from './Saletab'
import Popups from '../poups'

const Wanttosale = () => {
  const [popup, setPopup] = useState(false);
  const [state, setState] = useState(-1);
  return (
    <>
    <div className='pt-6 pb-8 text-center'>
    <h6 className='sm:w-[450px] xs:w-full text-white'>Want to Sale?</h6>
    <Saletab/>
    <Button className='!px-12 rounded-[6.25rem]  font-Proxima-Bold mt-6'  onClick={() => {
                        setPopup(true);
                        setState(25);
                      }}>Sale Now</Button>
    </div>
    {state && (
        <Popups
          show={popup}
          hide={setPopup}
          state={state}
          setstate={setState}
          data=""
        />
      )}
    </>
  )
}

export default Wanttosale