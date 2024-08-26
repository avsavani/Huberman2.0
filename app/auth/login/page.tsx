'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FcGoogle } from 'react-icons/fc';
import Image from 'next/image';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      }
    };
    checkSession();
  }, [router, supabase.auth]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) throw error

      if (data.session) {
        router.push('/');
      }

      // If login is successful, redirect to home page or dashboard
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Login error:', error);
    }
  }

  async function handleGoogleSignIn() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Google sign-in error:', error);
    }
  }

  return (
    <div className="container mx-auto py-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-4xl flex rounded-lg shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2 p-8">
          <Card className="w-full border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account.
              </CardDescription>
            </CardHeader>
            {error && (
              <CardContent>
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </CardContent>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Sign in</Button>
                </CardFooter>
              </form>
            </Form>
            <CardContent>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button 
                onClick={handleGoogleSignIn} 
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <FcGoogle />
                Sign in with Google
              </Button>
            </CardContent>
            <CardFooter>
              <p className="text-center text-sm text-gray-500 w-full">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
        <div className="hidden lg:block lg:w-1/2">
          <Image
            src="/u5347314242_A_funny_and_cute_green_pea_pod_with_adorable_friend_e83f663f-c855-4fe9-b43b-4c4b47ef1aa2.png"
            alt="Cute green pea pod with adorable friend"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}