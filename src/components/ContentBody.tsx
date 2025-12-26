import Gallery from "./ContentBody/Gallery";
import { PartyMap } from "./ContentBody/PartyMap";
import { OsitaText } from "./ContentBody/OsitaText";
import { PartyInfo } from "./ContentBody/Gallery/PartyInfo";

const ContentBody = () => {
  return (
    <div className=" grid grid-cols-5 gap-4">
      <div className="col-span-5 md:col-span-3 lg:col-span-2 lg:col-start-2">
        <OsitaText />
      </div>

      <div className="col-span-4 col-start-2 md:col-span-2 lg:col-span-1">
        <Gallery />
      </div>

      <div className="col-span-5 lg:col-span-3 lg:col-start-2 grid grid-cols-2 gap-0">
        <div className="col-span-2 md:col-span-1">
          <PartyInfo />
        </div>
        <div className="col-span-2 md:col-span-1">
          <PartyMap />
        </div>
      </div>
    </div>
  );
}

export default ContentBody;
