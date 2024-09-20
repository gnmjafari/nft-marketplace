"use client";
import { FunctionComponent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "@/components/hooks/web3/useAccount";

const navigation = [
  { name: "Marketplace", href: "/", current: true },
  { name: "Create", href: "/nft/create", current: true },
];

const Navbar: FunctionComponent = () => {
  const pathname = usePathname();
  const { account } = useAccount();

  console.log("account:", account);

  return (
    <div className="navbar bg-gray-800">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {navigation.map((menu, key) => {
              return (
                <li key={key}>
                  <Link href={menu.href}>{menu.name}</Link>
                </li>
              );
            })}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-3">
          {navigation.map((menu, key) => {
            return (
              <li
                key={key}
                className={`${
                  pathname === menu.href
                    ? "bg-gray-900 rounded-lg text-indigo-600  font-bold"
                    : "bg-transparent"
                }`}
              >
                <Link href={menu.href}>{menu.name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="navbar-end">
        <button
          onClick={() => {
            account.connect();
          }}
          className="btn btn-sm btn-accent"
        >
          Connect Wallet
        </button>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/profile" className="justify-between">
                Profile
                <span className="badge">connected</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
