import { prisma } from "./prisma";

export async function logAudit(params: {
  userId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
}): Promise<void> {
  await prisma.auditLog.create({ data: params });
}
