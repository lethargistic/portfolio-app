import './css/styles.scss';

import DesiLeft from "./desiInsides/DesiLeft.tsx";
import DesiRight from "./desiInsides/DesiRight.tsx";

function S7designin() {
    return (<section className={"S7designin"}>
        <div className={"desiLeft"}>
            <DesiLeft/>
        </div>
        <div className={"desiRightWrap"}>
            <div className={"desiRight"}>
                <DesiRight/>
            </div>
        </div>

    </section>)
}

export default S7designin;