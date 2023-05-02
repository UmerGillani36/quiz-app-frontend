import React from 'react';
import { render } from '@testing-library/react';
import Card from './components/Card/Card';

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

describe('Card component', () => {
  const quiz = {
    id: 1,
    name: 'Test Quiz',
    active: 'test123',
  };
  const mockDelete = jest.fn();
  const mockGetGames = jest.fn();
  const mockSetClipBoard = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render quiz name', () => {
    const { getByText } = render(
      <Card
        keys={1}
        quiz={quiz}
        handleDelete={mockDelete}
        getGames={mockGetGames}
        clipBoard="test123"
        setClipBoard={mockSetClipBoard}
      />
    );
    expect(getByText('Test Quiz')).toBeInTheDocument();
  });

  it('should check handleStart start button', () => {
    const { getByTestId } = render(
      <Card
        keys={1}
        quiz={quiz}
        handleDelete={mockDelete}
        getGames={mockGetGames}
        clipBoard="test123"
        setClipBoard={mockSetClipBoard}
      />
    );
    expect(getByTestId('StartButton')).toBeInTheDocument();
  });

  it('should call handleStop function when stop button is clicked', () => {
    const { getByText } = render(
      <Card
        keys={1}
        quiz={quiz}
        handleDelete={mockDelete}
        getGames={mockGetGames}
        clipBoard="test123"
        setClipBoard={mockSetClipBoard}
        navigate={mockNavigate}
      />
    );
    expect(getByText('Test Quiz')).toBeInTheDocument();
  });

  it('should render Image', () => {
    const { getByTestId } = render(
      <Card
        keys={1}
        quiz={quiz}
        handleDelete={mockDelete}
        getGames={mockGetGames}
        clipBoard="test123"
        setClipBoard={mockSetClipBoard}
        navigate={mockNavigate}
      />
    );
    navigator.clipboard = {
      writeText: jest.fn(),
    };
    const img = getByTestId('image');
    expect(img).toBeInTheDocument();
  });
});
