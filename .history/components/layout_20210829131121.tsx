import { ReactChild } from "react";

const Layout = ({ children }: ReactChild) => {
    return (
        <>
            {children}
        </>
    )
}

interface Props {
    children: ReactChild
}