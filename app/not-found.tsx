import { Button } from "@/components/ui/button";
import { LucideArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className='h-screen w-full flex flex-col items-center justify-center px-4'>
      <div className='text-center space-y-6'>
        {/* 404 Text */}
        <h1 className='text-7xl sm:text-8xl lg:text-9xl font-extrabold text-gray-900 dark:text-gray-100 tracking-widest'>
          404
        </h1>

        {/* Error Message */}
        <div className='space-y-2'>
          <h2 className='text-2xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-200'>
            Page Not Found
          </h2>
          <p className='text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto'>
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
            Please check the URL or go back to the homepage.
          </p>
        </div>

        {/* Back to Home Button */}
        <Button asChild size='lg' className='mt-8'>
          <Link href='/'>
            <LucideArrowLeft className='mr-2 h-4 w-4' />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
