import { Text } from "@medusajs/ui"

// import Medusa from "../../../common/icons/medusa"
// import NextJs from "../../../common/icons/nextjs"
import InteractiveLink from "../../../common/components/interactive-link"

const ManziliCTA = () => {
  return (
    <Text className="flex gap-x-2 txt-compact-small-plus items-center">
      Powered by
      <InteractiveLink className="text-blue-600 hover:text-blue-800 transition-colors" href="https://anassfiqhi.dev">
        anassfiqhi.dev
      </InteractiveLink>
      {/* &
      <a href="https://nextjs.org" target="_blank" rel="noreferrer">
        <NextJs fill="#9ca3af" />
      </a> */}
    </Text>
  )
}

export default ManziliCTA
