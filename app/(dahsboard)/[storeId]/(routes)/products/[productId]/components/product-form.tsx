'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Category, Image, Product, Color, Size } from "@prisma/client"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
import { useOrigin } from "@/hooks/use-origin"
import ImageUpload from "@/components/ui/image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface ProductFormProps {
    initialData: Product  & { 
    images: Image[] 
    } | null;
    categories: Category[];
    colors: Color[];
    sizes: Size[];
}

const formSchema = z.object({
    name: z.string().min(1, { message: "Nama produk wajib diisi" }),
    images: z.object({url: z.string()}).array().min(1, { message: "Minimal unggah 1 Gambar" }),
    price: z.coerce.number().min(1, { message: "Harga harus lebih dari Rp 0" }),
    categoryId: z.string().min(1, { message: "Kategori wajib diisi" }),
    colorId: z.string().min(1, { message: "Warna wajib diisi" }),
    sizeId: z.string().min(1, { message: "Ukuran wajib diisi" }),
    isFeatured: z.boolean().default(false),
    isArchived: z.boolean().default(false),
})

type ProductFormValues = z.infer<typeof formSchema>

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData, 
    categories,
    colors,
    sizes,
}) => {

    const params = useParams<{ storeId: string; productId: string }>();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Product" : "Buat product";
    const description = initialData ? "Edit Product Toko" : "Buat product Toko";
    const toastMessage = initialData ? "Product berhasil di edit" : "Product berhasil di buat";
    const action = initialData ? "Simpan product" : "Buat product";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            images: initialData.images.map((img) => ({ url: img.url })),
            price: parseFloat(String(initialData.price)),
            categoryId: initialData.categoryId || '',
            colorId: initialData.colorId || '',
            sizeId: initialData.sizeId || '',
            isFeatured: !!initialData.isFeatured,
            isArchived: !!initialData.isArchived,
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: false,
            isArchived: false,
        },
    })

    const onSubmit = async (data: ProductFormValues) => {

        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/products`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Cek kembali data yang diinput");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success("Product berhasil dihapus");
        } catch (error) {
            toast.error("Cek kembali data dan koneksi mu");
        } finally {
            setOpen(false);
            setLoading(false);
        }
    }

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

            <FormField 
                control={form.control}
                name="images"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Images</FormLabel>
                        <FormControl>
                            <ImageUpload 
                            disabled={loading}
                            onChange={(url) => field.onChange([...field.value, {url}])}
                            onRemove={(url) => field.onChange(field.value.filter((current) => current.url !== url))}
                            value={(field.value || []).map((image) => image.url)}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">     
                <FormField 
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Product Name" disabled={loading} {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                )}/>

                <FormField 
                    control={form.control}
                    name="price"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Harga</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="Rp" 
                                    disabled={loading} 
                                    {...field}
                                    value={(field.value as number) ?? ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        field.onChange(val === '' ? '' : Number(val));
                                    }}
                                    />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
            <FormField 
                control={form.control}
                name="categoryId"
                render={({field}) => (
            <FormItem>
                <FormLabel>Kategori</FormLabel>
            <Select
                disabled={loading}
                onValueChange={field.onChange}
                value={field.value}
                >
                <FormControl>
                    <SelectTrigger>
                        <SelectValue
                            placeholder="Pilih Kategori" 
                        />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
            name="sizeId"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Ukuran (Size)</FormLabel>
                    <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                    >
                    
                    <FormControl> 
                        <SelectTrigger>
                            <SelectValue 
                                placeholder="Pilih ukuran"
                                />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {sizes?.length == 0 ? (
                            <div className="p-2 text-xs text-center text-muted-foreground">
                                Belum ada ukuran. Tambahkan dulu dimenu Sizes.
                            </div>
                        ) : (
                            sizes?.map((size) => (
                                <SelectItem key={size.id} value={size.id}>
                                    {size.name} ({size.value})
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                    </Select>
                </FormItem>
            )}
        />

        <FormField 
              control={form.control}
              name="colorId"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Warna (Color)</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          
                          placeholder="Pilih Warna" 
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          <div className="flex items-center gap-x-2">
                            <div 
                              className="h-4 w-4 rounded-full border shrink-0" 
                              style={{ backgroundColor: color.value }}
                            />
                            {color.name}
                          </div>
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
                name="isFeatured"
                render={({field}) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md
                    border p-4">
                        <FormControl>
                            <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel className="text-base">
                                Is Featured
                            </FormLabel>
                            <FormDescription>
                                Produk ini akan ditampilkan di halaman utama
                            </FormDescription>
                        </div>
                    </FormItem>
                )}/>

            <FormField 
                control={form.control}
                name="isArchived"
                render={({field}) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md
                    border p-4">
                        <FormControl>
                            <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel className="text-base">
                                Archived
                            </FormLabel>
                            <FormDescription>
                                Produk ini akan disembunyikan dari toko
                            </FormDescription>
                        </div>
                    </FormItem>
                )}/>

            </div>
            <Button disabled={loading} className="ml-auto" type="submit">
                {action}
            </Button>
            </form>
        </Form>
        </>
    );
}