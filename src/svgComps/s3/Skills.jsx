import {useRef} from "react";
import '../../css/styles.scss';
import {useInView, useSpring, animated} from "@react-spring/web";
import {Trans} from "react-i18next";

// Notice: The text is IN the SVG in a <text>! Because it's imported from Figma with
// Outline Text disabled to keep it SEO, copyable and to save some time

function Skills() {
    const [ref, isInView] = useInView({
    })
    const animatedAlready = useRef(false)

    if (isInView) {
        animatedAlready.current = true;
    }

    const styles = useSpring({
        y: animatedAlready.current ? 100 : (isInView ? 100 : 0),
        config: {
            mass: 6,
            friction: 40,
            tension: 120,
        }
    })

    return (
        <animated.svg ref={ref} style={styles} className={"skills"} width="1023" height="668" viewBox="0 0 1023 668" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M567.5 5.75V3.25H565H47C42.3056 3.25 38.5 7.05555 38.5 11.75V543.357C38.5 548.052 42.3056 551.857 47 551.857H565H567.5V549.357V5.75Z"
                    fill="white" stroke="#212121" stroke-width="5"/>
                <path
                    d="M49.5 31C49.5 21.8873 56.8873 14.5 66 14.5H556.051V159.5H66C56.8873 159.5 49.5 152.113 49.5 143V31Z"
                    fill="#212121" stroke="white" stroke-width="17"/>
                <path
                    d="M49.5 183C49.5 173.887 56.8873 166.5 66 166.5H556.051V540.5H66C56.8873 540.5 49.5 533.113 49.5 524V183Z"
                    fill="#212121" stroke="white" stroke-width="17"/>
                <rect x="518" y="1" width="12" height="555" rx="6" fill="#303030"/>
                <path
                    d="M537.091 5.75V3.25H539.591H1011C1015.69 3.25 1019.5 7.05555 1019.5 11.75V543.357C1019.5 548.052 1015.69 551.857 1011 551.857H539.591H537.091V549.357V5.75Z"
                    fill="white" stroke="#212121" stroke-width="5"/>
                <path
                    d="M1008.5 37C1008.5 27.8873 1001.11 20.5 992 20.5H548.5V540.5H992C1001.11 540.5 1008.5 533.113 1008.5 524V37Z"
                    fill="#212121" stroke="white" stroke-width="17"/>
                <rect x="528" y="1" width="12" height="555" rx="6" fill="#303030"/>
                <path
                    d="M521.909 117.75V115.25H519.409H48C43.3056 115.25 39.5 119.056 39.5 123.75V655.357C39.5 660.052 43.3056 663.857 48 663.857H519.409H521.909V661.357V117.75Z"
                    fill="white" stroke="#212121" stroke-width="5"/>
                <path
                    d="M50.5 143C50.5 133.887 57.8873 126.5 67 126.5H510.5V271.5H67C57.8873 271.5 50.5 264.113 50.5 255V143Z"
                    fill="#212121" stroke="white" stroke-width="17"/>
                <path
                    d="M50.5 295C50.5 285.887 57.8873 278.5 67 278.5H510.5V652.5H67C57.8873 652.5 50.5 645.113 50.5 636V295Z"
                    fill="#212121" stroke="white" stroke-width="17"/>
                <rect x="519.409" y="110" width="11.4057" height="558" rx="5.70284" fill="#303030"/>
                <path
                    d="M538.091 6V3.5H540.591H1012C1016.69 3.5 1020.5 7.3056 1020.5 12V655.357C1020.5 660.052 1016.69 663.857 1012 663.857H540.591H538.091V661.357V6Z"
                    fill="white" stroke="#212121" stroke-width="5"/>
                <path
                    d="M1009.5 31C1009.5 21.8873 1002.11 14.5 993 14.5H549.091V652.857H993C1002.11 652.857 1009.5 645.47 1009.5 636.357V31Z"
                    fill="#212121" stroke="white" stroke-width="17"/>
                <rect x="529.186" y="110" width="11.4057" height="558" rx="5.70284" fill="#303030"/>
                <path
                    d="M10.5 26.0137V24.6378L11.6625 23.9016L41.9524 4.72022C47.6119 1.13632 55 5.20262 55 11.9014V526.353C55 529.628 53.1184 532.612 50.163 534.023L49.0856 531.767L50.163 534.023L14.0773 551.256L10.5 552.964V549V26.0137Z"
                    fill="white" stroke="#212121" stroke-width="5"/>
                <path
                    d="M39.3135 51.0136C39.3135 41.901 31.9262 34.5137 22.8135 34.5137H21.4999V531.257H22.8135C31.9262 531.257 39.3135 523.87 39.3135 514.757V51.0136Z"
                    fill="#212121" stroke="white" stroke-width="17"/>
                <path
                    d="M484.5 29V26.5H482H11C6.30558 26.5 2.5 30.3056 2.5 35V573C2.5 577.694 6.30558 581.5 11 581.5H482H484.5V579V29Z"
                    fill="white" stroke="#212121" stroke-width="5"/>
                <path
                    d="M13.5 54.0005C13.5 44.8878 20.8873 37.5005 30 37.5005H473.5V182.5H30C20.8873 182.5 13.5 175.113 13.5 166V54.0005Z"
                    fill="#212121" stroke="white" stroke-width="17"/>
                <path
                    d="M13.5 206C13.5 196.887 20.8873 189.5 30 189.5H473.5V570.5H30C20.8873 570.5 13.5 563.113 13.5 554V206Z"
                    fill="#212121" stroke="white" stroke-width="17"/>
                <rect x="482" y="24.0005" width="12" height="555" rx="6" fill="#303030"/>
                <path
                    d="M501.091 28.7505V26.2505H503.591H975C979.694 26.2505 983.5 30.0561 983.5 34.7505V573C983.5 577.694 979.694 581.5 975 581.5H503.591H501.091V579V28.7505Z"
                    fill="white" stroke="#212121" stroke-width="5"/>
                <path
                    d="M972.5 53.7505C972.5 44.6378 965.113 37.2505 956 37.2505H512.091V570.5H956C965.113 570.5 972.5 563.113 972.5 554V53.7505Z"
                    fill="#212121" stroke="white" stroke-width="17"/>
                <path
                    d="M983.5 28.0005V26.8715L984.347 26.125L1003.88 8.90962C1009.37 4.07146 1018 7.96911 1018 15.2864V548.784C1018 551.63 1016.58 554.287 1014.21 555.863L1012.82 553.785L1014.21 555.863L987.384 573.69L983.5 576.271V571.608V28.0005Z"
                    fill="white" stroke="#212121" stroke-width="5"/>
                <path
                    d="M1003.5 53.0005C1003.5 46.5885 999.843 41.0307 994.5 38.2996V551.701C999.843 548.97 1003.5 543.413 1003.5 537V53.0005Z"
                    fill="#212121" stroke="white" stroke-width="13"/>
                <rect x="492" y="24.0005" width="12" height="555" rx="6" fill="#303030"/>
                <path
                    d="M419 149.087C419 145.172 422.149 141.998 426.034 141.998H428.379C432.264 141.998 435.414 145.172 435.414 149.087V151.451C435.414 155.366 432.264 158.54 428.379 158.54H426.034C422.149 158.54 419 155.366 419 151.451V149.087Z"
                    fill="white"/>
                <path
                    d="M436.586 149.087C436.586 145.172 439.736 141.998 443.621 141.998H445.966C449.851 141.998 453 145.172 453 149.087V151.451C453 155.366 449.851 158.54 445.966 158.54H443.621C439.736 158.54 436.586 155.366 436.586 151.451V149.087Z"
                    fill="white"/>
                <path
                    d="M428.379 136.09C428.379 132.174 431.529 129 435.414 129H437.759C441.644 129 444.793 132.174 444.793 136.09V138.453C444.793 142.368 441.644 145.543 437.759 145.543H435.414C431.529 145.543 428.379 142.368 428.379 138.453V136.09Z"
                    fill="white"/>
                <path d="M428.379 143.179H444.793V157.359H428.379V143.179Z" fill="white"/>
                <path d="M434.241 149.087H436.586V165.63H434.241V149.087Z" fill="white"/>
                <path
                    d="M434.215 165.466C433.922 164.884 434.153 164.173 434.73 163.878C435.308 163.583 436.013 163.815 436.306 164.397L437.256 166.283C437.549 166.865 437.319 167.577 436.741 167.872C436.164 168.167 435.458 167.935 435.165 167.353L434.215 165.466Z"
                    fill="white"/>
                <path
                    d="M390.757 133.243C393.101 130.899 396.899 130.899 399.243 133.243L410.757 144.757C413.101 147.101 413.101 150.899 410.757 153.243L399.243 164.757C396.899 167.101 393.101 167.101 390.757 164.757L379.243 153.243C376.899 150.899 376.899 147.101 379.243 144.757L390.757 133.243Z"
                    fill="white"/>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="90"
                      letter-spacing="0em"><tspan x="40" y="139.115"><Trans i18nKey={"skillsTitle"}></Trans></tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="40"
                      letter-spacing="0em"><tspan x="81" y="256.44"><Trans i18nKey={"skillsDesc.webDevTitle"}></Trans></tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="28"
                      letter-spacing="0em"><tspan x="81" y="302.558">&#62; Vue, React, JS, TS,&#10;</tspan>
                        <tspan x="81" y="333.558">SCSS, LESS, Figma,&#10;</tspan>
                        <tspan x="81" y="364.558">Photoshop, Git,&#10;</tspan>
                        <tspan x="81" y="395.558">UI/UX design, Tauri,&#10;</tspan>
                        <tspan x="81" y="426.558">Electron, SEO</tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="28"
                      letter-spacing="0em"><tspan x="574" y="145.558">&#62; Python, JS, TS, C++, &#10;</tspan>
                        <tspan x="574" y="176.558">Java, Assembler</tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="24"
                      letter-spacing="0em"><tspan x="571" y="209.264">&#62; Discord.py, Minecraft&#10;</tspan>
                        <tspan x="571" y="236.264">Fabric, Electron</tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="28"
                      letter-spacing="0em"><tspan x="575" y="328.558">&#62; Figma, Photoshop,&#10;</tspan>
                        <tspan x="575" y="359.558">Illustrator</tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="28"
                      letter-spacing="0em"><tspan x="574" y="451.558">&#62; Premiere Pro, AfterFX</tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="28"
                      letter-spacing="0em"><tspan x="574" y="541.558">&#62; ...</tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="28"
                      letter-spacing="0em"><tspan x="83" y="527.558">&#62; Photoshop, Aseprite</tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="50"
                      letter-spacing="0em"><tspan x="48" y="258.175">&#xd7;</tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="40"
                      letter-spacing="0em"><tspan x="574" y="102.44"><Trans i18nKey={"skillsDesc.devTitle"}></Trans></tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="50"
                      letter-spacing="0em"><tspan x="541" y="106.175">&#xd7;</tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="40"
                      letter-spacing="0em"><tspan x="575" y="285.44"><Trans i18nKey={"skillsDesc.graphicDesignTitle"}></Trans></tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="50"
                      letter-spacing="0em"><tspan x="542" y="289.175">&#xd7;</tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="40"
                      letter-spacing="0em"><tspan x="81" y="481.44"><Trans i18nKey={"skillsDesc.digitalArtTitle"}></Trans></tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="50"
                      letter-spacing="0em"><tspan x="48" y="485.175">&#xd7;</tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="40"
                      letter-spacing="0em"><tspan x="574" y="414.44"><Trans i18nKey={"skillsDesc.videoEditingTitle"}></Trans></tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="50"
                      letter-spacing="0em"><tspan x="541" y="418.175">&#xd7;</tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="40"
                      letter-spacing="0em"><tspan x="574" y="501.44"><Trans i18nKey={"skillsDesc.andMoreTitle"}></Trans></tspan></text>
                <text fill="white" style={{whiteSpace: "pre"}} font-family="Comfortaa" font-size="50"
                      letter-spacing="0em"><tspan x="541" y="505.175">&#xd7;</tspan></text>
        </animated.svg>

    )

}

export default Skills;