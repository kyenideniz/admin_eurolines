"use client"

import { useEffect, useState } from 'react';
import * as z from 'zod';
import { City } from "@/types";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImagePlus, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import { Checkbox } from "@/components/ui/checkbox";
import Image from 'next/image';

interface SettingsFromProps {
    initialData: City | null; 
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
    isOffered: z.boolean().default(false),
    price: z.number().optional(),
});

type CityFormValues = z.infer<typeof formSchema>;

export const CityForm: React.FC<SettingsFromProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const title = initialData ? 'Edit City' : 'Add city';
    const description = initialData ? 'Edit a city' : 'Add a new city';
    const toastMessage = initialData ? 'City updated.' : 'City created.';
    const action = initialData ? 'Save changes' : 'Create';

    const form = useForm<CityFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
            isOffered: false,
            price: 0,
        }
    });

    useEffect(() => {
        if (initialData?.url) {
            setPreview(initialData.url);
        }
    }, [initialData]);

    const handleRemoveImage = () => {
        setPreview(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                setPreview(imageUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: CityFormValues) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('value', data.value);
            formData.append('isOffered', data.isOffered.toString());
            formData.append('price', (data.price ?? 0).toString());
            
            if (file) {
                formData.append('file', file);
            }

            if (initialData) {
                await axios.patch(`/api/${params.storeId}/cities/${params.cityId}`, formData);
            } else {
                await axios.post(`/api/${params.storeId}/cities`, formData);
            }

            router.refresh();
            router.push(`/${params.storeId}/cities`);
            toast.success(toastMessage);
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/cities/${params.cityId}`);
            router.refresh();
            router.push(`/${params.storeId}/cities`);
            toast.success("City deleted.");
        } catch (err) {
            toast.error("Make sure you removed all categories using this city first.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

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
                    {preview && (
                        <div className='mb-4 flex items-center gap-4'>
                            <div key={preview} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
                                <div className='z-10 absolute top-2 right-2'>
                                    <Button type='button' onClick={handleRemoveImage} variant="destructive" size="icon">
                                        <Trash className='w-4 h-4'/>
                                    </Button>
                                </div>
                                {preview === initialData?.url ? (
                                    <iframe src={preview} className='w-full h-full' title="Initial Image" />
                                ) : (
                                    <Image src={preview} fill className='object-cover' alt='Image' />
                                )}
                            </div>
                        </div>
                    )}
                    <FormItem>
                        <FormLabel>City Image</FormLabel>
                        <FormControl>
                            <Input
                                type="file"
                                disabled={loading}
                                onChange={handleFileChange}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    <div className='grid grid-cols-2 gap-8 items-center justify-center'>
                        <FormField
                            control={form.control} 
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" disabled={loading} placeholder='City name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City Value</FormLabel>
                                    <FormControl>
                                        <Input type='text' disabled={loading} placeholder='City value' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Offer Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            disabled={loading}
                                            placeholder='Offer price'
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="isOffered"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>Offered City</FormLabel>
                                        <FormDescription>The city will appear on the home page.</FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
                </form>
            </Form>
        </>
    );
};
