import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";


function Body() {
    return (
        <div className={"flex flex-col min-h-full"}>
            <Header />
            <div className={"bg-stone-100 flex-1"}>
                <div className={"container mx-auto py-4 "}>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Body;