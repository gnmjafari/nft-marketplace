"use client";
import { FunctionComponent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "@/components/hooks/web3/useAccount";
import WalletBar from "./WalletBar";
import { useNetwork } from "@/components/hooks/web3/useNetwork";

const navigation = [
  { name: "Marketplace", href: "/", current: true },
  { name: "Create", href: "/nft/create", current: true },
];

const Navbar: FunctionComponent = () => {
  const pathname = usePathname();
  const { account } = useAccount();
  const { network } = useNetwork();
  console.log("network :", network);

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
        <a className="btn btn-ghost text-xl">Marketplace NFT</a>
        <div className=" hidden lg:flex">
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
      </div>

      <div className="navbar-end">
        {account.isInstalled && (
          <button className="btn btn-sm mx-2 ">
            <div className="badge badge-secondary">{network.data}</div>
            Is supported :
            <div className="badge badge-secondary">{`${network.isSupported}`}</div>
            {!network.isSupported && (
              <>
                Target :
                <div className="badge badge-secondary">
                  {network.targetNetwork}
                </div>
              </>
            )}
          </button>
        )}
        <WalletBar
          isLoading={account.isLoading}
          isInstalled={account.isInstalled}
          account={account.data}
          connect={account.connect}
        />
      </div>
    </div>
  );
};
export default Navbar;
