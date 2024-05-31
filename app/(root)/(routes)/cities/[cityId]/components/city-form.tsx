"use client"

import { useState } from 'react'
import * as z from 'zod'
import { City } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';

interface SettingsFromProps {
    initialData: City | null; 
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
})

type CityFormValues = z.infer<typeof formSchema>;

export const CityForm: React.FC<SettingsFromProps> = ({ initialData }) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit City' : 'Add city'
    const description = initialData ? 'Edit a city' : 'Add a new city'
    const toastMessage = initialData ? 'City updated.' : 'City created.'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<CityFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
        }
    });

    const onSubmit = async (data: CityFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/cities/${params.cityId}`, data)
            } else {
                await axios.post(`/api/cities`, data)
            }
            router.refresh();
            router.push(`/cities`);
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
            await axios.delete(`/api/cities/${params.cityId}`)
            router.refresh();
            router.push(`/cities`)
            toast.success("City deleted.")
        } catch(err) {
            toast.error("Make sure you removed all categories using this city first.");
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
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>City Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='City name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control} 
                            name="value"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>City Value</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='City value' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
                </form>
            </Form>
            {/* <Separator /> */}
        </>
    )
}