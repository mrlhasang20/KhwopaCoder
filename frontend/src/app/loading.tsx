export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
        <h1 className="text-2xl font-bold">Loading...</h1>
        <p className="text-muted-foreground">Please wait</p>
      </div>
    </div>
  )
}
