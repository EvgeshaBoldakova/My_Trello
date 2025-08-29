import { toast } from 'react-toastify';

export async function handleRequest<T>(
  request: () => Promise<T>,
  successMessage?: string,
  errorMessage?: string
): Promise<T | undefined> {
  try {
    const result = await request();
    if (successMessage) {
      toast.success(successMessage);
    }
    return result;
  } catch (error) {
    if (errorMessage) {
      toast.error(errorMessage);
    }
    return undefined;
  }
}
