import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import ClickableMap from "@/components/map/ClickableMap/ClickableMap";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import { uploadFiles } from "@/utils/uploadthing";
import Container from "@/components/Container";

const ReportForm = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // debris description
  const [debrisType, setDebrisType] = useState(
    '"Mass of netting/fishing gear"'
  );
  const [debrisTypeOther, setDebrisTypeOther] = useState('');
  const [containerFullness, setContainerFullness] = useState(null);
  const [claimBoat, setClaimBoat] = useState(null);
  const [biofoulingRating, setBiofoulingRating] = useState(
    "1 - No algae or marine life at all"
  );

  // debris location
  const [debrisRelativeLocation, setDebrisRelativeLocation] = useState(
    "At sea, BEYOND three miles from nearest land"
  );
  const [debrisLocationDetails, setDebrisLocationDetails] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  // debris detailed description
  const [debrisTrappedDesc, setDebrisTrappedDesc] = useState(
    "Caught on the reef or partially buried in sand"
  );
  const [debrisTrappedOther, setDebrisTrappedOther] = useState("");
  const [imageURLArray, setImageURLArray] = useState([]);
  const [files, setFiles] = useState([]);

  // reporter contact info
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  const selectedBtnStyle = {
    background: "#3aa2e7",
    border: "1px solid #56A9E0",
    color: "white",
  };

  const regularBtnStyle = {
    background: "#b2b6b6",
    color: "#555555",
    border: "none",
  };

  const validPhone = (phone) => {
    const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setLastName(session?.user?.lastName);
    setFirstName(session?.user?.firstName);
    setEmail(session?.user?.email);
  }, [session]);

  async function submitForm() {
    // validation
    if (!coordinates) {
      toast.info("Please select a location on the map");
      return;
    }
    if (!firstName || !lastName) {
      toast.info("Please enter your first and last name");
      return;
    }
    if (!phoneNumber || !validPhone(phoneNumber)) {
      toast.info("Please enter a valid phone number");
      return;
    }
    if (!email || !validEmail(email)) {
      toast.info("Please enter a valid email address");
      return;
    }
    if (!confirmEmail || email !== confirmEmail) {
      toast.info("Email and confirm email must match");
      return;
    }
    setIsLoading(true);
    // upload image
    let image;
    if (files.length > 0) {
      const fileRes = await uploadFiles({
        files,
        endpoint: "imageUploader",
      });
      image = fileRes[0].url;
    }
    const data = {
      firstName,
      lastName,
      email,
      phoneNumber,
      imageUrl: image || null,
      publicType: debrisType,
      publicTypeDesc: debrisTypeOther,
      publicBiofoulingRating: parseInt(biofoulingRating.slice(0, 1)),
      publicLocationDesc: debrisRelativeLocation,
      publicLatLongOrPositionDesc: debrisLocationDetails,
      publicDebrisEnvDesc: debrisTrappedDesc,
      publicDebrisEnvAdditionalDesc: debrisTrappedOther,
      mapLat: coordinates?.latitude,
      mapLong: coordinates?.longitude,
    };
    if (debrisType.includes("Container")) {
      data.publicContainerFullness = containerFullness || "Full";
    } else if (debrisType.includes("boat")) {
      data.publicClaimBoat = claimBoat || "No";
    }
    const res = await fetch("/api/mongo/event/add-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.status === 201) {
      toast.success("Form submitted - Mahalo!");
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    } else {
      toast.error("Error submitting form - Please try again later");
    }
    setIsLoading(false);
  }

  return (
    <div>
      {isLoading && (
        <div
          className="fixed w-full h-full top-0 left-0 right-0 bottom-0 flex align-middle justify-center pb-20 m-0 bg-[#00000088]"
          style={{ zIndex: 1000 }}
        >
          <Loading />
        </div>
      )}
      <Container>
        <div className=" bg-white">
          <h1 className="w-full text-4xl font-bold mb-12">
            Report Marine Debris
          </h1>
          <p className="text-primary my-2">
            <b>
              TO REPORT MARINE ANIMALS THAT ARE ENTANGLED IN DEBRIS, CALL NOAA
              IMMEDIATELY AT{" "}
              <a
                className="whitespace-nowrap text-blue-500 hover:underline"
                href="tel:18882569840"
              >
                1-888-256-9840
              </a>
              &nbsp;(round-the-clock hotline)
            </b>
          </p>
          <a
            href="https://dlnr.hawaii.gov/dobor/boating-in-hawaii/dobor-emergency-contacts/"
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            <p className="mb-2">
              <b>DOBOR &quot;WHO TO CALL&quot; EMERGENCY CONTACT LIST</b>
            </p>
          </a>
          <hr />
          <p className="text-primary mt-4 mb-4">
            Use this form if you found marine debris you cannot remove by yourself
            that is:
          </p>
          <p className="text-primary mb-1">
            1) Drifting in State waters or washed up on the shoreline,
          </p>
          <p className="text-primary mb-1">
            2) Removed from the water and is secured on land, or
          </p>
          <p className="text-primary mb-6">
            3) So large or heavy that you need DLNR’s help to remove it.
          </p>

          <p className="text-primary mb-1">
            <b>Note:</b> Information you submit through this form is shared
            between divisions within DLNR, researchers at the University of
            Hawaii, NOAA, Non-Government Organizations and other agencies that
            manage marine debris and aquatic invasive species. Your contact
            information is kept confidential.
          </p>

          <h5 className="text-xl font-semibold text-primary mt-8 mb-2">
            Response and Removal Reporting Form
          </h5>
          <hr />
          <p className="text-primary mt-4 mb-2">
            By filling out and submitting this form, multiple divisions in DLNR
            will receive your report. Fields with an asterisk (*) are required.
          </p>

          {/* 1st section */}
          <div className="mt-4 mb-4">
            <p className="text-primary mb-2">
              <b>1) I FOUND/LOCATED THE FOLLOWING*</b>
            </p>
            <div
              className="form-control"
              onChange={(event) => setDebrisType(event.target.value)}
            >
              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    className="radio radio-xs radio-info"
                    name="debrisTypeRadio"
                    value="Mass of netting/fishing gear"
                    defaultChecked
                  />
                  <span className="label-text ml-2 text-primary">
                    A mass of netting and/or fishing gear
                  </span>
                </div>
              </label>
              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    className="radio radio-xs radio-info"
                    value="Abandoned/derelict boat"
                    name="debrisTypeRadio"
                  />
                  <span className="label-text ml-2 text-primary">
                    An abandoned/derelict boat
                  </span>
                </div>
              </label>
              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    className="radio radio-xs radio-info"
                    value="Container/drum/cylinder"
                    name="debrisTypeRadio"
                  />
                  <span className="label-text ml-2 text-primary">
                    A container/drum/cylinder
                  </span>
                </div>
              </label>
              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    className="radio radio-xs radio-info"
                    value="Large concentration of plastics"
                    name="debrisTypeRadio"
                  />
                  <span className="label-text ml-2 text-primary">
                    A large concentration of plastics
                  </span>
                </div>
              </label>
              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    className="radio radio-xs radio-info"
                    value="Potential Japan tsunami marine debris"
                    name="debrisTypeRadio"
                  />
                  <span className="label-text ml-2 text-primary">
                    Potential Japan tsunami marine debris
                  </span>
                </div>
              </label>
              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    className="radio radio-xs radio-info"
                    value="Large concentration of miscellaneous trash"
                    name="debrisTypeRadio"
                  />
                  <span className="label-text ml-2 text-primary">
                    A large concentration of miscellaneous trash
                  </span>
                </div>
              </label>
              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    className="radio radio-xs radio-info"
                    value="Other"
                    name="debrisTypeRadio"
                  />
                  <span className="label-text ml-3 text-primary">
                    Other - describe below
                  </span>
                </div>
              </label>
            </div>

            <p className="text-primary mt-4 mb-4">
              <b>
                ENTER DESCRIPTION OF THE TYPE OF DEBRIS FOUND AND WHAT IT WOULD
                TAKE TO REMOVE IT (for example, a large section of a dock or a
                shipping container requiring a crane to remove, a wooden beam
                10&rsquo; long that would require 3-4 people to lift, etc.)
              </b>
            </p>
            <input
              type="text"
              className="input input-bordered w-full bg-white text-primary mb-2"
              onChange={(event) => setDebrisTypeOther(event.target.value)}
              value={debrisTypeOther}
              placeholder="Optional"
            />
            {debrisType === "Container/drum/cylinder" && (
              <span>
                <p className="text-primary mt-4 mb-4">
                  <b>How full is the container/drum/cylinder?</b>
                </p>
                <select
                  className="select select-bordered w-full max-w-xs bg-white text-primary"
                  defaultValue="Full"
                  onChange={(event) => setContainerFullness(event.target.value)}
                >
                  <option>Full</option>
                  <option>Partially Filled</option>
                  <option>Empty</option>
                </select>
              </span>
            )}
            {debrisType === "Abandoned/derelict boat" && (
              <span>
                <p className="text-primary mt-4 mb-4">
                  <b>Do you want to claim the boat for personal use?*</b>
                </p>
                <div
                  className="form-control"
                  onChange={(event) => setClaimBoat(event.target.value)}
                >
                  <label className="label cursor-pointer">
                    <div className="flex items-left">
                      <input
                        type="radio"
                        name="claimBoatRadio"
                        value="Yes"
                        className="radio radio-xs radio-info"
                      />
                      <span className="label-text ml-2 text-primary">Yes</span>
                    </div>
                  </label>
                  <label className="label cursor-pointer">
                    <div className="flex items-left">
                      <input
                        type="radio"
                        name="claimBoatRadio"
                        className="radio radio-xs radio-info"
                        value="No"
                        defaultChecked
                      />
                      <span className="label-text ml-2 text-primary">No</span>
                    </div>
                  </label>
                </div>
              </span>
            )}

            <p className="text-primary mt-4 mb-4">
              <b>
                On a scale of one to ten (one represents no marine growth and ten
                represents significant marine life covering all submerged
                surfaces) how much biofouling is on the item you found?*
              </b>
            </p>

            <select
              onChange={(event) => setBiofoulingRating(event.target.value)}
              defaultValue="1 - No algae or marine life at all"
              className="select select-bordered w-full max-w-xs bg-white text-primary"
            >
              <option>1 - No algae or marine life at all</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>
                6 - Patches of dense algae and presence of barnacles colonies
              </option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>
                10 - Abundant, healthy growth of algae and barnacles covering
                submerged areas
              </option>
            </select>
          </div>

          {/* 2nd section */}

          <div className=" pt-2 mb-4 ">
            <p className="text-primary mt-4 mb-4">
              <b>THIS DEBRIS IS LOCATED*</b>
            </p>

            <div
              className="form-control"
              onChange={(event) => setDebrisRelativeLocation(event.target.value)}
            >
              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    name="debristLocationRadio"
                    className="radio radio-xs radio-info"
                    value="At sea, BEYOND three miles from nearest land"
                    defaultChecked
                  />
                  <span className="label-text ml-2 text-primary">
                    At sea, BEYOND three miles from nearest land
                  </span>
                </div>
              </label>
              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    name="debristLocationRadio"
                    className="radio radio-xs radio-info"
                    value="At sea, WITHIN three miles of nearest land"
                  />
                  <span className="label-text ml-2 text-primary">
                    At sea, WITHIN three miles of nearest land
                  </span>
                </div>
              </label>
              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    name="debristLocationRadio"
                    className="radio radio-xs radio-info"
                    value="In the shore break"
                  />
                  <span className="label-text ml-2 text-primary">
                    In the shore break
                  </span>
                </div>
              </label>
              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    name="debristLocationRadio"
                    className="radio radio-xs radio-info"
                    value="On the beach BELOW the high wash of the waves"
                  />
                  <span className="label-text ml-2 text-primary">
                    On the beach BELOW the high wash of the waves
                  </span>
                </div>
              </label>
              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    name="debristLocationRadio"
                    className="radio radio-xs radio-info"
                    value="On the beach ABOVE the high wash of the waves"
                  />
                  <span className="label-text ml-2 text-primary">
                    On the beach ABOVE the high wash of the waves
                  </span>
                </div>
              </label>

              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    name="debristLocationRadio"
                    className="radio radio-xs radio-info"
                    value="None of the above, a description follows below"
                  />
                  <span className="label-text ml-2 text-primary">
                    None of the above, a description follows below
                  </span>
                </div>
              </label>
            </div>
            {debrisRelativeLocation.includes("sea") ||
            debrisRelativeLocation.includes("None") ? (
                <span>
                  <p className="text-primary mt-4 mb-4 max-w-2xl">
                    <b>
                    Please provide a position description and any information on
                    currents and winds that could help in relocating the debris.
                    </b>
                  </p>
                  <input
                    type="text"
                    className="input input-bordered bg-white text-primary mb-2 w-full"
                    onChange={(event) =>
                      setDebrisLocationDetails(event.target.value)
                    }
                    value={debrisLocationDetails}
                  />
                </span>
              ) : (
                ""
              )}
            <div className="grid flex-grow card rounded-box">
              <div className="mt-4">
                <ClickableMap setCoordinates={setCoordinates} />
              </div>
            </div>
          </div>

          {/* 3rd section */}
          <div className="pt-2 mb-4 ">
            <p className="text-primary mt-4 mb-4">
              <b>3) THE DEBRIS IS BEST DESCRIBED AS:*</b>
            </p>

            <div
              className="form-control"
              onChange={(event) => setDebrisTrappedDesc(event.target.value)}
            >
              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    name="debrisDescRadio"
                    className="radio radio-info radio-xs"
                    value="Caught on the reef or is partially buried in sand"
                    defaultChecked
                  />
                  <span className="label-text ml-2 text-primary">
                    Caught on the reef or is partially buried in sand
                  </span>
                </div>
              </label>

              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    name="debrisDescRadio"
                    className="radio radio-info radio-xs"
                    value="Loose in the shore break or on the shoreline and could go back out to sea"
                  />
                  <span className="label-text ml-2 text-primary">
                    Loose in the shore break or on the shoreline and could go back
                    out to sea
                  </span>
                </div>
              </label>

              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    name="debrisDescRadio"
                    className="radio radio-info radio-xs"
                    value="Trapped in a tide pool and cannot escape"
                  />
                  <span className="label-text ml-2 text-primary">
                    Trapped in a tide pool and cannot escape
                  </span>
                </div>
              </label>

              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    name="debrisDescRadio"
                    className="radio radio-info radio-xs"
                    value="Loose on the shore but caught in the vegetation line"
                  />
                  <span className="label-text ml-2 text-primary">
                    Loose on the shore but caught in the vegetation line
                  </span>
                </div>
              </label>

              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    name="debrisDescRadio"
                    className="radio radio-info radio-xs"
                    value="Tied to a fixed object so it cannot be swept away"
                  />
                  <span className="label-text ml-2 text-primary">
                    Tied to a fixed object so it cannot be swept away
                  </span>
                </div>
              </label>

              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    name="debrisDescRadio"
                    className="radio radio-info radio-xs"
                    value="Pushed inland above the high wash of the waves so it cannot be swept away"
                  />
                  <span className="label-text ml-2 text-primary">
                    Pushed inland above the high wash of the waves so it cannot be
                    swept away
                  </span>
                </div>
              </label>

              <label className="label cursor-pointer">
                <div className="flex items-left">
                  <input
                    type="radio"
                    name="debrisDescRadio"
                    className="radio radio-xs radio-info"
                    value="Other"
                  />
                  <span className="label-text ml-2 text-primary">
                    Other - please explain how urgent recovery/removal is
                  </span>
                </div>
              </label>
            </div>

            <p className="text-primary mt-4 mb-4">
              <b>ENTER MY OWN DESCRIPTION</b>
            </p>
            <input
              className="input input-bordered w-full bg-white text-primary mb-2"
              onChange={(event) => setDebrisTrappedOther(event.target.value)}
              value={debrisTrappedOther}
              placeholder="Optional"
            />

            <p className="text-primary mt-4 mb-4">
              <b>
                IF YOU CAN TAKE A PHOTOGRAPH, PLEASE TURN ON YOUR DEVICE&apos;S
                LOCATION FIRST
              </b>
            </p>

            <div>
              <Dropzone
                onDrop={(acceptedFiles) => {
                  setFiles([...files, acceptedFiles[0]]);
                  setImageURLArray([
                    ...imageURLArray,
                    URL.createObjectURL(acceptedFiles[0]),
                  ]);
                }}
                accept={{ "image/*": [".png", ".jpg"] }}
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div
                      {...getRootProps()}
                      className="h-36 bg-gray-200 text-slate-500 rounded-lg"
                    >
                      <input {...getInputProps()} />
                      <div className="text-center">
                        <svg
                          className="mx-auto h-38 w-20 text-gray-300"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="flex w-120 justify-center items-center text-sm leading-6 text-primary">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload an Image</span>
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-primary">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    </div>
                  </section>
                )}
              </Dropzone>
              <br />
              {imageURLArray.length > 0 && (
                <div className="w-full flex justify-center py-3 bg-gray-200 rounded-lg">
                  {imageURLArray.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt=""
                      className="self-center"
                      width="300px"
                      height="240px"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="divider" />
          {/* 4th section */}
          <div className="">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-row">
                <p className="text-primary">
                  <b>Last Name*</b>
                </p>
                <input
                  className="input input-bordered bg-white text-primary w-full"
                  onChange={(event) => setLastName(event.target.value)}
                  value={lastName}
                  maxLength={30}
                />
              </div>
              <div className="flex-row">
                <p className="text-primary">
                  <b>First Name*</b>
                </p>
                <input
                  className="input input-bordered bg-white text-primary w-full"
                  onChange={(event) => setFirstName(event.target.value)}
                  value={firstName}
                  maxLength={30}
                />
              </div>

              <div className="flex-row">
                <p className="text-primary">
                  <b>Phone Number*</b>
                </p>
                <input
                  placeholder="Ex: 808-395-9511"
                  className="input input-bordered bg-white text-primary w-full"
                  onChange={(event) => {
                    setPhoneNumber(event.target.value);
                  }}
                  value={phoneNumber}
                  type={"tel"}
                />
                {!validPhone(phoneNumber) && phoneNumber?.length > 0 && (
                  <p className="text-red-500 mb-2 text-sm">
                    Please enter a valid phone number
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 py-3">
              <div className="flex-row">
                <p className="text-primary">
                  <b>E-mail Address*</b>
                </p>
                <input
                  className="input input-bordered bg-white text-primary mb-1 w-full"
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                />
                {!validEmail(email) && email?.length > 0 && (
                  <p className="text-red-500 mb-2 text-sm">
                    Please enter a valid email address
                  </p>
                )}
              </div>
              <div className="flex-row">
                <p className="text-primary">
                  <b>Confirm E-mail Address*</b>
                </p>
                <input
                  className="input input-bordered bg-white text-primary mb-1 w-full"
                  onChange={(event) => setConfirmEmail(event.target.value)}
                  value={confirmEmail}
                />
                {email !== confirmEmail && confirmEmail?.length > 0 && (
                  <p className="text-red-500 mb-2 text-sm">
                    Email addresses must match
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="btn btn-primary w-full md:w-32"
              onClick={submitForm}
            >
              Submit
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ReportForm;
