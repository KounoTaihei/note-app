import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from "next-auth/client";
import { CircularProgress } from '@material-ui/core';
import { PrismaClient } from '@prisma/client';
import { useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';

const Home: NextPage = () => {
  const [ session, loading ] = useSession();
  const router = useRouter();

  if(loading) {
    return <span className="text-center"><CircularProgress /></span>
  }

  const redirect = () => {
    if(session) {
      router.push('/notes');
    } else {
      router.push('/login');
    }
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}

export default Home

declare global {
  var prisma: PrismaClient;
}