import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { cn } from "@/lib/utils"
import LocalizedClientLink from "../localized-client-link"

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
  className?: string
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  className,
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      className={cn(
        "flex gap-x-1 items-center group/InteractiveLink text-black border-b border-black border-solid",
        className
      )}
      href={href}
      onClick={onClick}
      {...props}
    >
      <Text className="text-ui-fg-interactive text-black">{children}</Text>
      <ArrowUpRightMini
        className="group-hover/InteractiveLink:rotate-45 ease-in-out duration-150 text-black"
        // color="var(--fg-interactive)"
      />
    </LocalizedClientLink>
  )
}

export default InteractiveLink
