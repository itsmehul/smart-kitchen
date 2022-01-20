export function concatCodeWNumber(countrycode: number, phone: number) {
  return Number(`${countrycode}${phone}`);
}

export function handleErrorResponse(
  error: Error | any,
  message = 'Unable to process',
) {
  let errorMessage;
  if (error?.isAxiosError) {
    console.error(error?.response?.data);
  } else if (error instanceof Error) {
    console.error(error.message);
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = message;
  }
  return {
    ok: false,
    error: errorMessage,
  };
}

export function generateRandomNumber(): number {
  return Math.floor(Math.random() * 999999999999) + 1000000000;
}

export function toFixedNumberFormat(number: number): number {
  return parseFloat(number.toFixed(2));
}
