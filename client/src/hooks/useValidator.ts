import { useState } from 'react'

interface State {
  email?: string
  password?: string
  pulse?: string | null // Changed from File to string
  title?: string
  description?: string
  [key: string]: string | undefined | null
}

interface CustomMessages {
  [key: string]: string
}

interface ValidationResult {
  error: State
  isError: boolean
}

const useValidator = () => {
  const [errors, setErrors] = useState<State>({})

  const camelCaseToCapitalized = (str: string): string => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const validate = (
    fields: State,
    customMessages: CustomMessages = {},
  ): ValidationResult => {
    const error: State = {}

    for (const key in fields) {
      const value = fields[key]

      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        const defaultMessage = `${camelCaseToCapitalized(key)} is required!`
        const message = customMessages[key] || defaultMessage
        error[key] = message
      }
    }

    setErrors(error)

    return {
      error,
      isError: Object.keys(error).length !== 0,
    }
  }

  return {
    errors,
    validate,
  }
}

export default useValidator
