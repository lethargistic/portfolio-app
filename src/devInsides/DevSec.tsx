import '../css/styles.scss';

import DevSvgLine from "../svgComps/DevSvgLine";
import React from "react";
import Snow from "./Snow"

import {useTranslation} from "react-i18next";

// react (or ts?) doesn't wanna eat my path and make a video so I have to import them separately, so weird
// anyways a better way to solve this as I later discovered would be to put the vids inside the public folder
const mouseSpinVid: any = <video src={"vid/cursorRealForreal.mp4"} loop={true} muted={true} autoPlay={true} />
const textLapserVid: any = <img className={"devVideoEven"} src={"vid/impostor.png"} alt={"impostor"}/>
const opApVid: any = <img src={"vid/imposter2real.png"} alt={"impostor2"}/>
const teaModVid: any = <video className={"devVideoEven"} src={"vid/minceraftReal.mp4"}
                              loop={true} muted={true} autoPlay={true}/>


interface DevSecProps {
    sp: any;
}

interface distributeDataProps {
    even: boolean;
    sp: any;
    id: string;
    video: string;
    title: string;
    text: string;
    githublnk: string;
}

function DistributeData(props: distributeDataProps) {
    if (!props.even) {
        return (<>
                <Snow sp={props.sp}/>
                <div className="devSec">
                    <div className={"funkyDiv"}>
                        <img className={"dec1Rainloop"} src={"./img/rainlooptt.gif"} loading={"lazy"}
                             alt="rainl"/>
                    </div>
                    <div className={"devSecBox"}>
                        {props.video}
                        <div className={"devSecTxtContainer"}>
                            <h3>{props.title}</h3>
                            <DevSvgLine/>
                            <p>
                                {props.text}
                                <br/><br/>
                                <a className={"gitLinkDeco"} target={"_blank"} rel="noreferrer"
                            href={props.githublnk}>Github #
                        </a>
                    </p>
                </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (<>
                <Snow sp={props.sp}/>
                <div className="devSec">
                    <div className={"devSecBox"}>
                        {props.video}
                        <div className={"devSecTxtContainer devTxtContEven"}>
                            <h3>{props.title}</h3>
                            <DevSvgLine/>
                            <p>
                                {props.text}
                                <br/><br/>
                                <a target={"_blank"} rel="noreferrer" href={props.githublnk}>Github #</a>
                            </p>
                        </div>
                    </div>
                    <div className={"funkyDiv"}>

                    </div>
                </div>
            </>
        )
    }
}

function DevSec(props: DevSecProps) {
    const { t } = useTranslation();

    const data = [
        {
            id: "mouseSpin",
            video: mouseSpinVid,
            title: t("dev.devSec1.title"),
            text: t("dev.devSec1.desc"),
            githublnk: "https://github.com/maksiksking/Mouse-spinner",
            even: false
        },
        {
            id: "textLapser",
            video: textLapserVid,
            title: t("dev.devSec2.title"),
            text: t("dev.devSec2.desc"),
            githublnk: "https://github.com/maksiksking/TextLapserBot",
            even: true
        },
        {
            id: "opAp",
            video: opApVid,
            title: t("dev.devSec3.title"),
            text: t("dev.devSec3.desc"),
            githublnk: "https://github.com/maksiksking/AI-emojify",
            even: false
        },
        {
            id: "teaMod",
            video: teaModVid,
            title: t("dev.devSec4.title"),
            text: t("dev.devSec4.desc"),
            githublnk: "https://github.com/maksiksking/tea-mod",
            even: true
        }
    ]

    return (<>{data.map((d) =>
        <DistributeData key={d.id} id={d.id} sp={props.sp} even={d.even} video={d.video}
                        title={d.title} text={d.text} githublnk={d.githublnk}/>)}</>)

}

export default DevSec;