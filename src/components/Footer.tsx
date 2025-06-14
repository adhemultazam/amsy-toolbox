
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full mt-16 py-8 border-t border-gray-200">
            <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-sm text-gray-600">
                    Dibuat dengan <span className="text-red-500">❤️</span> oleh{' '}
                    <a
                        href="https://www.threads.com/@adhemultazam"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-purple-600 hover:underline"
                    >
                        adhemultazam
                    </a>
                </p>
                <a
                    href="https://lynk.id/amsydigital/s/32mrloyk2qwq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                >
                    <Button
                        size="lg"
                        className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg font-semibold"
                    >
                        <Heart className="mr-2 h-4 w-4" /> Traktir Kopi
                    </Button>
                </a>
                <p className="text-xs text-gray-500">
                    &copy; {currentYear} All rights reserved
                </p>
            </div>
        </footer>
    );
};

export default Footer;
