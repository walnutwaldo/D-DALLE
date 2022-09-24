import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";


function Body() {
    return (
        <div>
            <Header />
            <div className={"container mx-auto py-4"}>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Body;