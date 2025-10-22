import '../css/styles.scss';

function BottomRect() {
    return (
        <svg className={"bottomRect"} width="100vw" height="60" viewBox="0 0 100vw 60" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <rect x="335" y="38" width="1638" height="22" fill="#BDBDBD"/>
            <rect width="1920" height="22" transform="matrix(-1 0 0 1 1920 38)" fill="#BDBDBD"/>
            <rect x="1920" y="38" width="1920" height="38" transform="rotate(180 1920 38)"
                  fill="url(#paint0_linear_557_18)"/>
            <defs>
                <linearGradient id="paint0_linear_557_18" x1="2880" y1="76" x2="2880" y2="38"
                                gradientUnits="userSpaceOnUse">
                    <stop stop-color="#636363"/>
                    <stop offset="1" stop-color="#666666"/>
                </linearGradient>
            </defs>
        </svg>
    )
}

export default BottomRect;
