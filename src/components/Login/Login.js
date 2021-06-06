import React, { useState, useReducer, useEffect } from "react";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";

// Step 2: Creating the reducer functions
const emailReducer = (state,action) => {
    if(action.type === "USER_INPUT")
      return {value:action.val , isValid:action.val.includes('@')}
    if (action.type === "INPUT_BLUR")
      return {value:state.value,isValid:state.value.includes('@')}
    return {value:'',isValid:false}
}

const passwordReducer = (state,action) => {
  if(action.type === 'INPUT_PASSWORD')
    return {value:action.val,isValid:action.val.trim().length > 6}
  if (action.type === 'INPUT_BLUR')
    return {value:state.value, isValid:state.value.trim().length > 6}
  return {value:'', isValid:false}
}

const Login = (props) => {

  const [formIsValid, setFormIsValid] = useState(false);

  // Step 1: Using the use reducer hook
  const [emailState,dispatchEmail] = useReducer(emailReducer,{value:'', isValid: null})
  const [passwordState,dispatchPassword] = useReducer(passwordReducer,{value:'', isValid: null})

  const {isValid: emailIsValid } = emailState;
  const {isValid : passwordIsValid } = passwordState;

  useEffect(()=>{  
    const identifier = setTimeout(()=>{
      console.log('Check form Validity')
      setFormIsValid(emailIsValid && passwordIsValid);
    },500)

    return ()=>{
      console.log("Clean Up")
      clearTimeout(identifier);
    }

  },[emailIsValid,passwordIsValid])

  const emailChangeHandler = (event) => {
    dispatchEmail({type:'USER_INPUT',
      val:event.target.value
    });

    setFormIsValid(
        event.target.value.includes("@") && passwordState.isValid
    );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type:'INPUT_PASSWORD',
      val:event.target.value
    })
    
    setFormIsValid(
            emailState.isValid && event.target.value.trim().length > 6
    );
  };

  const validateEmailHandler = () => {
    dispatchEmail({type:'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type:'INPUT_BLUR'})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input label="E-mail" type="email" isValid={emailIsValid} value={emailState.value} onChange={emailChangeHandler} onBlur={validateEmailHandler}/>
        
        <Input label="Password" type="password" isValid={passwordIsValid} value={passwordState.value} onChange={passwordChangeHandler} onBlur={validatePasswordHandler}/>
        
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;