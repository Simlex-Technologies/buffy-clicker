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
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />
            <body className={`${mulish.className} p-6 bg-gradient-to-b from-slate-800 to-black to-slate-0`}>
                <Layout children={children} />
            </body>
        </html>
    )
}
