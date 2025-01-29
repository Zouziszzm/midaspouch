'use client';

import { useEffect } from 'react';
import { app } from '../../lib/firebase';

export function FirebaseInitializer() {
    useEffect(() => {
        // This effect runs once when the component mounts
        // It ensures that Firebase is initialized
        const initializeFirebase = () => {
            try {
                // The app is already initialized in ../lib/firebase.ts
                // We just need to make sure it's loaded
                if (app) {
                    console.log('Firebase initialized successfully');
                }
            } catch (error) {
                console.error('Error initializing Firebase:', error);
            }
        };

        initializeFirebase();
    }, []);

    return null; // This component doesn't render anything
}
