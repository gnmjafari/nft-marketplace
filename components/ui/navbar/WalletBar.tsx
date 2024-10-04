import Link from "next/link";
import React, { FunctionComponent } from "react";

type WalletBarProps = {
  isLoading: boolean;
  isInstalled: boolean;
  account: string | undefined;
  connect: () => void;
};

const WalletBar: FunctionComponent<WalletBarProps> = ({
  isLoading,
  isInstalled,
  account,
  connect,
}) => {
  if (isLoading) {
    return (
      <button className="btn btn-sm">
        <span className="loading loading-spinner"></span>
        loading
      </button>
    );
  }
  if (account) {
    return (
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img alt="Avatar" src="/images/Avatar.png" />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <Link href="/profile" className="justify-between">
              Profile
              <span className="badge">{`0x${account[2]}${account[3]}${
                account[4]
              }.....${account?.slice(-4)}`}</span>
            </Link>
          </li>
        </ul>
      </div>
    );
  }
  if (isInstalled) {
    return (
      <button
        onClick={() => {
          connect();
        }}
        className="btn btn-sm "
      >
        Connect Wallet
      </button>
    );
  } else {
    return (
      <button
        onClick={() => {
          window.open("https://metamask.io", "_blank");
        }}
        className="btn btn-sm btn-accent"
      >
        No Wallet
      </button>
    );
  }
};

export default WalletBar;
