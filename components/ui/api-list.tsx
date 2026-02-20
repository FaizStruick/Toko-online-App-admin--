'use client'

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiAlert } from "./api-alert";
import { useMemo } from "react";

interface ApiListProps {
    namaIndikator: string;
    idIndikator: string;
}

export const ApiList: React.FC<ApiListProps> = ({
    namaIndikator,
    idIndikator
}) => {

    const params = useParams();
    const origin = useOrigin();

    const baseUrl = useMemo(() => {
       return `${origin}/api/${params.storeId}`
    }, [origin, params.storeId]);

    if(!origin) return null;
        

    return (
        <>
            <ApiAlert
            title="GET"
            variant="public"
            description={`${baseUrl}/${namaIndikator}`}
            />
        <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${namaIndikator}/{${idIndikator}}`}
         />
        <ApiAlert
        title="GET"
        variant="admin"
        description={`${baseUrl}/${namaIndikator}`}
         />
        <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${namaIndikator}/{${idIndikator}}`}
         />
        <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${namaIndikator}/{${idIndikator}}`}
         />
        </>
    )
}