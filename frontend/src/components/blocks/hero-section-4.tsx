'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

// Passing onAction prop so the "Start Building" button can transition out of Landing Page
export function HeroSection({ onAction }: { onAction: () => void }) {
    return (
        <>
            <HeroHeader onAction={onAction} />
            <main className="overflow-x-hidden pt-12 text-white">
                <section>
                    <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-32">
                        <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl font-display text-white">Ship 10x Faster with NS</h1>
                                <p className="mt-8 max-w-2xl text-pretty text-lg text-gray-300">Highly customizable components for building modern websites and applications that look and feel the way you mean it.</p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                                    <Button onClick={onAction} size="lg" className="px-6 py-6 text-base bg-[#00FFB2] text-black hover:bg-[#00FFB2]/90 rounded-full font-bold">
                                        <span className="text-nowrap">Start Building Free</span>
                                    </Button>
                                    <Button onClick={onAction} size="lg" variant="ghost" className="px-6 py-6 text-base text-gray-300 hover:text-white rounded-full">
                                        <span className="text-nowrap">Request a demo</span>
                                    </Button>
                                </div>
                            </div>
                            <img
                                className="pointer-events-none order-first ml-auto h-56 w-full object-cover invert sm:h-96 lg:absolute lg:inset-0 lg:-right-20 lg:-top-64 lg:order-last lg:h-max lg:w-2/3 lg:object-contain dark:mix-blend-lighten dark:invert-0"
                                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80"
                                alt="Abstract Tech Object"
                                height="4000"
                                width="3000"
                            />
                        </div>
                    </div>
                </section>
                <section className="bg-background/80 backdrop-blur-sm pb-16 md:pb-32 mt-12">
                    <div className="group relative m-auto max-w-6xl px-6">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="md:max-w-44 md:border-r border-gray-800 md:pr-6 mb-8 md:mb-0">
                                <p className="text-center md:text-end text-sm text-gray-400">Powering the best teams</p>
                            </div>
                            <div className="relative py-6 md:w-[calc(100%-11rem)] w-full overflow-hidden">
                                <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                                    <div className="flex items-center text-xl font-bold text-gray-400">BrandOne</div>
                                    <div className="flex items-center text-xl font-bold text-gray-400">BrandTwo</div>
                                    <div className="flex items-center text-xl font-bold text-gray-400">BrandThree</div>
                                    <div className="flex items-center text-xl font-bold text-gray-400">BrandFour</div>
                                </InfiniteSlider>
                                <div className="bg-gradient-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                                <div className="bg-gradient-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Features', href: '#' },
    { name: 'Solution', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'About', href: '#' },
]

const HeroHeader = ({ onAction }: { onAction: () => void }) => {
    const [menuState, setMenuState] = React.useState(false)
    return (
        <header>
            <nav data-state={menuState ? 'active' : 'closed'} className="group bg-black/50 fixed z-20 w-full border-b border-gray-800 backdrop-blur-xl">
                <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <a href="#" aria-label="home" className="flex items-center space-x-2 font-bold text-xl text-[#00FFB2]">
                                SkillSync AI
                            </a>

                            <button onClick={() => setMenuState(!menuState)} className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-gray-300">
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <a href={item.href} className="text-gray-400 hover:text-white duration-150">
                                                <span>{item.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-[#0A0A0F] group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-gray-800 p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button onClick={onAction} variant="outline" size="sm" className="border-gray-700 bg-transparent text-gray-300 hover:text-white hover:bg-gray-800 rounded-full px-5">
                                    <span>Login</span>
                                </Button>
                                <Button onClick={onAction} size="sm" className="bg-[#00FFB2] text-black hover:bg-[#00FFB2]/90 rounded-full px-5">
                                    <span>Sign Up</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
