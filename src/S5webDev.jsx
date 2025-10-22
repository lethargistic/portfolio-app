import {useRef} from "react";
import './css/styles.scss';

import AllEmBoxes from "./webDevInsides/AllEmBoxes.jsx";

import {animated, useInView, useScroll, useSpring} from "@react-spring/web";

function S5webDev() {
    const buildInteractionObserverThreshold = (count = 100) => {
        const threshold = []

        const parts = 1 / count

        for (let i = 0; i <= count; i++) {
            threshold.push(parseFloat((parts * i).toFixed(2)))
        }

        return threshold
    }

    const [ref, isInView] = useInView({
        rootMargin: '20% 0px 20% 0px',
        amount: buildInteractionObserverThreshold(),
    })
    const animatedAlready = useRef(false)

    if (isInView) {
        animatedAlready.current = true;
    }

    const styles = useSpring({
        x: animatedAlready.current ? 0 : (isInView ? 0 : -600),
        config: {
            mass: 10,
            friction: 70,
            tension: 120,
        },
    })

    // scroll anim

    const { scrollYProgress } = useScroll();


    return (<section className={"s5webDev"}>
        <div className={"topperContainerWrapper"}>
            <div className={"topperContainer"}>
                <animated.h2 ref={ref} style={{...styles}} className={"webDevHeader"}>Web-dev</animated.h2>
                <animated.div ref={ref} style={{...styles}} className={"webDevLineWrapper"}>
                    <svg width="768" height="14" viewBox="0 0 768 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect y="14" width="14" height="768" rx="6" transform="rotate(-90 0 14)" fill="#D2D2D2"/>
                        <rect y="14" width="14" height="590" rx="6" transform="rotate(-90 0 14)" fill="white"/>
                    </svg>
                </animated.div>
            </div>
        </div>
        <div className={"webBg"}>
            <animated.div style={{
                border: "3px solid",
                borderImageSlice: "1",
                borderWidth: "3px",
                borderImageSource: "linear-gradient(to left, #743ad5, #d53a9d)",

                x: scrollYProgress.to((progress) => {
                    const pageHeight = window.innerHeight;
                    return progress * pageHeight/12;
                }),
                y: scrollYProgress.to((progress) => {
                    const pageHeight = window.innerHeight;
                    return progress * pageHeight/4;
                }),
                config: {
                    mass: 15,
                    friction: 70,
                    tension: 320,
                },
            }} className={"webBgSquare"}></animated.div>
            <animated.div style={{
                border: "3px solid",
                borderImageSlice: "1",
                borderWidth: "3px",
                borderImageSource: "linear-gradient(to left, #743ad5, #d53a9d)",
                opacity: 0.8,

                x: scrollYProgress.to((progress) => {
                    const pageHeight = window.innerHeight;
                    return progress * pageHeight/9;
                }),
                y: scrollYProgress.to((progress) => {
                    const pageHeight = window.innerHeight;
                    return progress * pageHeight/-3;
                }),
                config: {
                    mass: 15,
                    friction: 70,
                    tension: 320,
                },
            }} className={"webBgSquare"}></animated.div>
            <animated.div style={{
                border: "3px solid",
                borderImageSlice: "1",
                borderWidth: "3px",
                borderImageSource: "linear-gradient(to left, #743ad5, #d53a9d)",
                opacity: 0.4,

                x: scrollYProgress.to((progress) => {
                    const pageHeight = window.innerHeight;
                    return progress * pageHeight/6;
                }),
                y: scrollYProgress.to((progress) => {
                    const pageHeight = window.innerHeight;
                    return progress * pageHeight/-20;
                }),
                config: {
                    mass: 15,
                    friction: 70,
                    tension: 320,
                },
            }} className={"webBgSquare"}></animated.div>
        </div>

        <AllEmBoxes/>
    </section>)
}

export default S5webDev;