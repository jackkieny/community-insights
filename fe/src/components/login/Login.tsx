import { LoginForm } from "./loginForm/LoginForm"
import { useNavigate } from "react-router-dom"

export function Login() {
    
  const navigate = useNavigate()

  return (
    <>
        <LoginForm />
    </>
  )
}
