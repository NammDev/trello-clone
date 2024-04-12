import { OrganizationSwitcher, auth } from '@clerk/nextjs'

const OrganizationIdPage = async () => {
  const { userId, orgId } = auth()

  if (!orgId) return false

  return <div className='w-full mb-20'>OrganizationIdPage: {orgId}</div>
}

export default OrganizationIdPage
