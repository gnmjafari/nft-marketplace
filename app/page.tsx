import { NextPage } from "next";
import RootLayout from "./layout";
import Navbar from "@/components/navbar/Navbar";

const page: NextPage = () => {
  return (
    <RootLayout>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
        <div>Hello world!</div>
      </div>
    </RootLayout>
  );
};

export default page;
