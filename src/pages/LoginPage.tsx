import { LoginForm } from '../components/login-form';
import "./styles/LoginPage.css";

const LoginPage = () => {
  return (
    <>
      <div className="loginContainer h-screen w-screen flex justify-center items-center">
        <LoginForm />
      </div>
    </>
  )
}

export default LoginPage;