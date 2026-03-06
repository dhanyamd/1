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

const AVAILABLE_MODELS = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-1.0-pro",
    "gemini-pro"
] as const;

const formSchema = z.object({
    variableName: z
    .string()
    .min(1, {message: "Variable name needed"})
    .regex(/^[A-Za-z_$][A-Za-zz0-9_$]*$/, {
        message: "Variable name must start with a letter or underscore and conatine only letter, numbers and symbols  "
    }),
   // model: z.enum(AVAILABLE_MODELS),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, "User prompt is required")

});
export type OpenaiFormValues = z.infer<typeof formSchema>
interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void; 
    defaultValues?: Partial<OpenaiFormValues>
}

export const OpenaiDialog = ({
open, onOpenChange, onSubmit, defaultValues = {}
}: Props) =>{
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          variableName: defaultValues.variableName || "",
          //model: defaultValues.model || AVAILABLE_MODELS[0],
          systemPrompt: defaultValues.systemPrompt || "",
          userPrompt: defaultValues.userPrompt || ""
        },
      });
      useEffect(() => {
        if (open) {
          form.reset({
            variableName: defaultValues.variableName || "",
           // model: defaultValues.model || AVAILABLE_MODELS[0],
            systemPrompt: defaultValues.systemPrompt || "",
            userPrompt: defaultValues.userPrompt || ""
          });
        }
      }, [open, defaultValues ,form]);
      const watchVariableName = form.watch("variableName") || "myOpenaiAi"
     
      const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values) 
        onOpenChange(false)
      }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Openai Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the AI model and prompt for this node.
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
                                    placeholder="myOpenaiAi"
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
                            name="systemPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System Prompt(Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                        placeholder="You are an helpful assistant"                                       
                                         className="min-h-[120px] font-mono text-sm"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                    Sets the behavior of the assistant. Use {"{{variables}}"} 
                                    for simple values on {"{{json variables}}"} to stringify objects.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            
                            />
                            <FormField 
                            control={form.control} 
                            name="userPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                        placeholder="Summarize this text: {{json httpResponse.data}}"                                       
                                         className="min-h-[120px] font-mono text-sm"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                    The prompt to send to the AI. Use {"{{variables}}"} 
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