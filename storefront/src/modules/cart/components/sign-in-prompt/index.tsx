import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { MoveRightIcon } from "lucide-react"

const SignInPrompt = () => {
  return (
    <div className="bg-white flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge">
          Vous avez déjà un compte ?
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          Connectez-vous pour une meilleure expérience.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button className="h-10 flex justify-center items-center text-center px-3 py-4 bg-black font-medium text-sm text-white border-black border-solid rounded-full hover:text-black hover:bg-transparent" data-testid="sign-in-button">
            Se connecter
            <MoveRightIcon className="ml-2 h-4 w-4 hover:text-black" />
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
