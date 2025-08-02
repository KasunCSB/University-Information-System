'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'

const universities = [
	{
		name: 'University of Colombo',
		established: 1921,
		location: 'Colombo',
		logo: '/images/feature-img1.png',
		description:
			'The oldest university in Sri Lanka, renowned for its academic excellence and vibrant campus life.',
		website: 'https://cmb.ac.lk/',
	},
	{
		name: 'University of Peradeniya',
		established: 1942,
		location: 'Peradeniya',
		logo: '/images/feature-img2.png',
		description:
			'Nestled in the hills, Peradeniya is known for its beautiful campus and strong research culture.',
		website: 'https://www.pdn.ac.lk/',
	},
	{
		name: 'University of Kelaniya',
		established: 1959,
		location: 'Kelaniya',
		logo: '/images/feature-img3.png',
		description:
			'A leader in humanities, social sciences, and modern technology education.',
		website: 'https://www.kln.ac.lk/',
	},
	{
		name: 'University of Moratuwa',
		established: 1966,
		location: 'Moratuwa',
		logo: '/images/feature-img4.png',
		description:
			'Sri Lanka\'s premier engineering and technology university, driving innovation and industry partnerships.',
		website: 'https://www.mrt.ac.lk/',
	},
]

export default function UniversityInfoPage() {
	const [selected, setSelected] = useState<number | null>(null)

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<Header />

			<div className="container mx-auto px-4 py-8">
				<div className="text-center mb-10">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
						Sri Lankan Universities
					</h1>
					<p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
						Explore key information about major universities connected through the
						UIS platform.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{universities.map((uni, idx) => (
						<div
							key={uni.name}
							className={`card-responsive cursor-pointer transition-all duration-300 ${
								selected === idx ? 'ring-2 ring-blue-500 scale-105' : ''
							}`}
							onClick={() => setSelected(selected === idx ? null : idx)}
						>
							<div className="flex items-center space-x-4 mb-4">
								<div className="w-16 h-16 relative flex-shrink-0">
									<Image
										src={uni.logo}
										alt={uni.name}
										width={64}
										height={64}
										className="object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
									/>
								</div>
								<div>
									<h2 className="text-lg font-bold text-gray-900 dark:text-white">
										{uni.name}
									</h2>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{uni.location}
									</p>
								</div>
							</div>
							<p className="text-gray-700 dark:text-gray-300 mb-2">
								{uni.description}
							</p>
							<div className="flex items-center justify-between mt-4">
								<span className="text-xs text-gray-500 dark:text-gray-400">
									Established: <b>{uni.established}</b>
								</span>
								<Link
									href={uni.website}
									target="_blank"
									rel="noopener noreferrer"
									className="btn-secondary text-xs px-3 py-1"
								>
									Visit Website
								</Link>
							</div>
							{selected === idx && (
								<div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 text-sm">
									<b>{uni.name}</b> is a proud participant of the UIS platform,
									supporting digital transformation in Sri Lankan higher education.
								</div>
							)}
						</div>
					))}
				</div>

				<div className="text-center mt-12">
					<Link
						href="/"
						className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
					>
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back to home
					</Link>
				</div>
			</div>
			<Footer />
		</div>
	)
}