import { capitalize } from '@/utils/utils'
import { usePathname } from 'next/navigation'

const usePageTitle = () => {
  const route = usePathname()


  const dynamicPathRegex = new RegExp(
    // eslint-disable-next-line no-useless-escape
    '\\/\\[(.*)\\]'
  )

  let pageName = route.slice(1)
  pageName = pageName.replace(dynamicPathRegex, '')
  pageName = pageName
    .split('/')
    .map((pageRoute) => capitalize(pageRoute))
    .join(' | ')
    .split('-')
    .map((pageRoute) => capitalize(pageRoute))
    .join(' ')
    const getTitle = () =>  pageName

  return getTitle() + ' | Upspot Academy'
}

export default usePageTitle
