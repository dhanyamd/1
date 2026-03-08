'use client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import Image from "next/image";


const formSchema = z.object({
    variableName: z
    .string()
    .min(1, {message: "Variable name needed"})
    .regex(/^[A-Za-z_$][A-Za-zz0-9_$]*$/, {
        message: "Variable name must start with a letter or underscore and conatine only letter, numbers and symbols  "
    }),
    content: z 
              .string() 
              .min(1, "Message content is required") 
              .max(2000, "Discord messages cannot exceed 2000 characters."),
    webhookUrl: z.string().min(1, "Webhook URL is required")
});
export type SlackFormValues = z.infer<typeof formSchema>
interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void; 
    defaultValues?: Partial<SlackFormValues>
}

export const SlackDialog = ({
open, onOpenChange, onSubmit, defaultValues = {}
}: Props) =>{
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          variableName: defaultValues.variableName || "",
          content: defaultValues.content || "",
          webhookUrl: defaultValues.webhookUrl || ""
        },
      });
      useEffect(() => {
        if (open) {
          form.reset({
            variableName: defaultValues.variableName || "",
          content: defaultValues.content || "",
          webhookUrl: defaultValues.webhookUrl || ""
          });
        }
      }, [open, defaultValues ,form]);
      const watchVariableName = form.watch("variableName") || "mySlack"
     
      const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values) 
        onOpenChange(false)
      }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Slack Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the slack webhook settings for this node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">
                    {/*
                <FormField 
                            control={form.control} 
                            name="model"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model</FormLabel>
                                    <Select 
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                         <SelectValue placeholder="Select a model"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {AVAILABLE_MODELS.map((model) => (
                                            <SelectItem key={model} value={model}>
                                                {model}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormDescription>
                                    Sets the behavior of the assistant. Use {"{{variables}}"} 
                                    for simple values on {"{{json variables}}"} to stringify objects.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            
                            />
*/}
                    <FormField
                        control={form.control}
                        name="variableName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Variable Name</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="mySlack"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                   Use this name to reference the result in 
                                   other nodes: {" "}
                                   {`{{${watchVariableName}.text}}`}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                     <FormField
                            control={form.control}
                            name="webhookUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>webhook Url</FormLabel>
                                <FormControl>
                                    <Input 
                                    placeholder="https://hooks.slack.com/services/..."
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Get this from Slack: Workspace settings -{">"} Workflows -{">"} Webhooks
                                </FormDescription>
                                <FormDescription>
                                    Make sure the "key" is "content"
                                </FormDescription>
                                <FormMessage/>
                                </FormItem>
                            )}
                            />
                          <FormField 
                            control={form.control} 
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                        placeholder="Summary: {{myGemini.text}}"                                       
                                         className="min-h-[120px] font-mono text-sm"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                    The message to send. Use {"{{variables}}"} 
                                    for simple values on {"{{json variables}}"} to stringify objects.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            
                            />
                        <DialogFooter className="mt-4">
                        <Button type="submit">Save</Button>
                        </DialogFooter>
                </form>
            </Form>
            </DialogContent>
        </Dialog>
    )
}