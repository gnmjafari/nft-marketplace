import { BaseLayout } from "@/components";
import { NextPage } from "next";

const NftCreate: NextPage = () => {
  return (
    <BaseLayout>
      <div className="w-full flex justify-center items-center gap-5">
        <div className="card  bg-base-100 w-1/2 shadow-xl gap-3 p-5">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Name</span>
            </div>
            <input
              type="text"
              placeholder="My NFT"
              className="input input-bordered w-full max-w-xs input-sm"
            />
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Description</span>
            </div>
            <textarea
              rows={2}
              className="textarea textarea-bordered h-12"
              placeholder="some NFT description..."
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Cover photo</span>
            </div>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs "
            />
          </label>
          <div className="flex justify-between items-center gap-5">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Health</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs input-sm"
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Attach</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs input-sm"
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Speed</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs input-sm"
              />
            </label>
          </div>
          <div className="flex items-center justify-between gap-5">
            <div className="form-control w-72">
              <label className="label cursor-pointer">
                <input
                  type="checkbox"
                  className="toggle toggle-accent"
                  defaultChecked
                />
                <span className="label-text">
                  Do you have meta data already ?
                </span>
              </label>
            </div>
            <button className="btn w-20 btn-primary ml-auto mt-2">Save</button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default NftCreate;
