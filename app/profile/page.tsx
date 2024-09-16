import { BaseLayout } from "@ui";
import { NextPage } from "next";

const Profile: NextPage = () => {
  return (
    <BaseLayout>
      <div className="card p-10 flex-row justify-center items-start gap-20">
        <div className="w-2/3">
          <div className="pl-10 pb-5 text-2xl">Your NFTs</div>
          <div className="ml-10 mb-5 border-b-2 w-28 pb-2 border-indigo-700 text-indigo-700 cursor-pointer">
            Your Collection
          </div>
          <div className="pl-10 max-w-lg mx-auto  grid gap-5 lg:grid-cols-3 lg:max-w-none">
            <div className="card bg-base-100 w-52 shadow-xl">
              <figure>
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                  alt="Shoes"
                />
              </figure>
              <div className="card-body p-2">
                <h2 className="card-title">Shoes!</h2>
              </div>
            </div>
            <div className="card bg-base-100 w-52 shadow-xl">
              <figure>
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                  alt="Shoes"
                />
              </figure>
              <div className="card-body p-2">
                <h2 className="card-title">Shoes!</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/3">
          <div className="card bg-base-100 w-full shadow-xl">
            <figure>
              <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Shoes!</h2>
              <p>fierce violet</p>
              <h2 className="card-title">Information</h2>
              <div className="divider my-1" />
              <p>Attack:</p>
              <div className="divider my-1" />
              <p>Health</p>
              <div className="divider my-1" />
              <p>Speed</p>
              <div className="divider my-1" />
              <div className="flex justify-between items-center">
                <button className="btn btn-primary">Download Image</button>
                <button className="btn btn-outline btn-primary">
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Profile;
