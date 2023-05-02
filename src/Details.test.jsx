import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Details from './pages/Details/Details';

const mockedUsedNavigate = jest.fn();

jest.mock('axios');

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

jest.spyOn(React, 'useLayoutEffect').mockImplementation((fn) => fn());

// describe('MyComponent', () => {
//   it('should render without errors', async () => {
//     const mockData = { foo: 'bar' };
//     axios.get.mockResolvedValue({ data: mockData });

//     // rest of your test code
//   });
// });

describe('Details component', () => {
  it('renders the first option input', () => {
    render(
      <BrowserRouter>
        <Details />
      </BrowserRouter>
    );
    const firstOptionInput = screen.getByPlaceholderText(
      'Enter the first option'
    );
    expect(firstOptionInput).toBeInTheDocument();
  });

  it('renders the second option input', () => {
    render(
      <BrowserRouter>
        <Details />
      </BrowserRouter>
    );
    const secondOptionInput = screen.getByPlaceholderText(
      'Enter the second option'
    );
    expect(secondOptionInput).toBeInTheDocument();
  });

  it('renders the third option input', () => {
    render(
      <BrowserRouter>
        <Details />
      </BrowserRouter>
    );
    const thirdOptionInput = screen.getByPlaceholderText(
      'Enter the third option'
    );
    expect(thirdOptionInput).toBeInTheDocument();
  });

  it('renders the fourth option input', () => {
    render(
      <BrowserRouter>
        <Details />
      </BrowserRouter>
    );
    const fourthOptionInput = screen.getByPlaceholderText(
      'Enter the fourth option'
    );
    expect(fourthOptionInput).toBeInTheDocument();
  });

  it('renders the time input', () => {
    render(
      <BrowserRouter>
        <Details />
      </BrowserRouter>
    );
    const timeInput = screen.getByPlaceholderText('Duration in seconds');
    expect(timeInput).toBeInTheDocument();
  });

  it('renders a "Save" button', () => {
    const { queryByText } = render(
      <BrowserRouter>
        <Details />
      </BrowserRouter>
    );
    const saveButton = queryByText('Save');
    expect(saveButton).toBeInTheDocument();
  });

  it('renders a "Next" button', () => {
    const { queryByText } = render(
      <BrowserRouter>
        <Details />
      </BrowserRouter>
    );
    const saveButton = queryByText('Next');
    expect(saveButton).toBeInTheDocument();
  });
  it('renders two buttons', () => {
    const { queryAllByRole } = render(
      <BrowserRouter>
        <Details />
      </BrowserRouter>
    );
    const buttons = queryAllByRole('button');
    expect(buttons.length).toBe(2);
  });

  it('renders the link input', () => {
    render(
      <BrowserRouter>
        <Details />
      </BrowserRouter>
    );
    const linkInput = screen.getByPlaceholderText('Enter the link');
    expect(linkInput).toBeInTheDocument();
  });

  it('renders the single selection checkbox', () => {
    render(
      <BrowserRouter>
        <Details />
      </BrowserRouter>
    );
    const singleSelectionCheckbox = screen.getByLabelText('Single Selection');
    expect(singleSelectionCheckbox).toBeInTheDocument();
  });
});
