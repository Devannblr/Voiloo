'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Base/logo';

export function Preloader({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // 1. Vérifier si l'utilisateur a déjà vu le loader dans cette session
        const hasSeenLoader = sessionStorage.getItem('voiloo_first_load_done');

        if (hasSeenLoader) {
            setIsLoading(false);
            setShouldRender(true);
            return;
        }

        // 2. Si c'est la première fois, on affiche et on bloque le scroll
        setShouldRender(true);
        document.body.classList.add('no-scroll');

        const timer = setTimeout(() => {
            setIsLoading(false);
            document.body.classList.remove('no-scroll');
            // On enregistre qu'il l'a vu
            sessionStorage.setItem('voiloo_first_load_done', 'true');
        }, 1500); // 1.5s c'est suffisant pour le style sans être lourd

        return () => {
            clearTimeout(timer);
            document.body.classList.remove('no-scroll');
        };
    }, []);

    // Empêche un flash de contenu avant que le JS ne vérifie le sessionStorage
    if (!shouldRender) return null;

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="preloader"
                        initial={{ opacity: 1 }}
                        exit={{
                            y: '-100%',
                            transition: { duration: 0.6, ease: [0.45, 0, 0.55, 1] }
                        }}
                        className="fixed inset-0 z-[9999] bg-[#FFD359] flex flex-col items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl flex flex-col items-center gap-6"
                        >
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Logo voilColor="black" ooColor="#FFD359" />
                            </motion.div>

                            <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden relative">
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-[#FFD359]"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={isLoading ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                {children}
            </motion.div>
        </>
    );
}