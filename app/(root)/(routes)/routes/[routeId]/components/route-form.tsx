"use client"

import { useState } from 'react'
import * as z from 'zod'
import { Route } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import { Calendar } from "@/components/ui/calendar"
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover"
import { format } from 'date-fns';

interface SettingsFromProps {
    initialData: Route | null; 
}

const formSchema = z.object({
    day: z.date({ required_error: "A date is required.", }),
    startCityId: z.string().min(1),
    endCityId: z.string().min(1),
    price: z.coerce.number(),
})

type RouteFormValues = z.infer<typeof formSchema>;

export const RouteForm: React.FC<SettingsFromProps> = ({ initialData }) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit Route' : 'Add Route'
    const description = initialData ? 'Edit a Route' : 'Add a new route'
    const toastMessage = initialData ? 'Route updated.' : 'Route created.'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<RouteFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            day: new Date(),
            startCityId: '',
            endCityId: '',
            price: 1,
        }
    });

    const onSubmit = async (data: RouteFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/routes/${params.routeId}`, data)
            } else {
                await axios.post(`/api/routes`, data)
            }
            router.refresh();
            router.push(`/routes`);
            toast.success(toastMessage)
        } catch(err) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/routes/${params.routeId}`)
            router.refresh();
            router.push(`/routes`)
            toast.success("Route deleted.")
        } catch(err) {
            toast.error("Make sure you removed all categories using this route first.");
        } finally {
            setLoading(false)
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
                        <Trash className="w-4 h-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <FormField
                        control={form.control} 
                        name="startCityId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Depart City Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Depart city name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control} 
                            name="endCityId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Final City Value</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Final city value' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                        control={form.control} 
                        name="price"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='price' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormField
                        control={form.control} 
                        name="day"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date of birth</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                    />
                    <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
                </form>
            </Form>
            {/* <Separator /> */}
        </>
    )
}