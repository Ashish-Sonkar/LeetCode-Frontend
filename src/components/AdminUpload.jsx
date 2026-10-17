import { useParams } from "react-router"
import React,{useState} from "react"
import {useForm} from 'react-hook-form'
import axios from 'axios'
import axiosClient from "../utils/axiosClient"

function AdminUpload(){

    const {problemId}=useParams()
    const [uploading,setUploading]=useState(false)
    const [uploadProgress,setUploadProgress]=useState(0)
    const [uploadedVideo,setUploadedVideo]=useState(null)

    const {
        register,
        handleSubmit,
        watch,
        formState:{errors},
        reset,
        setErrors,
        clearErrors
    }=useForm

    const selectedFile=watch('videoFile')?.[0]

    //Upload video to cloudinary
    const onSubmit=async (data)=>{
        const file=data.videoFile[0]

        setUploading(true)
        setUploadProgress(0)
        clearErrors()

        try{
            //Step1: Get upload signature from backend
            const signatureResponse=await axiosClient.get(`/video/create/:${problemId}`)
            const {signature,timestamp,public_id,api_key,cloud_name,upload_url}=signatureResponse.data

            //Step2: Create FormData for cloudinary upload
            const formData=new FormData()
            formData.append('file',file)
            formData.append('signature',signature)
            formData.append('timestamp',timestamp)
            formData.append('public_id',public_id)
            formData.append('api_key',api_key)

            //Step3: Upload directly to cloudinary
            const uploadResponse=await axios.post(upload_url,formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                onUploadProgress:(ProgressEvent)=>{
                    const progress=Math.round((ProgressEvent.loaded*100)/ProgressEvent.total)
                    setUploadProgress(progress)
                }
            })

            const cloudinaryResult=uploadResponse.data

            //Step4: Save video metadata to backend
            const metadataResponse=await axiosClient.post('/video/save',{
                problemId:ProblemId,
                cloudinaryPublicId:cloudinaryResult.public_id,
                secureUrl:cloudinaryResult.secure_url,
                duratin:cloudinaryResult.duration
            })

            setUploadedVideo(metadataResponse.data.videoSolution)
            reset() //Reset form after successful upload
        }catch(err){
            console.error('Upload error:',err)
            setErrors('root',{
                type:'manual',
                message:err.response?.data?.message || 'Upload failed. Please try again.'
            })
        } finally{
            setUploading(false)
            setUploadProgress(0)
        }

        // Format file size
        const formatFileSize=(bytes)=>{
            if(bytes===0) return '0 Bytes'
            const k=1024
            const sizes=['Bytes',]
        }

        return(
            <div className="max-w-md mx-auto p-6" >
                <div className="card bg-base-100 shadow" >
                    <div className="card-body" >
                        <h2 className="card-title" >Upload Video</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" >
                            <div className="form-control w-full" >
                                <lable className="lable" >
                                    <span className="label-text" >Choose video file</span>
                                </lable>
                                <input 
                                    type="file" 
                                    accept="video/*" 
                                    {...register('videoFile',{
                                        required:'Please select a video file',
                                        validate:{
                                            isVideo:(files)=>{
                                                if(!files || !files[0]) return 'Please select a video file'
                                                const file=files[0]
                                                return file.type.startsWith('video/') || 'Please select a valid video file'
                                            },
                                            fileSize:(files)=>{
                                                if(!files || !files[0]) return true
                                                const file=files[0]
                                                const maxSize=100*1024*1024  //100MB
                                                return file.size <=maxSize || 'File size must be less than 100MB'
                                            }
                                        }
                                    })} 
                                    
                                ></input>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminUpload