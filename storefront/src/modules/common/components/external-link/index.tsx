import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { cn } from "@/lib/utils"

type ExternalLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
  className?: string
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

const ExternalLink = ({
  href,
  children,
  onClick,
  className,
  ...props
}: ExternalLinkProps) => {
  return (
    <a
      className={cn(
        "flex gap-x-1 items-center group/InteractiveLink text-black border-b border-black border-solid",
        className
      )}
      href={href}
      onClick={onClick}
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      <Text className="text-ui-fg-interactive">{children}</Text>
      <ArrowUpRightMini
        className="group-hover/InteractiveLink:rotate-45 ease-in-out duration-150 text-black"
      />
    </a>
  )
}

export default ExternalLink