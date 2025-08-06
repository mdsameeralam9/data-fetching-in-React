// useMutation.js
import { useState, useCallback } from 'react';

export function useMutation(mutationFn, options = {}) {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [status, setStatus] = useState('idle');

  const mutate = useCallback(async (variables) => {
    setStatus('loading');
    setError(undefined);

    try {
      const result = await mutationFn(variables);
      setData(result);
      setStatus('success');
      if (options.onSuccess) options.onSuccess(result);
      if (options.onSettled) options.onSettled(result, null);
    } catch (err) {
      setError(err);
      setStatus('error');
      if (options.onError) options.onError(err);
      if (options.onSettled) options.onSettled(undefined, err);
    }
  }, [mutationFn, options]);

  return {
    mutate,
    data,
    error,
    status,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}


// example
{/**
    
const createUser = async (user: { name: string }) => {
  const res = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
};

const Component = () => {
  const { mutate, data, error, isLoading } = useMutation(createUser, {
    onSuccess: (data) => console.log('User created:', data),
    onError: (err) => console.error('Error:', err),
  });

  return (
    <button onClick={() => mutate({ name: 'Sameer' })} disabled={isLoading}>
      Create User
    </button>
  );
};
    
    
    
*/}