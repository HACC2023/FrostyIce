import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AdjustmentsHorizontalIcon, CheckIcon } from "@heroicons/react/20/solid";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline"
import { prettyHstDate, prettyHstDateTime } from "@/utils/dateConverter";
import Container from "@/components/Container";
import OrgChart from "@/components/home/orgChart";
import Loading from "@/components/Loading";

const Home = () => {
  const [reportedEvents, setReportedEvents] = useState(null);
  const [orgEventNumbers, setOrgEventNumbers] = useState(null);
  const [orgKgRemoved, setOrgKgRemoved] = useState(null);
  const [orgLastRemovalDate, setOrgLastRemovalDate] = useState(null);
  const [orgRemovalsThisMonth, setOrgRemovalsThisMonth] = useState(null);
  const [chartData, setChartData] = useState(null);

  const { data: session } = useSession();

  useEffect(() => {
    const getReportedEvents = async () => {
      const res = await fetch('/api/mongo/event/status/Reported');
      const data = await res.json();
      const sorted = data.sort(
        (a, b) => new Date(b.reportedDate) - new Date(a.reportedDate),
      );
      setReportedEvents(sorted);
    };
    const getOrgEventNumbers = async () => {
      const res = await fetch(`/api/mongo/event/removal-org-id/${session?.user.orgId}`);
      const data = await res.json();
      const counts = { removalAndStorage: 0, sorting: 0, disposal: 0, complete: 0 };
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const tempChartData = {
        labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
        datasets: [
          {
            label: "KG removed",
            data: [0,0,0,0,0,0],
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)"
          },
          {
            label: "Number Removals",
            data: [0,0,0,0,0,0],
            fill: false,
            borderColor: "#742774"
          }
        ]
      };
      let mostRecentRemovalDate = new Date('2000-01-01');
      let kgRemoved = 0;
      for (const event of data) {
        const eventRemovalDate = new Date(event.removalEndDate);
        // get total kg that org has removed
        kgRemoved += event.debrisMass ? event.debrisMass : 0;

        // get most recent removal date
        if (event.removalEndDate && eventRemovalDate > mostRecentRemovalDate) {
          mostRecentRemovalDate = eventRemovalDate;
        }

        // add to chart data
        if (eventRemovalDate.getFullYear() === thisYear) {
          const month = eventRemovalDate.getMonth();
          if (month === thisMonth) {
            tempChartData.datasets[0].data[5] += event.debrisMass ? event.debrisMass : 0;
            tempChartData.datasets[1].data[5]++;
          } else if (month === thisMonth - 1) {
            tempChartData.datasets[0].data[4] += event.debrisMass ? event.debrisMass : 0;
            tempChartData.datasets[1].data[4]++;
          } else if (month === thisMonth - 2) {
            tempChartData.datasets[0].data[3] += event.debrisMass ? event.debrisMass : 0;
            tempChartData.datasets[1].data[3]++;
          } else if (month === thisMonth - 3) {
            tempChartData.datasets[0].data[2] += event.debrisMass ? event.debrisMass : 0;
            tempChartData.datasets[1].data[2]++;
          } else if (month === thisMonth - 4) {
            tempChartData.datasets[0].data[1] += event.debrisMass ? event.debrisMass : 0;
            tempChartData.datasets[1].data[1]++;
          } else if (month === thisMonth - 5) {
            tempChartData.datasets[0].data[0] += event.debrisMass ? event.debrisMass : 0;
            tempChartData.datasets[1].data[0]++;
          }
        }

        // get current event numbers
        switch (event.status) {
        case 'Removal and Storage':
          counts.removalAndStorage++;
          break;
        case 'Sorting':
          counts.sorting++;
          break;
        case 'Disposal':
          counts.disposal++;
          break;
        case 'Complete':
          counts.complete++;
          break;
        }
      }
      setOrgEventNumbers(counts);
      setOrgLastRemovalDate(mostRecentRemovalDate);
      setOrgKgRemoved(kgRemoved);
      setOrgRemovalsThisMonth(tempChartData.datasets[1].data[5]);
      setChartData(tempChartData);
    };
    if (!reportedEvents) {
      getReportedEvents();
    }
    if (session && !orgEventNumbers) {
      getOrgEventNumbers();
    }
  }, [session]);

  return (
    <Container>
      <header className="mb-2">
        <h1 className="text-3xl md:text-[2.75rem] font-bold mb-2">
          Welcome to Makai
        </h1>
        <p>
          CMDR&apos;s AI-assisted platform that manages marine debris
          reports, dispatches, and documentation
        </p>
      </header>
      <header className="text-center">
        <h2 className="text-3xl font-bold">
          {session ? session.user.orgName : ''}
        </h2>
      </header>
      <div className="flex border rounded-xl bg-base-200 py-4 flex-col md:flex-row">
        <section className="ms-2 text-center w-full">
          <header className="text-center">
            <h2 className="text-lg md:text-xl font-bold w-full">
              Organization Statistics
            </h2>
          </header>
          <div className="flex flex-col p-3 rounded-xl">
            <div className="text-4xl font-bold mt-2">{orgKgRemoved ? orgKgRemoved : '0'} KG</div>
            <div>Debris removed from environment</div>
            {chartData ? <OrgChart data={chartData} className="mt-3" /> : <div className="mt-5"><Loading /></div>}
            <div className="flex mt-4 justify-center w-full">
              <div className="w-full">
                <div className="text-xl font-bold">{orgLastRemovalDate ? prettyHstDate(orgLastRemovalDate) : '...'}</div>
                <div>Last debris removal date</div>
              </div>
              <div className="w-full">
                <div className="text-xl font-bold">{orgRemovalsThisMonth ? orgRemovalsThisMonth : 0}</div>
                <div>Removal{orgRemovalsThisMonth && orgRemovalsThisMonth !== 1 ? 's' : ''} this month</div>
              </div>
            </div>
          </div>
        </section>
        <section className="me-2 min-w-fit expanded">
          <Link
            href="/events?organization=true"
            className="hover:brightness-150 transition-all"
          >
            <header className="pb-2 text-center">
              <h2 className="text-lg md:text-xl font-bold">
                Organization Events
              </h2>
            </header>
          </Link>
          <div className="flex flex-col gap-2 p-3 rounded-xl flex-grow">
            <Link
              href="/events?organization=true&status=Removal+and+Storage"
              className="hover:brightness-150 transition-all"
            >
              <div className="card card-bordered bg-base-100">
                <div className="card-body p-4">
                  <div className="flex justify-between font-semibold text-md md:text-lg me-2">
                    <div className="flex">
                      <ArchiveBoxArrowDownIcon className="w-5 h-5 mt-1 me-2" />
                      <h2 className="font-bold text-md md:text-xl me-5">
                        Removal & Storage
                      </h2>
                    </div>
                    {orgEventNumbers ? orgEventNumbers.removalAndStorage : 0}
                  </div>
                </div>
              </div>
            </Link>
            <Link
              href="/events?organization=true&status=Sorting"
              className="hover:brightness-150 transition-all"
            >
              <div className="card card-bordered bg-base-100">
                <div className="card-body p-4">
                  <div className="flex justify-between font-semibold text-md md:text-lg me-2">
                    <div className="flex">
                      <AdjustmentsHorizontalIcon className="w-5 h-5 mt-1 me-2" />
                      <h2 className="font-bold text-md md:text-xl">
                      Sorting
                      </h2>
                    </div>
                    {orgEventNumbers ? orgEventNumbers.sorting : 0}
                  </div>
                </div>
              </div>
            </Link>
            <Link
              href="/events?organization=true&status=Disposal"
              className="hover:brightness-150 transition-all"
            >
              <div className="card card-bordered bg-base-100">
                <div className="card-body p-4">
                  <div className="flex justify-between font-semibold text-md md:text-lg me-2">
                    <div className="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2 mt-1" viewBox="0 0 16 16">
                        <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242-2.532-4.431zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24l2.552-4.467zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.498.498 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244l-1.716-3.004z"/>
                      </svg>
                      <h2 className="font-bold text-md md:text-xl">
                      Disposal
                      </h2>
                    </div>
                    {orgEventNumbers ? orgEventNumbers.disposal : 0}
                  </div>
                </div>
              </div>
            </Link>
            <Link
              href="/events?organization=true&status=Complete"
              className="hover:brightness-150 transition-all"
            >
              <div className="card card-bordered bg-base-100">
                <div className="card-body p-4">
                  <div className="flex justify-between font-semibold text-md md:text-lg me-2">
                    <div className="flex">
                      <CheckIcon className="w-5 h-5 mt-1 me-2" />
                      <h2 className="font-bold text-md md:text-xl">
                      Complete
                      </h2>
                    </div>
                    {orgEventNumbers ? orgEventNumbers.complete : 0}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
      <section className=" me-2">
        <Link
          href="/events?status=Reported"
          className="hover:opacity-80 transition-all"
        >
          <header className="flex p-2 justify-center my-2">
            {reportedEvents && reportedEvents.length
              ? <div className="bg-red-600 rounded-full w-10 h-10 mt-[-5px] text-white text-xl align-middle flex">
                <div className="h-min m-auto pb-px font-semibold">{reportedEvents.length}</div>
              </div>
              : <h2 className="text-xl md:text-2xl font-bold ms-2">No</h2>
            }
            <h2 className="text-xl md:text-2xl font-bold ms-2">
              New Debris Reports
            </h2>
          </header>
        </Link>
        <div className="flex flex-col gap-3 p-3 border rounded-xl bg-base-200 min-h-[100px] max-h-full overflow-auto">
          {reportedEvents
            ? reportedEvents.map((event) => (
              <div key={event._id} className="card card-bordered bg-base-100">
                <div className="card-body p-4">
                  <div className="flex justify-between">
                    <div>
                      <Link
                        href={`/event/${event._id}`}
                        className="flex cursor-pointer hover:text-cyan-700">
                        <h2 className="text-md md:text-xl font-bold">
                          {event.closestIsland || "Other"} : {event.publicType}
                        </h2>
                      </Link>
                      <p className="text-sm md:text-md">
                        <time className="my-3">
                          {prettyHstDateTime(event.reportedDate)}
                        </time>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
            : ''
          }
        </div>
      </section>
    </Container>
  );
};

export default Home;
