import React from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

// Passing onAction prop so the "Start Building" button can transition out of Landing Page
export function HeroSection({ onAction }: { onAction: () => void }) {
    return (
        <>
            <HeroHeader onAction={onAction} />
            <main className="overflow-x-hidden pt-12 text-white">
                <section>
                    <div className="pb-16 pt-8 md:pb-24 lg:pb-32 lg:pt-32">
                        <div className="relative mx-auto flex max-w-6xl flex-col px-6 items-center">
                            <div className="mx-auto max-w-2xl text-center">
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl font-display text-white">Ship 10x Faster with NS</h1>
                                <p className="mt-8 max-w-2xl text-pretty text-lg text-gray-300">Highly customizable components for building modern websites and applications that look and feel the way you mean it.</p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-4">
                                    <Button onClick={onAction} size="lg" className="px-8 py-7 text-lg bg-[#00FFB2] text-black hover:bg-[#00FFB2]/90 rounded-full font-bold shadow-[0_0_40px_rgba(0,255,178,0.25)] transition-all">
                                        <span className="text-nowrap">Start Building Free</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

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
