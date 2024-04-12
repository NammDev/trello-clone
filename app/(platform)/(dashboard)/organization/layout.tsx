import type { PropsWithChildren } from 'react'

import { Sidebar } from '../_components/sidebar'

const OrganizationLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className='flex-1'>
      <div className='pt-12 md:pt-16 px-4 max-w-6xl 2xl:max-w-[1400px] mx-auto'>
        <div className='flex gap-x-7'>
          <div className='w-64 shrink-0 hidden md:block'>
            <Sidebar />
          </div>
          {children}
        </div>
      </div>
    </main>
  )
}

export default OrganizationLayout
