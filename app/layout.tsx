import {ClerkProvider} from '@clerk/nextjs';
import './globals.css';
import { ModalProvider } from '@/provider/modal-provider';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang='en'>
                <body>
                    <div className="flex items-center justify-center min-h-screen">
                        <ModalProvider />
                        {children}</div>
                </body>
            </html>
        </ClerkProvider>
    );
}
