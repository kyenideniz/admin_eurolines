"use client"

import React from 'react';
import { useState } from 'react'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { City, Route, RouteStop } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SettingsFromProps {
    initialData: (Route & { stops: RouteStop[] }) | null;  
    cities: City[],
}

const formSchema = z.object({
    day: z.instanceof(dayjs as any),
    startCityId: z.string().min(1),
    endCityId: z.string().min(1),
    price: z.coerce.number().min(1),
    stops: z.array(z.object({
        id: z.string(),  // Optional for new stops
        cityId: z.string().min(1),
    })),
});

type RouteFormValues = z.infer<typeof formSchema>;

export const RouteForm: React.FC<SettingsFromProps> = ({ 
    initialData,
    cities,
 }) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const router = useRouter();

    const defaultStops = [{ id: uuidv4(), cityId: uuidv4() }];

    const title = initialData ? 'Edit Route' : 'Add Route';
    const description = initialData ? 'Edit a Route' : 'Add a new route';
    const toastMessage = initialData ? 'Route updated.' : 'Route created.';
    const action = initialData ? 'Save changes' : 'Create';

    const form = useForm<RouteFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            day: dayjs(initialData.day),
            price: parseFloat(String(initialData.price)),
            stops: initialData.stops.map(stop => ({ id: stop.id, cityId: stop.cityId })),
        } : {
            day: dayjs(new Date()),
            startCityId: '',
            endCityId: '',
            price: 1,
            stops: defaultStops,
        }
    });

    // Use the form hook with the default stops
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'stops',
        // Ensure that there is always at least one element in the array
        shouldUnregister: false,
    });

    if (fields.length === 0) {
        append(defaultStops[0]);
    }

    const onSubmit = async (data: RouteFormValues) => {
        try {
            setLoading(true);
            const updatedData = {
                ...data,
                day: dayjs(data.day).toISOString(),
            };
            if (initialData) {
                await axios.patch(`/api/routes/${params.routeId}`, updatedData);
            } else {
                await axios.post(`/api/routes`, updatedData);
            }
            router.refresh();
            router.push(`/routes`);
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
            await axios.delete(`/api/routes/${params.routeId}`);
            router.refresh();
            router.push(`/routes`);
            toast.success("Route deleted.");
        } catch (err) {
            toast.error("Make sure you removed all categories using this route first.");
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
                <div className='grid grid-cols-2 gap-8'>
                    <FormField
                        control={form.control}
                        name="startCityId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Departure City Name</FormLabel>
                                <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                defaultValue={field.value}
                                                placeholder='Select departure city'
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {cities && cities.map(city => (
                                            <SelectItem key={city.id} value={city.id}>
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="endCityId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Final City Name</FormLabel>
                            <Select
                                    disabled={loading}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            defaultValue={field.value}
                                            placeholder='Select final city'
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {cities && cities.map(city => (
                                        <SelectItem key={city.id} value={city.id}>
                                            {city.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    <div className="space-y-4">
                        <FormLabel>Stops</FormLabel>
                        {fields.map((item, index) => (
                            <div key={item.id} className="flex items-center space-x-4">
                                <FormField
                                    control={form.control}
                                    name={`stops.${index}.cityId`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select
                                                disabled={loading}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a stop city" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {cities && cities.map(city => (
                                                        <SelectItem key={city.id} value={city.id}>
                                                            {city.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" variant="destructive" onClick={() => remove(index)} disabled={loading}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={() => append({ id: uuidv4(), cityId: "0" })} disabled={loading}>
                            Add Stop
                        </Button>
                    </div>

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='price' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="day"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date of Departure</FormLabel>
                                <FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            value={dayjs(field.value)}
                                            inputRef={field.ref}
                                            onChange={(date) => field.onChange(date)}
                                            ampm={false}
                                            disablePast={true}
                                            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
                </form>
            </Form>
        </>
    );
}
