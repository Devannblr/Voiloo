'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Base/logo';

export function Preloader({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Bloquer le scroll au montage
        document.body.classList.add('no-scroll');

        const timer = setTimeout(() => {
            setIsLoading(false);
            // Débloquer le scroll quand le chargement est fini
            document.body.classList.remove('no-scroll');
        }, 2000);

        return () => {
            clearTimeout(timer);
            document.body.classList.remove('no-scroll'); // Sécurité
        };
    }, []);

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="preloader"
                        initial={{ opacity: 1 }}
                        exit={{
                            y: '-100%',
                            transition: { duration: 0.8, ease: [0.45, 0, 0.55, 1] }
                        }}
                        className="fixed inset-0 z-[9999] bg-[#FFD359] flex flex-col items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{ duration: 0.6, ease: "backOut" }}
                            className="bg-white p-10 rounded-[40px] shadow-2xl flex flex-col items-center gap-6"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Logo voilColor="black" ooColor="#FFD359" />
                            </motion.div>

                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-[#FFD359]"
                                />
                            </div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 text-black font-black italic uppercase tracking-tighter text-xl"
                        >
                            Voiloo...
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.div>
        </>
    );
}