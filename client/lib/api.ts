export const API_URL = "http://localhost:5000/api"

export const loginUser = async (data:any)=>{
  const res = await fetch(`${API_URL}/auth/login`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
  })

  return res.json()
}