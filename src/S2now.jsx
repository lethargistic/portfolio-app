// UNUSED
// I skipped right to S3

// import React, {useState} from "react";
// import './css/styles.scss';
//
// import useSound from 'use-sound'
// import trainSound from './audio/train.mp3'
//
//
// function S2now({ sendPass }) {
//     const [playSound] = useSound(trainSound)
//
//     const textVars = [
//         {id: 1, text: "It’s not that impressive that it will make your heart stop, <br/> thanks for the compliment tho. Now press Yes"},
//         {id: 2, text: "Yes, your choice does not matter, this is a website after all."},
//         {id: 3, text:"Just click, you got your extra line of dialogue"},
//         {id: 4, text:"That's it, there is no more line here"}
//     ]
//
//     function playAndSend() {
//         playSound()
//         sendPass(true)
//     }
//
//     return (<section className={"s2now flex-to-mid"}>
//         <div className={"nowCont"}>
//             <p className={"s2txt1"}>Now you know my nickname.</p>
//             <p className={"s2txt2"}>But you’re about to touch the tip of a tiny yet deep world. <br/>
//                 Are you ready?</p>
//             <p className={"s2txt3"}><span onClick={() => playAndSend()} className={"s2Yes pointer"}>Yes</span> <span className={"s2No pointer"}>No</span> <span className={"caret0"}>&lt;</span></p>
//             <p className={"s2txt4"}>{"LOREM IPSUM"}</p>
//         </div>
//     </section>)
// }
//
// export default S2now;