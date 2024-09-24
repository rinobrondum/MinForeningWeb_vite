export const required = (value) => (value ? undefined : 'Skal udfyldes')
export const email = (value) =>
  /\S+@\S+/.test(value) ? undefined : 'Email er ikke valid'
export const numeric = (value) =>
  !value || /^\d+$/.test(value) ? undefined : 'Må kun være tal'
export const length = (length) => (value) =>
  value && value.length === length ? undefined : `Skal være ${length} tegn`
export const length4 = length(4)
