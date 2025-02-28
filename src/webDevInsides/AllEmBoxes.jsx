import React, {memo, useRef, useState} from 'react';
import '../css/styles.scss';
import {animated, useSpring} from '@react-spring/web';

// flexixfy cfg

function AllEmBoxes() {
    const videoRef = useRef(null);

    const futureVid = <video ref={videoRef} className={"corVid"} src={"../vid/webdvid1.webm"} loop muted autoPlay={true}>
    </video>
    const teaVid = <video ref={videoRef} className={"corVid"} src={"../vid/webdvid2.webm"} loop muted autoPlay={true}>
    </video>
    const hereVid = <video ref={videoRef} className={"corVid"} src={"../vid/webdvid3.webm"} loop muted autoPlay={true}>
    </video>
    const bwkittyVid = <video ref={videoRef} className={"corVid"} src={"../vid/webdvid4.webm"} loop muted autoPlay={true}>
    </video>
    const oldfolioVid = <video ref={videoRef} className={"corVid"} src={"../vid/webdvid5.webm"} loop muted autoPlay={true}>
    </video>
    const aieEmojifyVid = <video ref={videoRef} className={"corVid"} src={"../vid/webdvid6.webm"} loop muted autoPlay={true}>
    </video>
    const clickTheCityCommisionVid = <video ref={videoRef} className={"corVid"} src={"../vid/webdvid7.webm"} loop muted autoPlay={true}>
    </video>


    let gridData = [
        {
            id: 1,
            a1: 1,
            a2: 1,
            a3: 2,
            a4: 3,
            vid: futureVid,
            link: "https://maksiksq.github.io/futureOfUkraineWebDesignCompetition2023h1/"
        },
        {id: 2, a1: 1, a2: 3, a3: 2, a4: 6, vid: teaVid, link: "https://course-site-f.vercel.app/#"},
        {id: 3, a1: 2, a2: 1, a3: 3, a4: 3, vid: hereVid, link: "nope"},
        {id: 4, a1: 2, a2: 3, a3: 3, a4: 5, vid: bwkittyVid, link: "https://b-w-kitty-maksiksed.vercel.app/"},
        {id: 5, a1: 2, a2: 5, a3: 3, a4: 6, vid: oldfolioVid, link: "nope"},
        {id: 6, a1: 3, a2: 1, a3: 4, a4: 3, vid: aieEmojifyVid, link: "nope"},
        {id: 7, a1: 3, a2: 3, a3: 4, a4: 6, vid: clickTheCityCommisionVid, link: "nope"}
    ]


    const [boxes, setBoxes] = useState(
        gridData
    );

    const [springs, api] = useSpring(() => ({
        width: "100%",
        config: {
            mass: 8,
            friction: 30,
            tension: 120,
        },
    }))


    function GridDataBake(props) {
        if (props.link === "nope") {
            return (
                <animated.div className={"wdiv wdiv" + String(props.ids)}
                              key={props.id}
                              style={{gridArea: String(props.a1) + "/" + String(props.a2) + "/" + String(props.a3) + "/" + String(props.a4), ...springs,}}>
                    {props.vid}
                </animated.div>
            )
        }
        return <animated.a href={props.link} target={"_blank"} className={"wdiv wdiv" + String(props.ids)}
                           key={props.id}
                           style={{gridArea: String(props.a1) + "/" + String(props.a2) + "/" + String(props.a3) + "/" + String(props.a4), ...springs,}}>
            {props.vid}
        </animated.a>;
    }

    const gradientStyles = useSpring({
        config: {duration: 5000},
        loop: {reverse: true},
        from: {
            background: "linear-gradient(to left, #d53a9d, #743ad5)",
        },

        to: {
            background: "linear-gradient(to left, #743ad5, #d53a9d)",
        }
    });

    return (
        <div className={"allEmDoubleWrapper"}>
            <animated.div style={{
                paddingTop: "5.3vh",
                paddingBottom: "5.3vh",
                paddingLeft: "0.3vh",
                paddingRight: "0.3vh",
                ...gradientStyles,
            }} className="allEmWrapper flex-to-mid">
                <div className={"allEmBoxes"}>
                    {boxes.map((box) => <GridDataBake key={box.id} ids={box.id} a1={box.a1} a2={box.a2} a3={box.a3}
                                                      a4={box.a4} vid={box.vid} link={box.link}/>)}
                </div>
            </animated.div>
        </div>
    )


}

export default memo(AllEmBoxes);