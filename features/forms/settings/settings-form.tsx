"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useEffect, useCallback } from "react"
import { userService, ModelKey } from '@/services/userService'
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Toast } from "@/components/ui/toast"

const settingsFormSchema = z.object({
  matchCount: z.number().min(1).max(20),
  mode: z.enum(["search", "chat"]),
})

const newKeyFormSchema = z.object({
  provider: z.string().min(1, "Provider is required"),
  modelName: z.string().min(1, "Model name is required"),
  apiKey: z.string().min(1, "API Key is required"),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

const modelKeySchema = z.object({
  provider: z.string().min(1, "Provider is required"),
  modelName: z.string().min(1, "Model name is required"),
  apiKey: z.string().min(1, "API Key is required"),
})

export function SettingsForm() {
  const [modelKeys, setModelKeys] = useState<ModelKey[]>([])
  const [newModelKey, setNewModelKey] = useState({ provider: '', modelName: '', apiKey: '' })
  const [allowAdminChange, setAllowAdminChange] = useState(true)
  const [isAddKeyDialogOpen, setIsAddKeyDialogOpen] = useState(false)

  const newKeyForm = useForm<z.infer<typeof newKeyFormSchema>>({
    resolver: zodResolver(newKeyFormSchema),
    defaultValues: { provider: '', modelName: '', apiKey: '' },
  })
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: { matchCount: 5, mode: "chat" },
  })

  const loadSettings = useCallback(async () => {
    const settings = await userService.getUserSettings()
    if (settings) {
      form.reset({
        matchCount: settings.matchCount,
        mode: settings.mode,
      })
    }
  }, [form])

  useEffect(() => {
    loadSettings()
    loadModelKeys()
  }, [loadSettings])

  async function loadModelKeys() {
    try {
      const keys = await userService.getModelKeys()
      setModelKeys(keys)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load model keys.",
        variant: "destructive",
      })
    }
  }

  async function onSubmit(data: SettingsFormValues) {
    try {
      await userService.updateUserSettings(data)
      toast({ title: "Settings updated" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to update settings.", variant: "destructive" })
    }
  }

  async function handleAddKey(data: z.infer<typeof newKeyFormSchema>) {
    try {
      const { data: newKey, error } = await userService.addModelKey({ 
        ...data, 
        isActive: true 
      });
      
      if (error) throw error;
      
      setNewModelKey({ provider: '', modelName: '', apiKey: '' });
      loadModelKeys();
      setIsAddKeyDialogOpen(false);
      newKeyForm.reset();
      toast({ title: "Key saved successfully" });
    } catch (error) {
      console.error('Error adding key:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save key. Please try again.",
        variant: "destructive"
      });
    }
  }

  async function handleDeleteModelKey(id: string) {
    try {
      await userService.deleteModelKey(id)
      loadModelKeys()
      toast({ title: "Key deleted" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete key.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
          <CardDescription>Manage your search and chat preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="matchCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match Count</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormDescription>Set the number of matches to return</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="search">Search</SelectItem>
                        <SelectItem value="chat">Chat</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose between search and chat mode</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="allowAdminChange" 
                  checked={allowAdminChange}
                  onCheckedChange={(checked) => setAllowAdminChange(checked as boolean)}
                />
                <label htmlFor="allowAdminChange" className="text-sm font-medium leading-none">
                  Allow administrators to change settings.
                </label>
              </div>
              <Button type="submit">Save Settings</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model API Keys</CardTitle>
          <CardDescription>Manage your API keys for different models</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>{key.provider}</TableCell>
                  <TableCell>{key.modelName}</TableCell>
                  <TableCell>
                    <Input type="password" value="••••••••" readOnly />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteModelKey(key.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="justify-center border-t p-4">
          <Dialog open={isAddKeyDialogOpen} onOpenChange={setIsAddKeyDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1" onClick={() => setIsAddKeyDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                Add Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New API Key</DialogTitle>
              </DialogHeader>
              <Form {...newKeyForm}>
                <form onSubmit={newKeyForm.handleSubmit(handleAddKey)} className="space-y-4">
                  <FormField
                    control={newKeyForm.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={newKeyForm.control}
                    name="modelName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={newKeyForm.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  )
}


