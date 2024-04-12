import { notFound, redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'

import { BoardNavbar } from './_components/board-navbar'
import { db } from '@/lib/db'

export async function generateMetadata({ params }: { params: { boardId: string } }) {
  const { orgId } = auth()

  if (!orgId) return { title: 'Board' }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  })

  return {
    title: board?.title || 'Board',
  }
}

const BoardIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { boardId: string }
}) => {
  const { orgId } = auth()

  if (!orgId) redirect('/select-org')

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  })

  if (!board) notFound()

  return (
    <div
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
      className='relative h-full bg-no-repeat bg-cover bg-center'
    >
      <div className='pt-12 md:pt-16 px-4 max-w-6xl 2xl:max-w-[1400px] mx-auto'>
        <BoardNavbar data={board} />
        <div aria-hidden className='absolute inset-0 bg-black/10' />
        <main className='relative pt-8 h-full'>{children}</main>
      </div>
    </div>
  )
}

export default BoardIdLayout
