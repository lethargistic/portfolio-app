import './css/certificates.scss';

const imgSources = [
    {src: "/img/cert/vntu1stplace.webp", size: "5x4"},
    {src: "/img/cert/veryverified.webp", size: "5x2"},
    {src: "/img/cert/vntu1stplaceagain.webp", size: "5x4"},
    {src: "/img/cert/ituniverse.webp", size: "5x2"},
    {src: "/img/cert/IMG_20251022_195635.webp", size: "5x4"},
    {src: "/img/cert/icpcintecollege.webp", size: "5x2"},
    {src: "/img/cert/IMG_20251022_195227.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_195626.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_195301.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_195357.webp", size: "5x4"},
    {src: "/img/cert/talan7.webp", size: "5x2"},
    {src: "/img/cert/IMG_20251022_195410.webp", size: "5x4"},
    {src: "/img/cert/badlycroppedicpc.webp", size: "5x2"},
    {src: "/img/cert/IMG_20251022_195135.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_195422.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_195447.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_195200.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_195519.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_195528.webp", size: "5x4"},
    {src: "/img/cert/engineerektccredit.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_195544.webp", size: "5x2"},
    {src: "/img/cert/TALAN_certificate_3.webp", size: "5x2"},
    {src: "/img/cert/cybergram.webp", size: "5x4"},
    {src: "/img/cert/TALAN_certificate_1.webp", size: "5x2"},
    {src: "/img/cert/shodekoly.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_195612.webp", size: "5x4"},
    {src: "/img/cert/factorygames.webp", size: "5x2"},
    {src: "/img/cert/IMG_20251022_195900.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_195654.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_195711.webp", size: "5x4"},
    {src: "/img/cert/TALAN_certificate_2.webp", size: "5x2"},
    {src: "/img/cert/1730386486474_certificate.webp", size: "5x2"},
    {src: "/img/cert/IMG_20251022_195809.webp", size: "5x2"},
    {src: "/img/cert/5cb5996a-6df7-4845-aaab-b6b96cf14a81.webp", size: "5x2"},
    {src: "/img/cert/IMG_20251022_195820.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_195829.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_195850.webp", size: "5x4"},
    {src: "/img/cert/stickerpack.webp", size: "5x2"},
    {src: "/img/cert/kharkivitcluster.webp", size: "5x2"},
    {src: "/img/cert/IMG_20251022_200035.webp", size: "5x4"},
    {src: "/img/cert/IMG_20251022_200141.webp", size: "5x2"},
    {src: "/img/cert/IMG_20251022_195734.webp", size: "5x4"},
    {src: "/img/cert/webdevagain.webp", size: "5x4"},
    {src: "/img/cert/trivia2ndplace.webp", size: "5x4"},
]

let currentLightboxSrc = "oh";
let isLightbox = false;

function CertificatesPage() {
    // damn 2024 maksiks liked abstracting stuff for no reason
    return <>

        <div className={`certLightbox ${isLightbox ? '' : 'certHide'}`} onClick={() => {isLightbox = false; currentLightboxSrc="oh";}}>
            <img src={currentLightboxSrc} alt={`Certificate - ${currentLightboxSrc}`}/>
        </div>
        <div className="certOuterCont">
            <div className="certImgHolder">
                {imgSources.map(img =>
                    <img onClick={() => {
                        currentLightboxSrc = img.src;
                        isLightbox = true
                    }}
                         className={`certImg certSize${img.size}`} key={img.src} src={img.src}
                         alt={`Certificate - ${img.src}`}/>)}
            </div>
        </div>
    </>
}

export default CertificatesPage;