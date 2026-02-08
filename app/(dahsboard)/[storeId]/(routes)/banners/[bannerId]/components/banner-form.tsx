'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Banner } from "@prisma/client"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"

import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { useOrigin } from "@/hooks/use-origin"

interface BannerFormProps {
    initialData: Banner | null;
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
})

type BannerFormValues = z.infer<typeof formSchema>

export const BannerForm: React.FC<BannerFormProps> = ({initialData}) => {

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Banner" : "Buat banner";
    const description = initialData ? "Edit Banner Toko" : "Buat banner Toko";
    const toastMessage = initialData ? "Edit berhasil di edit" : "Banner berhasil di buat";
    const action = initialData ? "Simpan banner" : "Buat banner";

    const form = useForm<BannerFormValues> ({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    })

    const onSubmit = async (data: BannerFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh();
            toast.success("Toko berhasil di update");
        } catch (error) {
            toast.error("Cek kembali data yang diinput");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push('/');
            toast.success("Toko berhasil dihapus");
        } catch (error) {
            toast.error("Cek kembali data dan koneksi mu");
        } finally {
            setOpen(false);
            setLoading(false);
        }
    }

    const currentName = form.watch("label");

    return (
        <>
        <AlertModal
        isOpen={open}
        onClose ={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        />
        <div className="flex items-center justify-between">
            <Heading title={title} description={description}/>
            {initialData && (
            <Button disabled={loading} variant="destructive" size="sm" 
            onClick={() => setOpen(true)}>
                <Trash className="h-4 w-4"/>
            </Button>
            )}
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <div className="grid grid-cols-3 gap-8">
                <FormField 
                control={form.control}
                name="label"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                            <Input placeholder="Label Banner" disabled={loading} {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <Button
            disabled={loading}
            type="submit">
            {action}
            </Button>
            </form>
        </Form>
        <Separator />
        </>
    );
}