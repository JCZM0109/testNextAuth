import NextAuth from "next-auth/next";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient(); //Initialize prisma client.


export const authOptions = {

    adapter: PrismaAdapter(prisma),
    providers: [

        CredentialsProvider({

            name: "credentials",
            credentials: {
                username: {label: "Username", type: "text", placeholder: "jsmith"},
                password: {label: "Password", type: "password"},
                email: {label: "Email", type: "email"}
            },

            async authorize(credentials) {

                //check to see if email and password are valid
                if (!credentials.email || !credentials.password) {
                    return null;
                };

                //check if user exists (findUnique from PRISMA)
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user) {
                    return null;
                };

                //check if passwords match (bcrypt's compare function, since we hashed it)
                const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

                if(!passwordMatch) {
                    return null;
                }

                //return user if everything is valid.

                return user;

            }
        })
    ],

    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST};