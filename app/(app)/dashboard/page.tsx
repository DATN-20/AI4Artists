async function fetchData() {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const response = await fetch("https://jsonplaceholder.typicode.com/users")
  const data = await response.json()
  return data
}

export default async function Dashboard() {
  const users = await fetchData()

  return (
    <ul>
      {users.map((user: any) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
