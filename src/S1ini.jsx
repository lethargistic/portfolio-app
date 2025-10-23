import {useState, useEffect} from "react";

import useCheckIfMobile from "./useCheckIfMobile.js";
import './css/styles.scss';

import {animated, useSpring} from "@react-spring/web";

import Illu from "./iniInsides/Illu.jsx";

import i18n from './i18n.js';
import i18next from "i18next";


function S1ini() {
    const [check, setCheck] = useState(true);

    const [springs, api] = useSpring(() => ({
        x: 0,
        y: 0,
        config: {
            mass: 12,
            friction: 20,
            tension: 420,
        }
    }));

    const [springs1, api1] = useSpring(() => ({
        x: 0,
        y: 0,
        config: {
            mass: 12,
            friction: 20,
            tension: 420,
        }
    }));

    const mobileCheck = useCheckIfMobile();

    function onMove() {
        if (!check || mobileCheck) return;
        api.start({
            from: {}, to: {
                x: Math.floor(Math.random() * 150),
                y: Math.floor(Math.random() * 150),
            },
        })
    }
    function onMove1() {
        if (!check) return;
        api1.start({
            from: {}, to: {
                x: Math.floor(Math.random() * 10),
                y: Math.floor(Math.random() * 10),
            },
        })
    }

    function onHold() {
        api.stop()
        setCheck(false);
    }
    function onHold1() {
        api1.stop()
        setCheck(false);
    }

    function startUp() {
        setCheck(true);
    }

    document.addEventListener('mousemove', startUp);


    const [flagUa, setFlagUa] = useState("#ffffff");
    const [flagGb, setFlagGb] = useState("#bfccb8");
    const [switcher, setSwitcher] = useState(true);

    useEffect(() => {
        const lang = i18next.language || window.localStorage.i18nextLng;
        if (lang === "en") {
            setSwitcher(true)
            setFlagUa("#bfccb8")
            setFlagGb("#ffffff")
        } else {
            setSwitcher(false)
            setFlagUa("#ffffff")
            setFlagGb("#bfccb8")
        }
    }, []);

    function changeLang() {
        if (switcher) {
            i18n.changeLanguage("en")
            setFlagUa("#bfccb8")
            setFlagGb("#ffffff")
            setSwitcher(false);
        } else {
            i18n.changeLanguage("uk")
            setFlagUa("#ffffff")
            setFlagGb("#bfccb8")
            setSwitcher(true);

        }
    }

    return (
        <section className={"s1ini flex-to-mid"}>
            <Illu></Illu>
            <animated.div onMouseDown={onHold} onMouseUp={startUp} onMouseMove={onMove} style={{...springs}}
                          className={"iniHWrap"}>
                <h1 className={"iniH1"}>Maksiks</h1>
            </animated.div>
            <animated.div onClick={changeLang} onMouseDown={onHold1} onMouseUp={startUp} onMouseMove={onMove1} style={{...springs1}}
                          className={"iniHWrap iniLangWrap"}>
                <p className={"iniH1"}><span style={{backgroundColor: flagUa}} className={"flag"}>Uk</span> / <span style={{backgroundColor: flagGb}} className={"flag"}>En</span></p>
            </animated.div>
        </section>
    )
}

export default S1ini;