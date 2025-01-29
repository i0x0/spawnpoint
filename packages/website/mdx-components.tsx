import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		h1: ({ children }) => <h1 className="text-2xl font-bold text-center mb-6">{children}</h1>,
		br: () => <div className="my-4" />,
		a: ({ children, href }) => <Link href={href} className="text-blue-500 ">{children}</Link>,
		ul: ({ children }) => <ul className="list-disc list-inside">{children}</ul>,
		ol: ({ children }) => <ol className="list-decimal list-inside">{children}</ol>,
		...components,
	}
}