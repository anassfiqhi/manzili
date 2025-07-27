import { Metadata } from "next"

import InteractiveLink from "@/modules/common/components/interactive-link"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "404",
  description: "Une erreur s'est produite",
}

export default function NotFound() {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-gray-300">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          Page non trouvée
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Désolé, nous n'avons pas pu trouver la page que vous recherchez.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <LocalizedClientLink 
            href="/" 
            className="rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            Retourner à l'accueil
          </LocalizedClientLink>
          <InteractiveLink 
            href="/contact" 
            className="text-sm font-semibold text-gray-900 hover:text-gray-700 border-b border-black border-solid"
          >
            Contacter le support <span aria-hidden="true">&rarr;</span>
          </InteractiveLink>
        </div>
      </div>
    </main>
  )
}
