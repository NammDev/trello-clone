import type { PropsWithChildren } from 'react'
import { Navbar } from './_components/navbar'

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='relative flex min-h-screen flex-col'>
      <Navbar />
      {children}
    </div>
  )
}

export default DashboardLayout
