import { OrganizationSwitcher, auth } from '@clerk/nextjs'

const OrganizationIdPage = async () => {
  const { userId, orgId } = auth()

  if (!orgId) return false

  return (
    <div className='w-full mb-20'>
      <OrganizationSwitcher hidePersonal />
    </div>
  )
}

export default OrganizationIdPage
