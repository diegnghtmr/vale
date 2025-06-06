export const handleNumericInput = (e: React.FormEvent<HTMLInputElement>) => {
  const input = e.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, '');
}; 