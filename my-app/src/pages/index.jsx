import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import bg from "../../public/wave-bg.jpg";
import Error from "@/components/Error";
import { ArrowDownIcon } from "@heroicons/react/24/outline";

const LocationAggregatorMap = dynamic(
  () => import("@/components/map/LocationAggregatorMapIndex"),
  {
    ssr: false,
  }
);

const Home = () => {
  const [error, setError] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const signedOut = params.get("signedout");

  useEffect(() => {
    const getData = async () => {
      const res = await fetch("/api/mongo/event/all");
      const data = await res.json();
      const coords = data.map((item) => {
        return { COORDINATES: [item.mapLong, item.mapLat] };
      });
      setCoordinates(coords);
    };
    if (session?.user) {
      // if user is logged in, navigate to home page
      router.push("/home");
    }
    if (!coordinates) {
      getData().then((r) => console.log("Fetched locations"));
    }
    if (signedOut) {
      router.push("/");
      toast.success("Successfully signed out", { toastId: "signedout" });
    }
  }, [session, signedOut]);

  return (
    <div className="min-h-screen">
      {error ? <Error /> : null}
      <div
        className="relative bg-cover bg-center h-screen bg-fixed"
        style={{ backgroundImage: `url(${bg.src})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#00000000] via-[#00000000] to-[#11111188]" />
        <div className="w-full flex justify-end pt-3 pe-2">
          <Link
            href="/auth/credentials-signin"
            className="text-white text-sm font-bold rounded-xl backdrop-blur hover:bg-sky-400 hover:bg-opacity-30 transition-all tracking-wide px-5 py-2 flex align-center justify-center"
          >
            SIGN IN
          </Link>
        </div>
        <div className="h-full w-full">
          <div
            className="flex items-center justify-center align-middle h-full pb-12 -my-16"
            style={{ textShadow: "#444 0 0 10px" }}
          >
            <div className="text-white text-center">
              <h1 className="text-6xl md:text-8xl font-extrabold mb-4">
                M A K A I
              </h1>
              <h1 className="text-xl md:text-4xl font-extrabold mb-4 tracking-wide">
                MARINE DEBRIS REPORTING PLATFORM
              </h1>
              <p className="text-lg text-gray-200 tracking-wide">
                <span className="font-semibold">JOIN THE MOVEMENT. </span>
                <span className="font-extrabold">HELP PROTECT OUR OCEANS.</span>
              </p>
              <div className="flex text-sm font-semibold gap-2 justify-center mt-10 tracking-wide">
                FOUND DEBRIS?
                <Link href="/report">
                  <span className="text-white text-sm font-bold px-8 py-3 rounded-xl backdrop-blur bg-sky-600 bg-opacity-30 hover:bg-sky-400 hover:bg-opacity-30 transition-all">
                    MAKE A REPORT
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="text-gray-100 text-sm font-semibold tracking-wide absolute bottom-5 left-0 right-0">
          <div
            className="flex flex-col justify-center gap-3 items-center opacity-60 hover:opacity-90 transition-all cursor-pointer w-fit mx-auto tracking-wider"
            onClick={() => {
              document.getElementById("mapSection").scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            {/* HAWAIIAN ISLANDS DEBRIS MAP */}
            <div className="rounded-full backdrop-blur bg-sky-600 bg-opacity-30 hover:bg-sky-400 hover:bg-opacity-40 p-3">
              <ArrowDownIcon className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
      <div id="mapSection" className="bg-black bg-opacity-60 min-h-screen">
        <section className="rounded-lg px-5 md:px-20 py-10">
          <h1 className="font-extrabold text-neutral text-center text-2xl md:text-5xl pb-12 opacity-90">
            See where debris has been reported.
          </h1>
          <LocationAggregatorMap data={coordinates} />
        </section>
      </div>
    </div>
  );
};

export default Home;
