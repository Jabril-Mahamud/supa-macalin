import { AudioConverter } from '@/components/AudioConverter'
import React from 'react'

const page = () => {
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Some random title</h1>
      
      <AudioConverter />
    </div>
  )
}

export default page


