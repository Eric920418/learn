import NextAuth from "next-auth";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return {
    adapter: NeonAdapter(pool),
    providers: [
      // 在這裡添加你的 OAuth providers
      // 例如：Google, GitHub 等
    ],
  };
});
