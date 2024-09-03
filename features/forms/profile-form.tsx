"use client"

import { useState, useEffect, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { userService, UserProfile } from '@/services/userService'
import { useAuth } from '@/contexts/authContext';

const profileFormSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).max(30, { message: "Username must not be longer than 30 characters." }),
  full_name: z.string().max(100).optional(),
  website: z.string().url().optional(),
  bio: z.string().max(160).optional(),
  avatar_url: z.string().optional(),
  email: z.string().email().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const userToFormValues = (user: UserProfile): ProfileFormValues => ({
  username: user.username ?? '',
  full_name: user.full_name ?? user.user_metadata?.full_name ?? '',
  website: user.website ?? '',
  bio: user.bio ?? '',
  avatar_url: user.avatar_url ?? user.user_metadata?.avatar_url ?? '',
  email: user.email ?? '',
})

export function ProfileForm() {
  const { user, loading, error, setUser } = useAuth();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      full_name: '',
      website: '',
      bio: '',
      avatar_url: '',
      email: '',
    },
    mode: "onChange",
  })

  useEffect(() => {
    if (user) {
      const formValues = userToFormValues(user);
      Object.entries(formValues).forEach(([key, value]) => {
        form.setValue(key as keyof ProfileFormValues, value);
      });
    }
  }, [user, form]);

  console.log("ProfileForm render - loading:", loading, "user:", user, "error:", error);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user) {
    return <div>No user data available. Please log in.</div>;
  }

  async function onSubmit(data: ProfileFormValues) {
    if (user) {
      try {
        const changedFields = Object.entries(data).reduce((acc, [key, value]) => {
          if (value !== user[key as keyof UserProfile]) {
            acc[key as keyof UserProfile] = value;
          }
          return acc;
        }, {} as Partial<UserProfile>);

        if (Object.keys(changedFields).length === 0) {
          toast({
            title: "No changes",
            description: "No profile changes were detected.",
          });
          return;
        }

        const { data: updatedProfile, error } = await userService.updateUserProfile(changedFields);
        if (error) throw error;

        setUser({ ...user, ...changedFields });

        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
      } catch (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It must be at least 3 characters long.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} disabled />
              </FormControl>
              <FormDescription>
                Your email address is managed by your account settings.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description for your profile. Max 160 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  )
}
