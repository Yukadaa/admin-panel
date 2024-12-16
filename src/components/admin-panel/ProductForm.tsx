"use client"
import { setLoading } from '@/redux/features/loadingSlice';
import { useAppDispatch } from '@/redux/hooks';
import { makeToast } from '@/utils/helper';
import { UploadButton } from '@/utils/uploadthing';
import axios from 'axios';
import Image from 'next/image';
import React, { FormEvent, useState } from 'react';

interface IPayload {
    imgSrc: null | string;
    fileKey: null | string;
    name: string;
    category: string;
    price: string;
}

const ProductForm = () => {

    const [payLoad, setPayLoad] = useState<IPayload>({
        imgSrc: null,
        fileKey: null,
        name: '',
        category: '',
        price: '',
    });

    const dispatch = useAppDispatch();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        dispatch(setLoading(true));

        axios.post('/api/add_product', payLoad).then(res => {
            makeToast("Product added successfully")
            setPayLoad({
                imgSrc: null,
                fileKey: null,
                name: '',
                category: '',
                price: '',
            });
        })
        .catch((err) => console.log(err))
        .finally(() => dispatch(setLoading(false)));
    };


  return (
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <Image 
        className='max-h-[300px] w-auto object-contain rounded-md' 
        src={payLoad.imgSrc ? payLoad.imgSrc : '/placeholder.jpg'}
        width={800}
        height={500}
        alt='product_Image'
        />
<UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
                console.log(res);

                setPayLoad({
                    ...payLoad,
                    imgSrc: res[0]?.url,
                    fileKey: res[0]?.key,
                });
            }}
            onUploadError={(error: Error) => {
                console.log(`ERROR! ${error}`);
            }}
        />
    </form>
  );
};

export default ProductForm;