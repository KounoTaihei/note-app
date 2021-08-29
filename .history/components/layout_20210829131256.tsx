import { ReactChild } from "react";
import Header from "./header";

const Layout = ({ children }: Props) => {
    return (
        <>
            <Header />
            <main></main>{children}
        </>
    )
}

interface Props {
    children: ReactChild
}

export default Layout;