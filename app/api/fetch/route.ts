/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const fetchUrl = searchParams.get("fetchUrl");

  try {
    const fetchRes = await fetch(fetchUrl as string);
    const data = await fetchRes.json();
    return Response.json(data, { status: 200 });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 422 });
  }
}
