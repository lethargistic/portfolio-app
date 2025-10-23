import React, {useRef} from "react";
import '../css/styles.scss';

import {useInView, animated, useSpring} from "@react-spring/web";

import UnderProfile from "../svgComps/s3/UnderProfile.jsx";



function RightPFPWidget() {
    const [ref, isInView] = useInView({
    })
    const animatedAlready = useRef(false)

    if (isInView) {
        animatedAlready.current = true;
    }

    const styles = useSpring({
        scale: animatedAlready.current ? 1 : (isInView ? 1 : 0),
        config: {
            mass: 8,
            friction: 60,
            tension: 120,
        }
    })




    return (<div className={"rightPfpWrapper"}>
            <animated.img ref={ref} style={styles} className={"profilePic"} src={"./img/pfpvlike40somethingidkilostcountplusoutline.webp"}
                 alt={"profilePic"}/>
            <UnderProfile />
        </div>
    )
}


export default RightPFPWidget;