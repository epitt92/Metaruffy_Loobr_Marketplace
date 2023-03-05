import React from 'react'
import TrendingCard from '../../components/TrendingCard/TrendingCard'
import TopUsers from '../HomeModule/components/TopUsers'


export const ExploreModule = () => {
  return (
    <>
    <div className="pt-28">
      <TopUsers/>
    </div>
      <div className='container'>
        <h2 className='text-white mb-10 text-5xl font-bold'> Explore</h2>          
          <div>
            <div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-x-8 gap-y-5 pt-8 pb-[8.125rem]'>
              <TrendingCard/>
            </div>
          </div>
          
      </div>
    </>
  )
}

