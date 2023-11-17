import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import Loading from "@/components/Loading";
import { prettyHstDateTime } from "@/utils/dateConverter";
import Container from "@/components/Container";
import Link from "next/link";

function getStatusColor(status) {
  const statusColors = {
    Reported: "bg-yellow-600",
    "Removal and Storage": "bg-blue-800",
    Sorting: "bg-orange-600",
    Disposal: "bg-purple-700",
    Complete: "bg-green-700",
  };

  return statusColors[status] || "bg-gray-500";
}

const InfoItem = ({ label }) => {
  return <div className="bg-gray-300 text-gray-800 px-6 py-1 rounded-full text-xs">{label}</div>;
};

const ThreadPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const _id = router.query._id;

  const { data: thread, error } = useSWR(`/api/mongo/thread/id/${_id}`, fetcher, {
    refreshInterval: 100,
  });
  if (error) return <Container><div className="my-auto text-center">Failed to load</div></Container>;
  if (!thread) return <Container><Loading class="h-full py-auto"/></Container>;

  const handleSubmit = async (e, threadId) => {
    e.preventDefault();

    const content = e.target[0].value;

    if (!content) {
      return;
    }

    e.target[0].value = ""; // reset input field

    const authorName = `${session.user.firstName} ${session.user.lastName}`;
    const authorEmail = session.user.email;
    const authorOrganization = session.user.orgName;
    const timestamp = new Date().toISOString();

    try {
      const response = await fetch(`/api/mongo/thread/send-message/${threadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            authorName,
            authorEmail,
            authorOrganization,
            content,
            timestamp,
          },
        }),
      });
    } catch (error) {
      console.error("Error sending data to API:", error);
    }
  };

  const ChatItem = ({ message }) => {

    const getAbbreviation = (name) => {
      const names = name.split(" ");
      if (names.length === 1) {
        return name.slice(0, 2).toUpperCase();
      }
      return names[0][0] + names[names.length - 1][0];
    };

    return (
      <div className="my-4 mx-4">
        <div className="flex gap-2 mb-2 justify-between">
          <div className="flex gap-4">
            <div className="avatar placeholder">
              <div className="bg-gray-200 rounded-full w-14 h-min">
                <span className="text-lg font-semibold">{getAbbreviation(message.authorName)}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-semibold">{message.authorName}</div>
              <div className="text-xs text-gray-500">{message.authorOrganization}</div>
              <div className="mt-1">{message.content}</div>
            </div>
          </div>

          <time className="text-xs opacity-50">{prettyHstDateTime(message.timestamp)}</time>
        </div>
      </div>
    );
  };

  const MessagesContainer = ({ messages }) => {
    if (!messages) {
      return <Loading />;
    }
    return (
      <div className="border p-5 rounded-lg bg-base-200">
        <h2 className="text-xl font-semibold mb-2">Messages</h2>

        {messages.length ? (
          <div className="max-h-[500px] bg-neutral rounded-t-xl p-3 border border-b-0 overflow-auto flex flex-col-reverse">
            <div className="flex flex-col">
              {messages.map((message, index) => (
                <ChatItem key={index} message={message}></ChatItem>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-4">There are currently no messages</div>
        )}

        <form onSubmit={(e) => handleSubmit(e, _id)} className="w-full">
          <div className="join w-full">
            <input
              type="text"
              placeholder="Enter your message here..."
              className="input input-bordered w-full rounded-r-none rounded-t-none"
            />
            <input
              type="submit"
              value="Post"
              className="btn btn-primary rounded-l-none rounded-t-none"
            />
          </div>
        </form>
      </div>
    );
  };

  const EventInfo = ({ thread }) => {
    const { data: event, error } = useSWR(`/api/mongo/event/id/${thread.eventId}`, fetcher);
    if (error) return <div>failed to load</div>;
    if (!event) return <Loading />;

    return (
      <div className="bg-base-100 py-8 relative border px-6 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Event Info</h2>
          <Link
            href={`/event/${event._id}`}
            className="flex gap-1 pr-2 justify-center items-center text-sm underline text-secondary"
          >
            Go to event &rarr;
          </Link>
        </div>
        <div className="relative">
          <div
            className={`${getStatusColor(
              event.status
            )} rounded-full px-2.5 py-0.5 text-sm font-semibold text-white md:absolute ml-auto mb-3 md:mb-0 top-4 right-2 w-fit`}
          >
            {event.status}
          </div>
          <div>{event.publicLocationDesc}</div>
          <div className="mb-3">
            {event.publicDebrisEnvDesc === "Other"
              ? event.publicDebrisEnvAdditionalDesc
              : event.publicDebrisEnvDesc}
          </div>
          <div className="flex gap-2 flex-wrap">
            <InfoItem label={prettyHstDateTime(event.reportedDate)}></InfoItem>
            <InfoItem label={event.closestIsland}></InfoItem>
          </div>
        </div>
      </div>
    );
  };

  if (session) {
    return (
      <Container>
        <div className="m-auto w-full min-h-screen">
          <h1 className="text-4xl font-semibold mb-8">Discussion</h1>
          <main className="flex flex-col gap-16">
            <EventInfo thread={thread} />
            <MessagesContainer messages={thread.messages} />
          </main>
        </div>
      </Container>
    );
  }
};

export default ThreadPage;
