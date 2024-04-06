/* eslint-disable @next/next/no-img-element */
"use client";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./CreateFrame.css";
import { CollectiveItem, FrameWithZoraUrl } from "@/types";
import DragNdropFile from "./DragNdropFile";
import { Auth } from "@/utils/cookie-auth";
import CopyFrameModal from "./CopyModal";
import { useRouter } from "next/navigation";

export default function CreateFrame() {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [loadingCollectives, setLoadingCollectives] = useState<boolean>(true);
  const [collectives, setCollectives] = useState<CollectiveItem[]>([]);
  const [imageFile, setImagefile] = useState<File>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [collective, setCollective] = useState<number>(0);
  const [frameData, setFrameData] = useState<FrameWithZoraUrl | null>(null);
  const router = useRouter();

  const handleFileChange = (file?: File) => {
    setImagefile(file);
  };

  const handleRemove = () => {
    setImagefile(undefined);
  };
  console.log(collective, "selected coll");
  const handleCollectiveChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      const option = Number(e.target.value);
      if (option > 0) {
        setCollective(option);
      }
    } else {
      setCollective(0);
    }
  };

  const handleNameChange = (e: FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value || "");
  };

  const handleDescriptionChange = (e: FormEvent<HTMLTextAreaElement>) => {
    setDescription(e.currentTarget.value || "");
  };

  const handleSave = async () => {
    if (formIsValid) {
      setIsSaving(true);
      try {
        const formData = new FormData();
        formData.set("name", name);
        formData.set("description", description);
        formData.set("imageFile", imageFile!);
        formData.set("createdBy", Auth.getUser.userFid);
        formData.set("collectiveId", collective.toString());

        console.log(formData, "what is form data???", typeof formData);
        const response = await fetch("/api/frames", {
          method: "POST",
          body: formData,
        });

        const _frameData = await response.json();
        console.log("Frame data from POST req:", _frameData);
        setFrameData(_frameData);
        router.push(`share/${_frameData.frame.id}`);
      } catch (error) {
        console.error({ error });
      } finally {
        setIsSaving(false);
      }
    } else {
      console.log("form invalid");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoadingCollectives(true);
      try {
        const response = await fetch("/api/collectives");
        const data = await response.json();
        setCollectives(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCollectives(false);
      }
    };
    loadData();
  }, []);

  const formIsValid = useMemo(() => {
    if (imageFile && collective && collective > 0 && name) {
      return true;
    }
    return false;
  }, [imageFile, collective, name]);

  return (
    <div className="flex flex-col mt-8 bg-violet-50 p-3 rounded-[10px] text-black">
      <div className="flex flex-1 items-center">
        <b className="text-lg mr-3">1</b>
        Choose your meme
      </div>
      <div className="mt-1">
        Share this frame link and encourage others to mint your meme. More mints
        = more hype and profits for you and your community
      </div>
      <>
        <div className="flex w-full mt-5">
          <div className="flex flex-col flex-1">
            <div className="flex flex-col">
              <div className="flex mb-2 text-black">Your meme</div>
              <DragNdropFile
                onFileSelected={handleFileChange}
                file={imageFile}
              />
              <div className="flex justify-between">
                <div className="text-gray-400">Max 5MB (JPG, JPEG, PNG)</div>
                {imageFile && (
                  <div
                    className="text-purple-500 cursor-pointer"
                    onClick={handleRemove}
                  >
                    Remove
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col mt-6">
              <input
                type="text"
                onInput={handleNameChange}
                value={name}
                className="p-2 h-50 border border-purple-500 focus:outline-none focus:ring-0"
                placeholder="Name your Meme*"
              />
            </div>
            <div className="flex mt-6">
              <div className="flex flex-col w-full">
                <div className="flex mb-2 text-black">
                  Who shares your mint profits?
                </div>
                <select
                  value={collective}
                  onChange={handleCollectiveChange}
                  className="w-full p-2 border border-purple-500 focus:outline-none focus:ring-0"
                >
                  <option value="">
                    {loadingCollectives ? "Loading..." : "Select community..."}
                  </option>
                  {collectives.map((collective: CollectiveItem) => (
                    <option key={collective.id} value={collective.id}>
                      {collective.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-1">
            <div className="flex flex-col mt-8 ml-12 w-full">
              <textarea
                onInput={handleDescriptionChange}
                value={description}
                disabled={description.length > 255}
                placeholder="Enter description..."
                className="description mb-3 p-2 text-xs h-50 border border-purple-500 focus:outline-none focus:ring-0"
              ></textarea>
              <div className="text-gray-400 flex justify-end">
                <b>{description.length}</b>/255
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-12">
          <button
            onClick={handleSave}
            style={{ width: 300 }}
            disabled={!formIsValid}
            className="rounded-full px-4 py-2 bg-purple-500 disabled:opacity-75 text-white focus:outline-none focus:ring-0"
          >
            {isSaving ? "Saving..." : "Save my Meme"}
          </button>
        </div>
      </>
    </div>
  );
}
