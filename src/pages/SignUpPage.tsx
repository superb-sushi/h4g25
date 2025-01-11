import { SignUpForm } from '../components/signup-form';
import "./styles/SignUpPage.css";

const SignUpPage = () => {
  return (
    <div className="signUpContainer h-screen w-screen flex justify-center items-center">
      <SignUpForm  />
    </div>
  )
}

export default SignUpPage