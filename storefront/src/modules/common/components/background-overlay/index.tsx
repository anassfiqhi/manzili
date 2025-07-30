import Image from "next/image"

export default function BackgroundOverlay() {
  return (
    <div className="absolute z-1 h-full top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none">
      <div className="w-[108rem] flex-none flex justify-end">
        <Image
          src="/img/docs@tinypng.d9e4dcdc.png"
          alt=""
          width={1148}
          height={800}
          className="w-[71.75rem] flex-none max-w-none block dark:hidden"
          priority
        />
        <Image
          src="/img/docs-dark@tinypng.1bbe175e.png"
          alt=""
          width={1440}
          height={800}
          className="w-[90rem] flex-none max-w-none hidden dark:block"
          priority
        />
      </div>
    </div>
  )
}