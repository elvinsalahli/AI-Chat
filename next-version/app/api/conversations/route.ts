import { createConversation, getConversations } from "../../../lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getConversations();
  return Response.json(data);
}

export async function POST() {
  const convo = await createConversation();

  revalidatePath("/");

  return Response.json(convo);
}