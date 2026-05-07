import { deleteConversation } from '../../../../lib/db';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  await deleteConversation(Number(id));

  revalidatePath('/');

  return Response.json({ success: true });
}
