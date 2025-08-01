import { Text } from "@medusajs/ui"

import Medusa from "../../../common/icons/medusa"
import NextJs from "../../../common/icons/nextjs"
import { Linkedin } from "@medusajs/icons"

const MedusaCTA = () => {
  return (
    <Text className="flex gap-x-2 txt-compact-small-plus items-center">
      Powered by
      <a href="https://linkedin.com/in/fiqhianass" target="_blank" rel="noreferrer" className="flex justify-center items-center gap-2">
        Anass<Linkedin fill="#9ca3af" className="fill-[#9ca3af]" />
      </a>
      {/* &
      <a href="https://nextjs.org" target="_blank" rel="noreferrer">
        <NextJs fill="#9ca3af" />
      </a> */}
    </Text>
  )
}

export default MedusaCTA
