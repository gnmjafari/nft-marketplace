import Navbar from "../navbar";
import { FunctionComponent, ReactNode } from "react";

type props = {
  children: ReactNode;
};

const BaseLayout: FunctionComponent<props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="py-10 max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </>
  );
};

export default BaseLayout;
