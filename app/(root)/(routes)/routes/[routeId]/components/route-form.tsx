"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Trash } from "lucide-react";
import { AlertModal } from '@/components/modals/alert-modal';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import * as z from 'zod';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface RouteFormProps {
    initialData: any;
    cities: any[];
}

const formSchema = z.object({
    day: z.instanceof(dayjs as any),
    startCityId: z.string().min(1),
    endCityId: z.string().min(1),
    price: z.coerce.number().min(1),
    stops: z.array( z.string().min(1) ).optional(),
});

type RouteFormValues = z.infer<typeof formSchema>;

export const RouteForm: React.FC<RouteFormProps> = ({ initialData, cities }) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const router = useRouter();

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
            stops: initialData.stops
        } : {
            day: dayjs(new Date()),
            startCityId: '',
            endCityId: '',
            price: 1,
            stops: [],
        }
    });

    const { control, setValue } = form;

    const [stopValue, setStopValue] = useState('')
    const [stopSelectValue, setStopSelectValue] = useState('')

    // Use the useFieldArray hook to manage the stops array
    const { fields, append, remove } = useFieldArray({
    control, // Pass control from useForm to useFieldArray
    name: 'stops', // Specify the name of the field array
    });

    const onSubmit = async (data: RouteFormValues) => {
        try {
            console.log(form.getValues("stops"))
            setLoading(true);
            const updatedData = {
                ...data,
                day: dayjs(data.day).toISOString(), // Convert day to Firestore-compatible format
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
                    <FormField
                        control={form.control}
                        name="stops"
                        render={({ field }) => (
                            <>
                                <FormLabel>Stops</FormLabel>
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Stop Number</TableHead>
                                                <TableHead>Stop Name</TableHead>
                                                <TableHead>New Stop Name</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                        {form.getValues("stops")?.map((stop: string, index: number) => (
                                            <TableRow key={`stops.${index}`}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    {cities.find(city => city.id === stop)?.name }
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        disabled={loading}
                                                        onValueChange={(value) => setValue(`stops.${index}`, value)}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={"Select a city..."}></SelectValue>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {cities.map(city => (
                                                                <SelectItem key={city.id} value={city.id} >
                                                                    {city.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() => remove(index)}
                                                        disabled={loading}
                                                    >
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <Select
                                    disabled={loading}
                                    onValueChange={(value) => setStopValue(value)}
                                    value={stopValue}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={"Select a city..."}></SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {cities.map(city => (
                                            <SelectItem key={city.id} value={city.id}>
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                                <Button type="button" onClick={() => append(stopValue)} disabled={loading}>
                                    Add Stop
                                </Button>
                            </>
                        )}
                    />
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
};
