import BigNumber from 'bignumber.js'

export function isNaN(value: any) {
  return new BigNumber(`${value}`).isNaN()
}

export function isNumber(value: any) {
  const isNaNResult = isNaN(value)
  return !isNaNResult
}

export function isInteger(value: any) {
  return new BigNumber(`${value}`).isInteger()
}

export function isPositive(value: any) {
  return new BigNumber(`${value}`).isPositive()
}

export function isNegative(value: any) {
  return new BigNumber(`${value}`).isNegative()
}

export function isZero(value: any) {
  return new BigNumber(`${value}`).isZero()
}

export function countDecimalPlaces(value: any) {
  return new BigNumber(`${value}`).dp()
}

export function convertNumberToString(value: any) {
  return new BigNumber(`${value}`).toString()
}

export function convertStringToNumber(value: any) {
  return new BigNumber(`${value}`).toNumber()
}

export function convertHexToString(hex: any) {
  return new BigNumber(`${hex}`).toString()
}

export function convertStringToHex(value: any) {
  return new BigNumber(`${value}`).toString(16)
}

export function greaterThan(
  numberOne: any,
  numberTwo: any
){
  return (
    new BigNumber(`${numberOne}`).comparedTo(new BigNumber(`${numberTwo}`)) ===
    1
  )
}

export function greaterThanOrEqual(
  numberOne: any,
  numberTwo: any
){
  return (
    new BigNumber(`${numberOne}`).comparedTo(new BigNumber(`${numberTwo}`)) >= 0
  )
}

export function smallerThan(
    numberOne: any,
    numberTwo: any
){
  return (
    new BigNumber(`${numberOne}`).comparedTo(new BigNumber(`${numberTwo}`)) ===
    -1
  )
}

export function smallerThanOrEqual(
    numberOne: any,
    numberTwo: any
){
  return (
    new BigNumber(`${numberOne}`).comparedTo(new BigNumber(`${numberTwo}`)) <= 0
  )
}

export function multiply(
    numberOne: any,
    numberTwo: any
){
  return new BigNumber(`${numberOne}`)
    .times(new BigNumber(`${numberTwo}`))
    .toString()
}

export function divide(
    numberOne: any,
    numberTwo: any
) {
  return new BigNumber(`${numberOne}`)
    .dividedBy(new BigNumber(`${numberTwo}`))
    .toString()
}

export function floorDivide(
    numberOne: any,
    numberTwo: any
) {
  return new BigNumber(`${numberOne}`)
    .dividedToIntegerBy(new BigNumber(`${numberTwo}`))
    .toString()
}

export function mod(
    numberOne: any,
    numberTwo: any
) {
  return new BigNumber(`${numberOne}`)
    .mod(new BigNumber(`${numberTwo}`))
    .toString()
}

export function add(
    numberOne: any,
    numberTwo: any
) {
  return new BigNumber(`${numberOne}`)
    .plus(new BigNumber(`${numberTwo}`))
    .toString()
}

export function subtract(
    numberOne: any,
    numberTwo: any
) {
  return new BigNumber(`${numberOne}`)
    .minus(new BigNumber(`${numberTwo}`))
    .toString()
}

export function convertAmountToRawNumber(
  value: any,
  decimals = 18
) {
  return new BigNumber(`${value}`)
    .times(new BigNumber('10').pow(decimals))
    .toString()
}

export function convertAmountFromRawNumber(
  value: any,
  decimals=18
) {
  return new BigNumber(`${value}`)
    .dividedBy(new BigNumber('10').pow(decimals))
    .toString()
}

export function handleSignificantDecimals(
  value: any,
  decimals: number,
  buffer: number
) {
  if (
    !new BigNumber(`${decimals}`).isInteger() ||
    (buffer && !new BigNumber(`${buffer}`).isInteger())
  ) {
    return null
  }
  buffer = buffer ? convertStringToNumber(buffer) : 3
  decimals = convertStringToNumber(decimals)
  const absolute = new BigNumber(`${value}`).abs().toNumber()
  if (smallerThan(absolute, 1)) {
    decimals = value.slice(2).search(/[^0]/g) + buffer
    decimals = decimals < 8 ? decimals : 8
  } else {
    decimals = decimals < buffer ? decimals : buffer
  }
  let result = new BigNumber(`${value}`).toFixed(decimals)
  result = new BigNumber(`${result}`).toString()
  return new BigNumber(`${result}`).dp()! <= 2
    ? new BigNumber(`${result}`).toFormat(2)
    : new BigNumber(`${result}`).toFormat()
}

export function formatFixedDecimals(value: any, decimals: number) {
  const _value = convertNumberToString(value)
  const _decimals = convertStringToNumber(decimals)
  const result = new BigNumber(
    new BigNumber(_value).toFixed(_decimals)
  ).toString()
  return result
}

export function formatInputDecimals(
  inputOne: any,
  inputTwo: any
) {
  const _nativeAmountDecimalPlaces = countDecimalPlaces(inputTwo)!
  const decimals =
    _nativeAmountDecimalPlaces > 8 ? _nativeAmountDecimalPlaces : 8
  const result = new BigNumber(formatFixedDecimals(inputOne, decimals))
    .toFormat()
    .replace(/,/g, '')
  return result
}
