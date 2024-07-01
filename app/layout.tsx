import type { Metadata } from 'next'
import { Mulish } from 'next/font/google'
import './globals.scss';
import Layout from './components/Layout';

const mulish = Mulish({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Buffy ',
    description: 'Telegram clicker bot'
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <html lang="en" data-theme={"light"}>
            <body className={`${mulish.className} p-6 bg-gradient-to-b from-slate-800 to-slate-0`}>
                <Layout children={children} />
            </body>
        </html>
    )
}
