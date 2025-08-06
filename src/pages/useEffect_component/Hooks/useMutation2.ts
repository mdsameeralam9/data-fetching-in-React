// useMutation.ts
import { useState, useCallback } from 'react';

type MutationStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseMutationOptions<TData, TError, TVariables> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: (data: TData | undefined, error: TError | null) => void;
}

interface UseMutationResult<TData, TError, TVariables> {
  mutate: (variables: TVariables) => void;
  data?: TData;
  error?: TError;
  status: MutationStatus;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export function useMutation<TData, TError = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> {
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<TError>();
  const [status, setStatus] = useState<MutationStatus>('idle');

  const mutate = useCallback(
    async (variables: TVariables) => {
      setStatus('loading');
      setError(undefined);
      try {
        const result = await mutationFn(variables);
        setData(result);
        setStatus('success');
        options?.onSuccess?.(result);
        options?.onSettled?.(result, null);
      } catch (err) {
        setError(err as TError);
        setStatus('error');
        options?.onError?.(err as TError);
        options?.onSettled?.(undefined, err as TError);
      }
    },
    [mutationFn, options]
  );

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
