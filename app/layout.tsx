import {ClerkProvider} from '@clerk/nextjs';
import './globals.css';
import { ModalProvider } from '@/providers/modal-provider';
import { ToasterProvider } from '@/providers/toast-provider';

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <html lang='en'>
                <body>
                    <div className="flex items-center justify-center min-h-screen">
                        <ToasterProvider />
                        <ModalProvider />
                        {children}</div>
                </body>
            </html>
        </ClerkProvider>
    );
}
