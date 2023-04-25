import Link from "next/link"

import { PreviewAlert } from "components/preview-alert"
import Image from "next/image"

export function Layout({ children }) {
  return (
    <>
      <PreviewAlert />
      <div className="max-w-screen-lg px-6 mx-auto">
        <header>
          <div className="container flex items-center justify-between py-6 mx-auto">
            <Link href="/" className="text-2xl font-semibold no-underline">
              Adidas Store
            </Link>
            <Link
              href="https://www.adidas.com.ar/"
              target="_blank"
              rel="external"
              className="hover:text-blue-600"
            >
             <Image src="adidas.svg" width={100} height={100} alt="logo" />
            </Link>
          </div>
        </header>
        <main className="container py-10 mx-auto">{children}</main>
      </div>
    </>
  )
}
