import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
} from '@material-ui/core';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { auth } from '../firebase-config';

const Login = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>HRMS | Login</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(values, actions) => {
              signInWithEmailAndPassword(auth, values.email, values.password)
                .then((userCredential) => {
                  // Signed in
                  console.log(userCredential.user);
                  actions.setSubmitting(false);
                  navigate('/app/dashboard', { replace: true });
                })
                .catch((error) => {
                  // Signin failed
                  console.log(error.message);
                  actions.setErrors({ login: error.message });
                  actions.setSubmitting(false);
                });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    align="center"
                    color="textPrimary"
                    variant="h2"
                  >
                    Welcome to CustomHRMS
                  </Typography>
                  <Typography
                    align="center"
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Enter manager email and password
                  </Typography>
                  {errors.login ? (<Alert severity="error">{errors.login}</Alert>) : null}
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  // onClick=
                  >
                    Sign in
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
          {/*
          <Button
            color="secondary"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            onClick={() => {
              signOut(auth).then(() => {
                console.log('Sign out success');
                console.log(auth.currentUser);
              }).catch((error) => { console.log(error.m); });
            }}
          >
            Sign Out
          </Button>
          */}
        </Container>
      </Box>
    </>
  );
};

export default Login;
