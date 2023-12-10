import { useState, useEffect } from 'react'
import { LocalizedList } from './types'

/**
 * Hook to automatically inject localized lists according to user's browser locale.
 *
 * Read the documentation at: https://github.com/smastrom/react-email-autocomplete.
 */
export function useLocalizedList(lists: LocalizedList, appLocale?: string) {
   const userLocale = appLocale || navigator?.language
   const [list, setList] = useState(lists.default)

   useEffect(() => {
      const exactLocaleList = lists[userLocale]
      if (exactLocaleList) return setList(exactLocaleList)

      const langCode = userLocale.split(/[-_]/)[0]
      const langCodeList = lists[langCode]
      if (langCodeList) return setList(langCodeList)
   }, [userLocale, lists])

   return list
}
