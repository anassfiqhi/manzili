import { Text } from "@medusajs/ui"

import ExternalLink from "../../../common/components/external-link"

const ManziliCTA = () => {
  return (
    <Text className="flex gap-x-2 txt-compact-small-plus items-center">
      Powered by
      <ExternalLink className="text-blue-600 hover:text-blue-800 transition-colors" href="https://anassfiqhi.dev">
        anassfiqhi.dev
      </ExternalLink>
      {/* &
      <a href="https://nextjs.org" target="_blank" rel="noreferrer">
        <NextJs fill="#9ca3af" />
      </a> */}
    </Text>
  )
}

export default ManziliCTA
