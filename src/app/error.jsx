'use client';

import { useEffect } from 'react';
import { Text, Button } from '../app/components/ui/common';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <Text
        variant='h1' weight='bold'  align='center'
         className="mb-4">Something went wrong</Text>
        <Text 
        variant='h6' align='center' color='secondary'
        className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. An unexpected error has occurred.
        </Text>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
          variant='outline'
            onClick={() => reset()}
            className="py-5 px-8 cursor-pointer"
          >
            Try again
          </Button>
          <Button
            variant='default'
            as={Link}
            href="/dashboard"
            className="py-5 px-8 bg-indigo-700 hover:bg-indigo-500">

          <Link
            href="/"
            className=""
          >
            Go back home
          </Link>
          </Button>
        </div>
        <Text
        variant='small' align='center' color='secondary'
         className="mt-8 ">
          If the problem persists, please contact our support team.
        </Text>
      </div>
    </div>
  );
}