import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Min 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage('');
    setApiError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Account created successfully!');

        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });

        setTimeout(() => navigate('/login'), 2000);
      } else {
        setApiError(data.message || 'Registration failed');
      }
    } catch (err) {
        console.error('Registration error:', err);
        setApiError('Server error. Try again later.');
    }finally {
      setIsLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1>Create Your Account</h1>

        {successMessage && <div style={styles.success}>{successMessage}</div>}
        {apiError && <div style={styles.error}>{apiError}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={errors.name ? styles.inputError : styles.input}
          />
          {errors.name && <span style={styles.errorText}>{errors.name}</span>}

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={errors.email ? styles.inputError : styles.input}
          />
          {errors.email && <span style={styles.errorText}>{errors.email}</span>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={errors.password ? styles.inputError : styles.input}
          />
          {errors.password && <span style={styles.errorText}>{errors.password}</span>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={errors.confirmPassword ? styles.inputError : styles.input}
          />
          {errors.confirmPassword && (
            <span style={styles.errorText}>{errors.confirmPassword}</span>
          )}

          <button disabled={isLoading} style={styles.button}>
            {isLoading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

// ---------------- STYLES ----------------
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem'
  },
  formContainer: {
    width: '400px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '10px'
  },
  inputError: {
    padding: '10px',
    border: '1px solid red'
  },
  button: {
    padding: '10px',
    cursor: 'pointer'
  },
  success: {
    color: 'green'
  },
  error: {
    color: 'red'
  },
  errorText: {
    fontSize: '12px',
    color: 'red'
  }
};

export default Register;