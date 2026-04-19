import { deleteConversation } from "../../../../lib/db";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await deleteConversation(Number(params.id));
  revalidatePath("/");
  return Response.json({ success: true });
}