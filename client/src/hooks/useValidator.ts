import { useState } from 'react'

interface State {
  email?: string
  password?: string
}

const useValidator = () => {
  const [errors, setErrors] = useState<State>({})

  const camelCaseToCapitalized = (str: string) => {
    // Convert camelCase to space-separated words and capitalize each word
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, function (str) {
        return str.toUpperCase()
      })
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const validate = (fields, customMessages = {}) => {
    let error = {}

    for (let key in fields) {
      if (!fields[key]) {
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
