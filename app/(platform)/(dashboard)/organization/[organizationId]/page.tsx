import { OrganizationSwitcher, auth } from '@clerk/nextjs'

const OrganizationIdPage = async ({
  params,
}: {
  params: {
    organizationId: string
  }
}) => {
  const { userId, orgId } = auth()

  if (orgId !== params.organizationId) return <div>Not Found</div>

  return <div className='w-full mb-20'>OrganizationIdPage: {orgId}</div>
}

export default OrganizationIdPage
