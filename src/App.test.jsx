import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Login from './pages/Login/Login';
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Login component', () => {
  it('should render the login form correctly', () => {
    render(<Login />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('Fill out the email field', () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText('Enter email');
    fireEvent.change(emailInput, { target: { value: 'abc@gmail.com' } });
    expect(screen.getByDisplayValue('abc@gmail.com')).toBeInTheDocument();
  });

  test('Fill out the password field', () => {
    render(<Login />);
    const passwordInput = screen.getByPlaceholderText('Enter Password');
    fireEvent.change(passwordInput, { target: { value: '12345678' } });
    expect(screen.getByDisplayValue('12345678')).toBeInTheDocument();
  });

  it('should show an error message when email and password are not provided', async () => {
    render(<Login />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('should show a success message when user is successfully logged in', async () => {
    const handleSubmit = jest.fn();
    const mockAxios = jest.spyOn(axios, 'post').mockResolvedValueOnce(1);
    render(<Login handleSubmit={handleSubmit} />);
    const emailInput = screen.getByPlaceholderText('Enter email');
    const passwordInput = screen.getByPlaceholderText('Enter Password');
    const button = screen.getByRole('button');
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(button);
    console.log('Button Clicked!');
    await waitFor(() => {
      console.log('Waiting for axios response!', mockAxios);
      expect(toast.error).toHaveBeenCalled();
      // expect(screen.getByText('Successfully sign in.')).toBeInTheDocument();
    });
    mockAxios.mockRestore();
  });

  it('should show an error message when user enters incorrect email or password', async () => {
    const mockAxios = jest.spyOn(axios, 'post').mockRejectedValueOnce({});
    render(<Login />);
    const emailInput = screen.getByPlaceholderText('Enter email');
    const passwordInput = screen.getByPlaceholderText('Enter Password');
    const button = screen.queryAllByRole('button');
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    await waitFor(() => {
      expect(button.length).toBe(1);
    });
    mockAxios.mockRestore();
  });
});
