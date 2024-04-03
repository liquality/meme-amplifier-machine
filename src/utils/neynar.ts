
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { Auth } from "./cookie-auth";
import { toast } from "react-toastify";



//This file handles all read and write using Neynar Client sdk
const client = new NeynarAPIClient(process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || "");

export const writeCast = (text: string) => {
    if (text) {
        client.publishCast(Auth.getUser.signerUuid, text,)
    } else toast("Cast needs to minimum 1 charachter")
};
