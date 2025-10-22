import {Helmet} from "react-helmet-async";
import {RecoilRoot} from "recoil";
import S1ini from "./S1ini.jsx";
import LightBox from "./LightBox.tsx";
import S3about from "./S3about.jsx";
import S4holder from "./S4holder.jsx";
import S5webDev from "./S5webDev.jsx";
import S6programmin from "./S6programmin.jsx";
import S7designin from "./S7designin.jsx";
import MiniFooter from "./MiniFooter.jsx";


function RestOfThePage() {
    return (
        <>
            <LightBox/>
            <S3about/>
            <S4holder/>
            <S5webDev/>
            <S6programmin/>
            <S7designin/>
            <MiniFooter/>
        </>
    )
}


function MainPage() {
    return (
        <div>
            <Helmet>
                <title>Maksiks</title>
                <meta name='description' content='My about me page, made in React, try it out and see.'/>
                { /* Facebook tags */}
                <meta property="og:type" content={"portfolio"}/>
                <meta property="og:title" content={"Maksiks"}/>
                <meta property="og:description" content={"My about me page, made in React, try it out and see."}/>
                { /* Very reliable yes yes */}
                <meta property="og:image" content="https://static-00.iconduck.com/assets.00/snowflake-emoji-1789x2048-8zi0l7bq.png"/>
                { /* End Facebook tags */}
                { /* Twitter tags */}
                <meta name="twitter:creator" content={"Maksiks"}/>
                <meta name="twitter:card" content={"app"}/>
                <meta name="twitter:title" content={"Maksiks"}/>
                <meta name="twitter:description" content={"My about me page, made in React, try it out and see."}/>
                { /* End Twitter tags */}
            </Helmet>
            <RecoilRoot translate="no">
                <S1ini/>
                {/*<S2now/> removed*/}
                <RestOfThePage/>
            </RecoilRoot>

        </div>
    )
}

export default MainPage;