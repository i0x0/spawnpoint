'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export type MenuItem = {
	label: string;
	href: string;
	icon?: React.ReactNode;
}

export interface DropdownMenuProps {
	items: MenuItem[];
}

export default function DropdownMenu({ items }: DropdownMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	// Update selected item based on current path
	useEffect(() => {
		const currentItem = items.find(item => pathname?.startsWith(item.href));
		if (currentItem) {
			setSelectedItem(currentItem);
		}
	}, [pathname, items]);

	return (
		<div className="relative w-[100%]">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center justify-between w-full gap-2 px-4 py-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 border border-white/20"
			>
				{selectedItem?.label || "Select"}
				<svg
					className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>
			{isOpen && (
				<div className="absolute left-0 mt-2 w-full rounded-lg bg-black/50 backdrop-blur-sm border border-white/20 shadow-lg">
					<div className="py-2">
						{items.map((item, index) => (
							<Link
								key={index}
								href={item.href}
								onClick={() => {
									setSelectedItem(item);
									setIsOpen(false);
								}}
								className="block w-full text-left px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5"
							>
								<div className="flex items-center gap-2">
									{item.icon && <span>{item.icon}</span>}
									<span>{item.label}</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
}