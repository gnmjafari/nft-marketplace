import Navbar from "../navbar";
import { FunctionComponent, ReactNode } from "react";

type props = {
  children: ReactNode;
};

const BaseLayout: FunctionComponent<props> = ({ children }) => {
  return (
    <>
      <div className="pb-5 bg-gray-900 min-h-screen">
        <Navbar />
        <div className="pt-5 mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
};

export default BaseLayout;
