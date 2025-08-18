import { Text } from "@medusajs/ui"

import Medusa from "../../../common/icons/medusa"
import NextJs from "../../../common/icons/nextjs"
import { ArrowUpRightMini } from "@medusajs/icons"

const ManziliCTA = () => {
  return (
    <Text className="flex gap-x-2 txt-compact-small-plus items-center">
      Powered by
      <a href="https://anassfiqhi.dev" target="_blank" rel="noreferrer" className="flex justify-center items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors">
        anassfiqhi.dev <ArrowUpRightMini className="w-4 h-4" />
      </a>
      {/* &
      <a href="https://nextjs.org" target="_blank" rel="noreferrer">
        <NextJs fill="#9ca3af" />
      </a> */}
    </Text>
  )
}

export default ManziliCTA
