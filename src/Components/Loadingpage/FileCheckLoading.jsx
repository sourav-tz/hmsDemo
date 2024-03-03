import React from 'react'
import { Player } from '@lottiefiles/react-lottie-player'
import checkFile from '../../Assets/checkfile.json';
const FileCheckLoading = () => {
  return (
    <div className='w-[200px]'>
        <Player 
            src={checkFile}
            autoplay
            loop
        />
    </div>
  )
}

export default FileCheckLoading