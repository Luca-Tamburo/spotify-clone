// Imports
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import Image from "next/image";

// Styles
import spotifyWhiteLogo from '../../public/assets/Logo_White.png';
import '../../app/globals.css'

export default function SignIn({ providers }) {
    return (
        <div className="flex flex-col justify-center items-center text-center min-h-screen">
            <div className="w-1/3 flex justify-center items-center text-white bg-black rounded-lg shadow-lg">
                <div className="pt-12 pb-10 px-1.5">
                    <Image
                        src={spotifyWhiteLogo}
                        alt="Login spotify image"
                        width={160}
                        height={160}
                        className="mx-auto mb-8"
                    />
                    <p className="text-3xl font-bold mb-2">Sign up to continue.</p>
                    {Object.values(providers).map((provider) => (
                        <div key={provider.name} className="mb-8 text-white">
                            <button className="bg-spotify-green text-black font-bold py-3 px-36 mt-6 rounded-full" onClick={() => signIn(provider.id)}>Sign in</button>
                        </div>
                    ))}
                    <p className=" text-spotify-light-gray font-bold mt-6">Don&rsquo;t you have an account?&nbsp;
                        <a href="https://www.spotify.com/it/signup?forward_url=https%3A%2F%2Fopen.spotify.com%2F" target="_blank" rel="noopener noreferrer" className="mt-4 mr-8 font-bold text-white underline ">JOIN US</a>
                    </p>
                </div>
            </div>
        </div>
    );
}


export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);

    // If the user is already logged in, redirect.
    if (session) {
        return { redirect: { destination: "/" } };
    }

    const providers = await getProviders();

    return {
        props: { providers: providers ?? [] },
    }
}