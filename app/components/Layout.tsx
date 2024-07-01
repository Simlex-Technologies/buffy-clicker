import { FunctionComponent, ReactElement, ReactNode } from "react";
import Topbar from "./Topbar";
import Footer from "./BottomBar";

interface LayoutProps {
    children?: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }): ReactElement => {
    return (
        <>
            <Topbar />
            {children}
            <Footer />
        </>
    );
}

export default Layout;