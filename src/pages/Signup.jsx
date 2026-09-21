import { useForm } from 'react-hook-form';

function Signup(){

    const {register,handleSubmit,formState: { errors },} = useForm();

    return(
        <>
        <form onSubmit={handleSubmit((data)=>console.log(data))} >
            <input {...register('firstName')} placeholder='Enter your firstName' />
            <input {...register('email')} placeholder='Enter your email' />
            <input {...register('password')} placeholder='Enter your password' />
            <button type="submit" >Submit</button>
        </form>
        </>
    )
}

export default Signup





















// import {useEffect,useState} from "react"


// function Signup(){
    
//     const [name,setName]=useState('')
//     const [email,setEmail]=useState('')
//     const [password,setPassword]=useState('')

//     const handleSubmit=(e)=>{

//         e.preventDefault()
//         console.log(name,email,password)

//     }

//     return(
//         <form onSubmit={handleSubmit}>

//             <input type="text" value={name} placeholder="Enter your firstName" onChange={(e)=>setName(e.target.value)} ></input>

//             <input type="email" value={email} placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)} ></input>

//             <input type="password" value={password} placeholder="Enter your password" onChange={(e)=>setPassword(e.target.value)} ></input>

//             <button type="submit" >Submit</button>

//         </form>
//     )
// }

// export default Signup