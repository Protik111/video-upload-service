interface ClassName {
  className?: string
}

const Spinner = ({
  className = 'animate-spin rounded-full h-6 w-6 border-b-2 border-white',
}: ClassName) => {
  return (
    <div className="flex justify-center items-center">
      <div className={className}></div>
    </div>
  )
}

export default Spinner
