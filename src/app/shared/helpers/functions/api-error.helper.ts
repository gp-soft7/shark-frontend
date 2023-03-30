export function apiError(error: any, message: string) {
  if (error.error && error.error.message) {
    return error.error.message === message;
  }

  return false;
}
