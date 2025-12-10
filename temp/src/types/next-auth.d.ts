// src/types/next-auth.d.ts
import { type DefaultSession } from "next-auth";
import type { Role } from "@prisma/client"; // enum Role из Prisma

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role: Role;
  }
}
