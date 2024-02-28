import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Add your login logic here using the data object
    console.log("Login successful", data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      style={{
        maxWidth: "500px",
        margin: "auto",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "white",
      }}
    >
      <Typography variant="h5" component="div" style={{ mb: 2 }}>
        Login Form
      </Typography>
      <TextField
        fullWidth
        label="Username"
        {...register("username", {
          required: "Username is required",
          minLength: {
            value: 3,
            message: "Username must be at least 3 characters",
          },
        })}
        error={Boolean(errors.username)}
        helperText={errors.username?.message}
        margin="normal"
      />
      <TextField
        fullWidth
        type="password"
        label="Password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        margin="normal"
        style={{ mt: 2 }}
      />
      <FormControlLabel
        control={<Checkbox {...register("rememberMe")} color="primary" />}
        label="Remember Me"
        style={{ mt: 1, textAlign: "left" }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        style={{ mt: 2 }}
      >
        Login
      </Button>
      <Box style={{ mt: 2, textAlign: "center" }}>
        <Link href="#" variant="body2">
          Forgot Password?
        </Link>
        <Box mt={1}>
          <Link href="#" variant="body2">
            Don't have an account? Sign Up
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;
