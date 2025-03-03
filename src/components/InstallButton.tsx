'use client'

import { useEffect, useState } from 'react';

const InstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

const handleInstallClick = async () => {
    if (deferredPrompt) {
       
        interface DeferredPrompt extends Event {
            prompt: () => Promise<void>;
            userChoice: Promise<{ outcome: string }>;
        }

        const promptEvent = deferredPrompt as DeferredPrompt;
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        setDeferredPrompt(null);
        setIsInstallable(false);
        console.log(`User response to the install prompt: ${outcome}`);
    }
};

    return (
        <>
            {isInstallable && (
                <button onClick={handleInstallClick} className="install-button bg-green-500 px-2">
                    Install App
                </button>
            )}
        </>
    );
};

export default InstallButton;