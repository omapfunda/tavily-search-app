import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth/next";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

type AuthHandler = typeof handler;
export const GET: AuthHandler = handler;
export const POST: AuthHandler = handler;