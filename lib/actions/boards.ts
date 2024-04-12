import { Board } from '@prisma/client'
import { db } from '../db'
import { z } from 'zod'
import { auth } from '@clerk/nextjs'
import { hasAvailableCount, increaseAvailableCount } from './org-limit'
import { revalidatePath } from 'next/cache'
import { checkSubscription } from '../subscription'

const CreateBoard = z.object({
  title: z
    .string({
      required_error: 'Title is required.',
      invalid_type_error: 'Title is required.',
    })
    .min(3, {
      message: 'Title is too short.',
    }),
  image: z.string({
    required_error: 'Image is required.',
    invalid_type_error: 'Image is required.',
  }),
})

type CreateBoardType = z.infer<typeof CreateBoard>

export async function createBoard(
  data: CreateBoardType
): Promise<{ data?: Board; error?: string }> {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    }
  }

  const canCreate = await hasAvailableCount()
  const isPro = await checkSubscription()

  if (!canCreate && !isPro) {
    return {
      error: 'You have reached your limit of free boards. Please upgrade to create more.',
    }
  }

  const { title, image } = data

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHtml, imageUserName] = image.split('|')

  if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHtml || !imageUserName) {
    return {
      error: 'Missing fields. Failed to create board.',
    }
  }

  let board

  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHtml,
      },
    })

    // increase board count/decrase remaining board
    if (!isPro) await increaseAvailableCount()

    // create new activity log
    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    })
  } catch (error) {
    return {
      error: 'Failed to create',
    }
  }

  revalidatePath(`/board/${board.id}`)
  return { data: board }
}

export async function getBoardsByOrgId(orgId: string) {
  const boards = await db.board.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return boards
}
