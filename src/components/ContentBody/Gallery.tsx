import { MainImageContainer } from "./Gallery/MainImageContainer";
import { SideImageContainer } from "./Gallery/SideImageContainer";

const Gallery = () => {
    return (
        <div className="relative w-fit flex flex-col items-end justify-center">
            <MainImageContainer />
            
            <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/4 z-10">
                <SideImageContainer caption='"Eu não consigo não cantar Oops I Did It Again no karaokê"' />
            </div>
        </div>
    )
}

export default Gallery;