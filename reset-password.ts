import bcrypt from "bcryptjs";
import { prisma } from "./src/lib/prisma"; // تأكد من وجود هذا الملف

async function resetPassword() {
  const email = "abdullahemam48@gmail.com";
  const newPassword = "password123456"; // غيرها بما تريد

  const passwordHash = await bcrypt.hash(newPassword, 12);
  
  const user = await prisma.adminUser.update({
    where: { email },
    data: { passwordHash },
  });
  
  console.log(`✅ تم تحديث كلمة المرور للمستخدم: ${user.email}`);
  console.log(`🔑 كلمة المرور الجديدة: ${newPassword}`);
}

resetPassword().catch(console.error);