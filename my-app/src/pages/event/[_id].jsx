import Disposal from "@/components/events/Disposal";
import EventRemoval from "@/components/events/EventReported";
import ProgressBar from "@/components/events/ProgressBar";
import RemovalAndStorage from "@/components/events/RemovalAndStorage";
import Sorting from "@/components/events/Sorting";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const EventPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const _id = router.query._id;

  const { data } = useSWR(
    _id ? `/api/mongo/event/id/${_id}` : null,
    _id ? fetcher : null,
    { refreshInterval: 1000 }
  );

  useEffect(() => {
    if (loaded) return;
    if (data) {
      switch (data.status) {
      case "Removal and Storage":
        setCurrentStep(1);
        break;
      case "Sorting":
        setCurrentStep(2);
        break;
      case "Disposal":
        setCurrentStep(3);
        break;
      case "Complete":
        setCurrentStep(4);
        break;
      default:
        setCurrentStep(0);
      }
      setLoaded(true);
    }
  }, [data]);

  if (data && session) {
    return (
      <Container>
        <div className="w-full min-h-full flex justify-center">
          <div className="min-h-screen p-5 w-full md:max-w-7xl flex flex-col gap-5">
            <ProgressBar
              status={data.status}
              setCurrentChecked={setCurrentStep}
            />
            <Link href={`/thread/${data.threadId}`} className="btn btn-primary w-56 self-center mb-5">
              <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
              Discussion
            </Link>
            <div className="flex flex-col gap-2">
              <EventRemoval
                event={data}
                checked={currentStep === 0}
                setCurrentChecked={setCurrentStep}
              />
              <RemovalAndStorage
                event={data}
                userOrgId={session?.user.orgId}
                checked={currentStep === 1}
                setCurrentChecked={setCurrentStep}
              />
              <Sorting
                event={data}
                userOrgId={session?.user.orgId}
                checked={currentStep === 2}
                setCurrentChecked={setCurrentStep}
              />
              <Disposal
                event={data}
                userOrgId={session?.user.orgId}
                checked={currentStep === 3}
                setCurrentChecked={setCurrentStep}
              />
            </div>
          </div>
        </div>
      </Container>
    );
  }
};

export default EventPage;
