import {signOut, useSession} from "next-auth/react";
import {
  HomeIcon,
  PlusCircleIcon,
  ChartPieIcon,
  RectangleGroupIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/router";

const SideNavbar = () => {
  const { data: session, status } = useSession();

  const orgMemberNav = [
    { label: "Home", icon: HomeIcon, link: "/home" },
    { label: "Report Debris", icon: PlusCircleIcon, link: "/report" },
    { label: "Data Insights", icon: ChartPieIcon, link: "/data-insights" },
    { label: "Events", icon: RectangleGroupIcon, link: "/events?organization=true" },
  ];

  const orgAdminNav = [
    ...orgMemberNav,
    {
      label: "Manage Organization",
      icon: BuildingOfficeIcon,
      link: "/organization",
    },
  ];

  const adminNav = [
    ...orgAdminNav,
    {
      label: "Admin",
      icon: BuildingOffice2Icon,
      link: "/admin",
    },
  ];

  const NavContainer = () => (
    <ul
      className="menu p-5 w-72 min-h-screen sticky top-0 pt-10 font-medium text-white backdrop-blur-3xl bg-sky-950 bg-opacity-30 lg:bg-opacity-0"
    >
      {!session && <NavContent nav={publicNav} />}
      {session && session.user.role === "org_member" && <NavContent nav={orgMemberNav} />}
      {session && session.user.role === "org_admin" && <NavContent nav={orgAdminNav} />}
      {session && session.user.role === "admin" && <NavContent nav={adminNav} />}
      {session && <div className="divider m-0" />}
      {session && <li className="m-1">
        <button
          className="hover:text-white focus:text-white relative"
          onClick={() => document.getElementById('signOutModal').showModal()}
        >
          <ArrowLeftCircleIcon height={20} />
          <span>Sign out</span>
        </button>
      </li>}
    </ul>
  );

  const router = useRouter();

  const isLinkActive = (href) => {
    return router.pathname === href.split('?')[0];
  };

  const AccountInfo = () => (
    <>
      {session ? (
        <div className="flex gap-4 m-4">
          <div className="avatar placeholder h-fit">
            <div className="bg-gray-300 text-neutral-content rounded-full w-14">
              <span className="text-2xl">{session.user.firstName.charAt(0)}</span>
              <span className="text-2xl">{session.user.lastName.charAt(0)}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="font-bold">
              {session.user.firstName} {session.user.lastName}
            </div>
            <div className="text-xs">{session.user.orgName}</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-5">
          <Link
            href={"/auth/credentials-signin"}
            className="rounded-full p-3 text-center bg-base-300 border-slate-800 border-solid"
          >
            Log in
          </Link>
        </div>
      )}
    </>
  );

  const NavContent = ({ nav }) => (
    <>
      <AccountInfo />
      {nav.map((navItem) => (
        <MenuItem
          key={navItem.label}
          label={navItem.label}
          icon={navItem.icon}
          link={navItem.link}
        />
      ))}
    </>
  );

  const MenuItem = ({ label, icon, link }) => {
    const IconElement = icon;
    const ICON_HEIGHT = 20;

    return (
      <li className="m-1">
        <Link
          href={link}
          className={`${
            isLinkActive(link) ? "font-semibold" : ""
          } hover:text-white focus:text-white relative`}
        >
          {icon && <IconElement height={ICON_HEIGHT} />}
          <div
            className={`absolute w-full h-full rounded-md opacity-20 ${
              isLinkActive(link) ? "bg-white" : ""
            }`}
          />
          <span>{label}</span>
        </Link>
      </li>
    );
  };

  return (
    session && (
      <>
        <div className="hidden lg:block w-min">{status !== "loading" && <NavContainer />}</div>
        <div className="drawer lg:hidden">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            {/* SideNavbar */}
            <div className="w-full navbar">
              <div className="flex-none lg:hidden">
                <label
                  htmlFor="my-drawer-3"
                  aria-label="open sidebar"
                  className="btn btn-square btn-ghost text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-6 h-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </label>
              </div>
            </div>
          </div>
          <div className="drawer-side z-10">
            <label
              htmlFor="my-drawer-3"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            {status !== "loading" && (
              <NavContainer />
            )}
          </div>
        </div>
        <dialog id="signOutModal" className="modal">
          <div className="modal-box bg-white max-w-lg">
            <h3 className="text-xl mb-4 font-semibold text-gray-700">
              Sign Out
            </h3>
            <div>
              Are you sure you want to sign out?
            </div>
            <div className="mt-4 flex justify-end">
              <form method="dialog">
                <button className="btn text-gray-900 bg-white hover:bg-gray-50 rounded-md px-4 py-2 font-semibold shadow-sm">
                  Cancel
                </button>
              </form>
              <button
                className="btn ml-3 text-white bg-red-600 hover:bg-red-500 transition-all rounded-md px-3 py-2 font-semibold shadow-sm"
                onClick={() => signOut({ callbackUrl: '/?signedout=true' })}
              >
                Sign out
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button className="cursor-default">close</button>
          </form>
        </dialog>
      </>
    )
  );
};

export default SideNavbar;
